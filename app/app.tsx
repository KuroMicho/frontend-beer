import { lazy, Suspense } from "react";

import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
  Link as RouterLink,
} from "react-router";

import "./app.css";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import { Provider } from "./components/ui/provider";
import RootLayout from "./layouts/RootLayout";

const Home = lazy(() => import("./routes/home"));
const CheckoutPage = lazy(() => import("./routes/checkout"));
const ProductsPage = lazy(() => import("./routes/products"));
const Login = lazy(() => import("./routes/auth/login"));
const Register = lazy(() => import("./routes/auth/register"));
const AuthRouter = lazy(() => import("./routes/auth/AuthRouter"));

export function ErrorBoundary() {
  const error: any = useRouteError();
  let message = "Oops!";
  let details = "Ha ocurrido un error inesperado.";
  let stack: string | undefined;

  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    "statusText" in error
  ) {
    const routeError = error as { status: number; statusText: string };
    message =
      routeError.status === 404
        ? "Página no encontrada"
        : `Error ${routeError.status}`;
    details =
      routeError.status === 404
        ? "La página solicitada no pudo ser encontrada."
        : routeError.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <VStack
      alignItems="center"
      bg="gray.50"
      color="gray.700"
      justifyContent="center"
      minH="100vh"
      p={4}
      textAlign="center"
    >
      <Heading as="h1" mb={4} size="xl">
        {message}
      </Heading>
      <Text fontSize="lg" mb={6}>
        {details}
      </Text>
      {stack && import.meta.env.DEV && (
        <Box
          bg="gray.100"
          borderRadius="md"
          fontFamily="monospace"
          fontSize="sm"
          maxW="md"
          overflowX="auto"
          p={4}
          textAlign="left"
        >
          <pre>
            <code>{stack}</code>
          </pre>
        </Box>
      )}
      <RouterLink style={{ textDecoration: "underline", color: "blue" }} to="/">
        Volver a Inicio
      </RouterLink>
    </VStack>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,

    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Cargando página principal...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<div>Cargando inicio de sesión...</div>}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<div>Cargando registro...</div>}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<div>Cargando lista de productos...</div>}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: "checkout",
        element: (
          <Suspense fallback={<div>Cargando orden...</div>}>
            <CheckoutPage />
          </Suspense>
        ),
      },

      {
        element: <AuthRouter />,
        children: [
          {
            path: "products",
            element: (
              <Suspense fallback={<div>Cargando lista de productos...</div>}>
                <ProductsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);

export default function App() {
  return (
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  );
}
