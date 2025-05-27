import { Outlet } from "react-router";

import { Box, Flex } from "@chakra-ui/react";

import Navbar from "../components/navbar";
import { Toaster } from "../components/ui/toaster";

export default function RootLayout() {
  return (
    <Flex
      bg={{ base: "white", _dark: "black" }}
      direction={{ base: "column", md: "row" }}
      minH="100vh"
    >
      <Box
        boxShadow={{ base: "md", md: "none" }}
        flexShrink="0"
        h={{ base: "auto", md: "100vh" }}
        left="0"
        overflowY={{ base: "hidden", md: "auto" }}
        position={{ base: "fixed", md: "sticky" }}
        top="0"
        width={{ base: "100%", md: "240px" }}
        zIndex={1000}
      >
        <Navbar />
      </Box>
      <Box
        flex="1"
        minH="100vh"
        overflowY="hidden"
        p={{ base: 4, md: 8 }}
        pt={{ base: "60px", md: "0" }}
      >
        <Outlet />
        <Toaster />
      </Box>
    </Flex>
  );
}
