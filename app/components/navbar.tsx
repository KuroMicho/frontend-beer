import { useMutation } from "@apollo/client/react/hooks";
import { FaBeer } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router";

import {
  Box,
  Flex,
  Link as ChakraLink,
  Button,
  Spacer,
  Text,
} from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";
import { SIGN_OUT } from "@/graphql/auth";
import { clearTokens } from "@/lib/auth";
import useAuthStore from "@/store/auth";

import { ColorModeButton } from "./ui/color-mode";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [signOutMutation] = useMutation(SIGN_OUT);

  const handleLogout = async () => {
    try {
      await signOutMutation({
        variables: {
          usernameInput: {
            username: user?.username,
          },
        },
      });
      clearTokens();
      logout();

      toaster.create({
        title: "¡Sesión cerrada!",
        type: "info",
        duration: 2000,
      });

      navigate("/login");
    } catch (error: any) {
      toaster.create({
        title: "Error al cerrar sesión",
        description: error.message || "Ocurrió un error inesperado.",
        type: "error",
        duration: 3000,
      });
      console.error("Logout error:", error);
    }
  };

  const navLinkStyles = {
    p: 3,
    mb: { base: 0, md: 2 },
    mr: { base: 4, md: 0 },
    textDecoration: "none",
    borderRadius: "md",
    _hover: { bg: "orange.contrast" },
    _active: {
      borderLeft: "4px solid",
      borderColor: "orange.contrast",
      fontWeight: "bold",
    },
  };

  return (
    <Flex
      alignItems={{ base: "center", md: "flex-start" }}
      as="nav"
      bg="orange.subtle"
      borderColor={{ base: "none", md: "gray.200" }}
      borderRight={{ base: "none", md: "1px solid" }}
      boxShadow={{ base: "md", md: "none" }}
      direction={{ base: "row", md: "column" }}
      h={{ base: "auto", md: "100vh" }}
      justifyContent={{ base: "space-between", md: "space-between" }}
      left={0}
      p={4}
      position={{ base: "fixed", md: "relative" }}
      top={0}
      w={{ base: "100%", md: "240px" }}
      zIndex={10}
    >
      {/* Logo/Title Section */}
      <Box flexShrink={0} mb={{ base: 0, md: 8 }} textAlign="center">
        <FaBeer color="orange.contrast" size="32px" />
        <Box
          display={{ base: "none", md: "block" }}
          fontSize="xl"
          fontWeight="bold"
          mt={2}
        >
          {/* Hide title on small screens to save space */}
          Cervecería Artesanal
        </Box>
      </Box>
      {/* Navigation Links */}
      <Flex
        alignItems={{ base: "center", md: "initial" }}
        direction={{ base: "row", md: "column" }}
        flex={1}
        justifyContent={{ base: "flex-end", md: "initial" }}
        spaceX={{ base: "4", md: "initial" }}
        w="100%"
      >
        <ChakraLink asChild {...navLinkStyles}>
          <RouterLink to="/">Inicio</RouterLink>
        </ChakraLink>

        {isAuthenticated ? (
          <ChakraLink asChild {...navLinkStyles}>
            <RouterLink to="/products">Productos</RouterLink>
          </ChakraLink>
        ) : (
          <>
            <ChakraLink asChild {...navLinkStyles}>
              <RouterLink to="/login">Iniciar Sesion</RouterLink>
            </ChakraLink>
            <ChakraLink asChild {...navLinkStyles}>
              <RouterLink to="/register">Registrarse</RouterLink>
            </ChakraLink>
          </>
        )}
      </Flex>
      {/* User Info / Auth Buttons / Color Mode Toggle */}
      <Spacer display={{ base: "none", md: "block" }} />{" "}
      {/* Pushes items to bottom on desktop */}
      <Flex
        alignItems={{ base: "center", md: "flex-start" }}
        direction={{ base: "row", md: "column" }}
        gap={{ base: 4, md: 2 }}
        mt={{ base: 0, md: 4 }}
      >
        {/* User Greeting if Authenticated */}
        {isAuthenticated && user?.username && (
          <Text
            color="bg.inverted"
            display={{ base: "none", md: "block" }}
            fontSize="md"
            fontWeight="semibold"
            mb={2}
            textAlign="center"
            w="100%"
          >
            Hola, {user.username}
          </Text>
        )}

        {/* Logout Button (only if authenticated) */}
        {isAuthenticated && (
          <Button
            colorScheme="red"
            size="sm"
            variant="outline"
            width={{ base: "auto", md: "full" }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        )}

        {/* Color Mode Toggle */}
        <Box
          display="flex"
          justifyContent={{ base: "flex-end", md: "flex-start" }}
          mt={{ base: 0, md: 4 }}
          width={{ base: "auto", md: "full" }}
        >
          <ColorModeButton />
        </Box>
      </Flex>
    </Flex>
  );
}
