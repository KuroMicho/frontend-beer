import { useForm } from "react-hook-form";
import { Button, Field, Input, Stack, Fieldset } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useMutation } from "@apollo/client/react/hooks";
import { SIGN_IN } from "@/graphql/auth";
import { setAccessToken } from "@/lib/auth";
import { useNavigate } from "react-router";
interface LoginForm {
  username?: string;
  password?: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signIn, { data, loading, error }] = useMutation(SIGN_IN);
  const navigate = useNavigate();

  const onSubmit = async (e: LoginForm) => {
    try {
      const { data } = await signIn({
        variables: {
          userInput: {
            username: e.username,
            password: e.password,
          },
        },
      });
  
      if (data?.signIn) {
        setAccessToken(data.signIn.token);
        localStorage.setItem("refreshToken", data.signIn.refreshToken);
  
        toaster.create({
          title: "¡Bienvenido!",
          type: "info",
          duration: 2000, // Aumenté la duración para que sea visible
        });
  
        navigate("/products", { viewTransition: true });
      }
    } catch (error) {
      toaster.create({
        title: "Error en login",
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <Fieldset.Root>
          {/* Campo Usuario */}
          <Field.Root invalid={!!errors.username}>
            <Field.Label>Usuario</Field.Label>
            <Input
              placeholder="Ej: usuario123"
              {...register("username", {
                required: "Campo obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
            />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>

          {/* Campo Contraseña */}
          <Field.Root invalid={!!errors.password}>
            <Field.Label>Contraseña</Field.Label>
            <Input
              type="password"
              placeholder="••••••"
              {...register("password", {
                required: "Campo obligatorio",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            <Field.ErrorText></Field.ErrorText>
          </Field.Root>
        </Fieldset.Root>

        <Button
          type="submit"
          colorScheme="blue"
          loading={loading}
          loadingText="Ingresando..."
          width="full"
        >
          Iniciar Sesión
        </Button>
      </Stack>
    </form>
  );
}
