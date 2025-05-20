"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

import { ApolloProvider } from "@apollo/client/react/context/ApolloProvider";
import { client } from "@/lib/apollo";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
