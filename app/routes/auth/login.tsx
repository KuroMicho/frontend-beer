import { useMutation } from "@apollo/client/react/hooks";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router";

import {
  Button,
  Field,
  Input,
  Stack,
  Fieldset,
  Box,
  Heading,
  Image,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";

import loginImage from "@/assets/images/login.jpg";
import { toaster } from "@/components/ui/toaster";
import { SIGN_IN } from "@/graphql/auth";
import { setAccessToken, setRefreshToken } from "@/lib/auth";
import useAuthStore from "@/store/auth";

interface LoginForm {
  username?: string;
  password?: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [signIn, { loading }] = useMutation(SIGN_IN);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onSubmit = async (formData: LoginForm) => {
    try {
      const { data } = await signIn({
        variables: {
          userInput: {
            username: formData.username,
            password: formData.password,
          },
        },
      });

      if (data?.signIn) {
        setAccessToken(data.signIn.token);
        setRefreshToken(data.signIn.refreshToken);

        login({
          username: formData.username,
        });

        toaster.create({
          title: "¡Bienvenido!",
          type: "info",
          duration: 3000,
        });

        navigate("/products", { viewTransition: true });
      }
    } catch (error: any) {
      toaster.create({
        title: "Error al iniciar sesión",
        description:
          error.message || "Credenciales inválidas. Intenta de nuevo.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box
      alignItems="center"
      bg="gray.contrast"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      justifyContent="center"
      minH="100%"
      p={4}
    >
      {/* Contenedor de la imagen */}
      <Box
        flexShrink={0}
        mb={{ base: 8, md: 0 }}
        mr={{ base: 0, md: 8 }}
        mt={{ base: 20, md: 0 }}
        textAlign="center"
      >
        <Image
          alt="Imagen de una cerveza artesanal"
          borderRadius="lg"
          boxSize={{ base: "400px", md: "500px" }}
          objectFit="cover"
          src={loginImage}
        />
      </Box>

      {/* Contenedor del formulario */}
      <Box
        as="form"
        bg="gray.contrast"
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="xl"
        maxWidth="450px"
        p={8}
        width={{ base: "90%", sm: "80%", md: "600px" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack gap={6}>
          {" "}
          {/* Adjusted spacing */}
          <Heading
            as="h1"
            color="bg.inverted"
            mb={4}
            size="lg"
            textAlign="center"
          >
            Bienvenido a tu Cervecería
          </Heading>
          <Fieldset.Root>
            {/* Campo Usuario */}
            <Field.Root invalid={!!errors.username}>
              <Field.Label>Usuario</Field.Label>
              <Input
                placeholder="Ej: usuario123"
                {...register("username", {
                  required: "El usuario es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El usuario debe tener al menos 3 caracteres",
                  },
                })}
              />
              {errors.username && (
                <Field.ErrorText>{errors.username.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* Campo Contraseña */}
            <Field.Root invalid={!!errors.password}>
              <Field.Label>Contraseña</Field.Label>
              <Input
                placeholder="••••••"
                type="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <Field.ErrorText>{errors.password.message}</Field.ErrorText>
              )}
            </Field.Root>
          </Fieldset.Root>
          <Button
            colorScheme="blue"
            loading={loading}
            loadingText="Ingresando..."
            size="lg"
            type="submit"
            width="full"
          >
            Iniciar Sesión
          </Button>
          <Text color="bg.inverted" mt={4} textAlign="center">
            ¿No tienes una cuenta?{" "}
            <ChakraLink asChild color="blue.500" fontWeight="bold">
              <RouterLink to="/register">Registrarse</RouterLink>
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
