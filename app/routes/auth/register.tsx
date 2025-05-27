import { useMutation } from "@apollo/client/react/hooks";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router";

import {
  Box,
  Button,
  Field,
  Input,
  Stack,
  Heading,
  Text,
  Link as ChakraLink,
  Fieldset,
} from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";
import { SIGN_UP } from "@/graphql/auth";

interface RegisterForm {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [signUp, { loading }] = useMutation(SIGN_UP);
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (formData: RegisterForm) => {
    try {
      const { data } = await signUp({
        variables: {
          userInput: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          },
        },
      });

      if (data?.signUp) {
        toaster.create({
          title: "¡Registro exitoso!",
          type: "success",
          duration: 3000,
        });

        navigate("/login", { viewTransition: true });
      }
    } catch (error: any) {
      console.log(error);

      toaster.create({
        title: "Error al registrarse",
        description: error.message || "Algo salió mal. Intenta de nuevo.",
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
      flexDirection={{ base: "column", md: "row-reverse" }}
      justifyContent="center"
      minH="100%"
      p={4}
    >
      {/* Contenedor del formulario */}
      <Box
        as="form"
        bg="gray.contrast"
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="xl"
        maxWidth="500px"
        mt={{ base: 20, md: 0 }}
        p={8}
        width={{ base: "90%", sm: "80%", md: "450px" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack gap={4}>
          <Heading
            as="h1"
            color="bg.inverted"
            mb={4}
            size="lg"
            textAlign="center"
          >
            Crea tu Cuenta
          </Heading>

          <Fieldset.Root>
            {/* Campo Usuario */}
            <Field.Root invalid={!!errors.username}>
              <Field.Label>Usuario</Field.Label>
              <Input
                placeholder="Ej: nuevo_usuario"
                {...register("username", {
                  required: "El usuario es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
              />
              {errors.username && (
                <Field.ErrorText>{errors.username.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* Campo Email */}
            <Field.Root invalid={!!errors.email}>
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="Ej: tu@email.com"
                type="email"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email inválido",
                  },
                })}
              />
              {errors.email && (
                <Field.ErrorText>{errors.email.message}</Field.ErrorText>
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
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
              />
              {errors.password && (
                <Field.ErrorText>{errors.password.message}</Field.ErrorText>
              )}
            </Field.Root>

            {/* Campo Confirmar Contraseña */}
            <Field.Root invalid={!!errors.confirmPassword}>
              <Field.Label>Confirmar Contraseña</Field.Label>
              <Input
                placeholder="••••••"
                type="password"
                {...register("confirmPassword", {
                  required: "Confirma tu contraseña",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
              />
              {errors.confirmPassword && (
                <Field.ErrorText>
                  {errors.confirmPassword.message}
                </Field.ErrorText>
              )}
            </Field.Root>
          </Fieldset.Root>

          <Button
            colorScheme="blue"
            loading={loading}
            loadingText="Registrando..."
            size="lg"
            type="submit"
            width="full"
          >
            Registrarme
          </Button>

          <Text color="bg.inverted" mt={4} textAlign="center">
            ¿Ya tienes una cuenta?{" "}
            <ChakraLink asChild color="blue.500" fontWeight="bold">
              <RouterLink to="/login"> Inicia sesión aquí</RouterLink>
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
