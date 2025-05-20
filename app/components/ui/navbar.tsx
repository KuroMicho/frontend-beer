import { Box, Flex, Link as ChakraLink } from "@chakra-ui/react";
import { ColorModeButton, useColorModeValue } from "./color-mode";
import { Link as RouterLink } from "react-router";
import { FaBeer } from "react-icons/fa";

export default function Navbar() {
  return (
    <Flex
      as="nav"
      p={4}
      bg="orange.subtle"
      h="100%"
      borderRight="1px solid"
      borderColor={"orange.subtle"}
      w={{ base: "100%", md: "240px" }}
      direction={{ base: "row", md: "column" }}
    >
      <Box mb={8} textAlign="center">
        <FaBeer
          size="32px"
          color={useColorModeValue("orange.800", "orange.200")}
        />
        <Box fontWeight="bold" mt={2} fontSize="xl">
          Cervecería Artesanal
        </Box>
      </Box>

      <Flex
        direction={{ base: "row", md: "column" }}
        alignItems={{ base: "center", md: "initial" }}
        spaceX={{ base: "4", md: "initial" }}
        flex={1}
        justifyContent={{ base: "flex-end", md: "initial" }}
      >
        <ChakraLink
          asChild
          p={3}
          mb={2}
          textDecoration={"none"}
          borderRadius="md"
          _hover={{ bg: "orange.contrast" }}
          _active={{
            borderLeft: "4px solid",
            borderColor: "orange.contrast",
            fontWeight: "bold",
          }}
        >
          <RouterLink to="/">Inicio</RouterLink>
        </ChakraLink>
        <ChakraLink
          asChild
          p={3}
          mb={2}
          textDecoration={"none"}
          borderRadius="md"
          _hover={{ bg: "orange.contrast" }}
          _active={{
            borderLeft: "4px solid",
            borderColor: "orange.contrast",
            fontWeight: "bold",
          }}
        >
          <RouterLink to="/login">Iniciar Sesión</RouterLink>
        </ChakraLink>
        <ChakraLink
          asChild
          p={3}
          mb={2}
          textDecoration={"none"}
          borderRadius="md"
          _hover={{ bg: "orange.contrast" }}
          _active={{
            borderLeft: "4px solid",
            borderColor: "orange.contrast",
            fontWeight: "bold",
          }}
        >
          <RouterLink to="/register">Registro</RouterLink>
        </ChakraLink>
        <ChakraLink
          asChild
          p={3}
          mb={2}
          textDecoration={"none"}
          borderRadius="md"
          _hover={{ bg: "orange.contrast" }}
          _active={{
            borderLeft: "4px solid",
            borderColor: "orange.contrast",
            fontWeight: "bold",
          }}
        >
          <RouterLink to="/products">Productos</RouterLink>
        </ChakraLink>
      </Flex>
      <Box
        mb={1}
        textAlign="center"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <ColorModeButton />
      </Box>
    </Flex>
  );
}
