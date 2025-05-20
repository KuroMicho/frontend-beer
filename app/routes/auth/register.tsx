import { VStack, Input, Button, Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router";

export default function Register() {
  return (
    <VStack p={8}>
      <Input placeholder="Username" />
      <Input placeholder="Email" />
      <Input placeholder="First Name" />
      <Input placeholder="Last Name Name" />
      <Button colorScheme="teal">Ingresar</Button>
      <ChakraLink asChild colorPalette="pink" p={3} _hover={{ textDecoration: "none" }}>
        <RouterLink to="/login">Ya tienes cuenta?</RouterLink>
      </ChakraLink>
    </VStack>
  );
}
