import { HttpLink } from "@apollo/client/link/http";
import { ApolloClient } from "@apollo/client/core/ApolloClient";
import { InMemoryCache } from "@apollo/client/cache/inmemory/inMemoryCache";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getAccessToken, setAccessToken, refreshToken } from "./auth";
import { from } from "@apollo/client/link/core/from";
import { Observable } from "@apollo/client/utilities/observables/Observable";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

// Interceptor para agregar el token a las requests
const authLink = setContext(async (_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
