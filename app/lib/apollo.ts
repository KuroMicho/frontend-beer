import { InMemoryCache } from "@apollo/client/cache/inmemory/inMemoryCache";
import { ApolloClient } from "@apollo/client/core/ApolloClient";
import { setContext } from "@apollo/client/link/context";
import { from } from "@apollo/client/link/core/from";
import { onError } from "@apollo/client/link/error";
import { HttpLink } from "@apollo/client/link/http";
import { Observable } from "@apollo/client/utilities/observables/Observable";

import { toaster } from "@/components/ui/toaster";
import { REFRESH_TOKEN } from "@/graphql/auth";
import { type AuthStore } from "@/store/auth";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./auth";

const API_URI = "http://localhost:4000/graphql";
const REFRESH_TOKEN_OPERATION_NAME = "RefreshToken";

let authStoreInstance: AuthStore | null = null;

export const initializeAuthStore = (store: AuthStore) => {
  authStoreInstance = store;
};

const logoutUser = (message?: string) => {
  if (authStoreInstance) {
    authStoreInstance.logout();
  }
  clearTokens();
  toaster.create({
    title: "Sesión expirada",
    description: message || "Por favor, inicia sesión de nuevo.",
    type: "warning",
    duration: 3000,
  });
};

const httpLink = new HttpLink({
  uri: API_URI,
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.log(
          `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`,
        );

        const isAuthError =
          err.extensions?.code === "UNAUTHENTICATED" ||
          err.message.includes("Autenticación requerida") ||
          err.message.includes("401") ||
          err.message.includes("Unauthorized") ||
          err.message.includes("jwt expired");
        if (
          !isAuthError ||
          operation.operationName === REFRESH_TOKEN_OPERATION_NAME
        ) {
          return;
        }

        const storedRefreshToken = getRefreshToken();
        if (!storedRefreshToken) {
          logoutUser(
            "No se encontró token de refresco. Inicia sesión de nuevo.",
          );
          return;
        }

        return new Observable((observer) => {
          callRefreshTokenMutation(storedRefreshToken)
            .then((data) => {
              const newAccessToken = data?.refreshToken?.accessToken;
              const newRefreshToken = data?.refreshToken?.refreshToken;

              if (newAccessToken && newRefreshToken) {
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                console.log(
                  "Tokens refreshed successfully. Retrying original operation.",
                );

                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              } else {
                logoutUser(
                  "Respuesta de refresco incompleta. Inicia sesión de nuevo.",
                );
                observer.error(err);
              }
            })
            .catch((refreshError) => {
              console.error("Failed to refresh token:", refreshError);
              logoutUser("Error al refrescar token. Inicia sesión de nuevo.");
              observer.error(err);
            });
        });
      }
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  },
);

const callRefreshTokenMutation = async (refreshTokenValue: string) => {
  const tempClient = new ApolloClient({
    link: new HttpLink({ uri: API_URI, credentials: "include" }),
    cache: new InMemoryCache(),
  });

  const { data, errors } = await tempClient.mutate({
    mutation: REFRESH_TOKEN,
    variables: {
      refreshInput: {
        refreshToken: refreshTokenValue,
      },
    },

    context: {
      headers: {},
    },
  });

  if (errors) {
    throw new Error(
      `GraphQL Errors during refresh: ${errors
        .map((e) => e.message)
        .join(", ")}`,
    );
  }

  return data;
};

export const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});
