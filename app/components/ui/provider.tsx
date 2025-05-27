"use client";

import { useEffect } from "react";

import { ApolloProvider } from "@apollo/client/react/context/ApolloProvider";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";


import { client, initializeAuthStore } from "@/lib/apollo";
import useAuthStore from "@/store/auth";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";


export function Provider(props: ColorModeProviderProps) {
  const authStore = useAuthStore();
  useEffect(() => {
    initializeAuthStore(authStore);
  }, [authStore]);

  return (
    <ApolloProvider client={client}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
