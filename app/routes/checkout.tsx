import { useState, useMemo } from "react";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react/hooks";
import { LuTrash } from "react-icons/lu";

import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Heading,
  Center,
  Spinner,
  NumberInput,
  Field,
} from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";
import { CREATE_ORDER } from "@/graphql/orders";
import { ALL_PRODUCTS } from "@/graphql/products";

import { useCartStore } from "../store/cart";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface OrderInput {
  id?: string;
  name: string;
  products: { id: string; quantity: number }[];
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}

interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
}

const CREATE_PAYMENT_PREFERENCE = gql`
  mutation CreatePaymentPreference(
    $items: [PaymentItemInput!]!
    $payer: PayerInput!
  ) {
    createPaymentPreference(items: $items, payer: $payer) {
      id
      init_point # URL de redirección si no usas el componente Wallet
    }
  }
`;

interface PaymentItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

interface PayerInput {
  email: string;
}

export default function Checkout() {
  const [orderName, setOrderName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const { cartItems } = useCartStore();
  const updateCartItemQuantity = useCartStore(
    (state) => state.updateCartItemQuantity
  );
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch,
  } = useQuery<{ allProducts: Product[] }>(ALL_PRODUCTS);

  const availableProductsMap = useMemo(() => {
    const map = new Map<string, Product>();
    productsData?.allProducts.forEach((p) => {
      map.set(p.id, p);
    });
    return map;
  }, [productsData]);

  const [createOrder, { loading: createOrderLoading }] = useMutation<
    { createOrder: OrderInput },
    { data: OrderInput }
  >(CREATE_ORDER, {
    onCompleted: (data) => {
      toaster.create({
        title: "Orden creada.",
        description: `La orden "${data.createOrder.name}" ha sido creada con éxito. ID: ${data.createOrder.id}`,
        type: "success",
        duration: 5000,
      });
      setOrderName("");
      clearCart();
    },
    onError: (error) => {
      toaster.create({
        title: "Error al crear la orden.",
        description: error.message,
        type: "error",
        duration: 9000,
      });
    },
  });

  const [createMercadoPagoPreference, { loading: preferenceLoading }] =
    useMutation<
      { createMercadoPagoPaymentPreference: MercadoPagoPreferenceResponse },
      { items: PaymentItemInput[]; payer: PayerInput }
    >(CREATE_PAYMENT_PREFERENCE, {
      onCompleted: (data) => {
        if (data.createMercadoPagoPaymentPreference.init_point) {
          toaster.create({
            title: "Redirigiendo a Mercado Pago...",
            description:
              "Serás llevado a la página de pago para completar la transacción.",
            type: "info",
            duration: 3000,
          });
          setIsRedirecting(true);
          window.location.href =
            data.createMercadoPagoPaymentPreference.init_point;
        } else {
          toaster.create({
            title: "Error de preferencia",
            description: "No se recibió la URL de pago de Mercado Pago.",
            type: "error",
            duration: 5000,
          });
        }
      },
      onError: (error) => {
        toaster.create({
          title: "Error al generar preferencia de pago.",
          description: error.message,
          type: "error",
          duration: 9000,
        });
        setIsRedirecting(false);
      },
    });

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleUpdateCartItemQuantity = (
    productId: string,
    newQuantity: number
  ) => {
    const cartItem = cartItems.find((item) => item.productId === productId);
    const productDetail = availableProductsMap.get(productId);

    if (!cartItem || !productDetail) {
      toaster.create({
        title: "Error de producto",
        description: "Producto no encontrado en el inventario.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (newQuantity <= 0) {
      removeCartItem(productId);
      toaster.create({
        title: "Producto eliminado",
        description: `${cartItem.productName} ha sido eliminado del carrito.`,
        type: "info",
        duration: 2000,
      });
      return;
    }

    if (newQuantity > productDetail.stock) {
      toaster.create({
        title: "Stock limitado",
        description: `Solo hay ${productDetail.stock} unidades disponibles de ${cartItem.productName}.`,
        type: "warning",
        duration: 3000,
      });

      updateCartItemQuantity(productId, productDetail.stock);
    } else {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cartItems.find((i) => i.productId === productId);
    removeCartItem(productId);
    toaster.create({
      title: "Producto eliminado",
      description: `${item?.productName || "El producto"} ha sido eliminado del carrito.`,
      type: "info",
      duration: 2000,
    });
  };

  const handleGeneratePayment = async () => {
    if (!orderName.trim()) {
      toaster.create({
        title: "Nombre de la orden requerido.",
        description: "Por favor, ingresa un nombre para la orden.",
        type: "warning",
        duration: 3000,
      });
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      toaster.create({
        title: "Email requerido.",
        description: "Por favor, ingresa un email válido para el pago.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    if (cartItems.length === 0) {
      toaster.create({
        title: "Carrito vacío.",
        description: "Por favor, agrega al menos un producto al carrito.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    const hasStockIssues = cartItems.some((cartItem) => {
      const productDetail = availableProductsMap.get(cartItem.productId);
      return !productDetail || cartItem.quantity > productDetail.stock;
    });

    if (hasStockIssues) {
      toaster.create({
        title: "Problema de stock",
        description:
          "Una o más cantidades en tu carrito exceden el stock disponible. Por favor, ajusta las cantidades.",
        type: "error",
        duration: 5000,
      });
      return;
    }

    const mpItems: PaymentItemInput[] = cartItems.map((item) => ({
      id: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      description: `Producto: ${item.productName}`,
      imageUrl: `https://via.placeholder.com/150?text=${item.productName.replace(/\s/g, "+")}`,
    }));

    try {
      await createMercadoPagoPreference({
        variables: {
          items: mpItems,
          payer: { email: customerEmail },
        },
      });
    } catch (error) {}
  };

  const handleSubmitOrder = async () => {
    if (!orderName.trim()) {
      toaster.create({
        title: "Nombre de la orden requerido.",
        description: "Por favor, ingresa un nombre para la orden.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    if (cartItems.length === 0) {
      toaster.create({
        title: "Carrito vacío.",
        description: "No se puede crear una orden sin productos.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    const hasStockIssues = cartItems.some((cartItem) => {
      const productDetail = availableProductsMap.get(cartItem.productId);
      return !productDetail || cartItem.quantity > productDetail.stock;
    });

    if (hasStockIssues) {
      toaster.create({
        title: "Problema de stock",
        description:
          "Una o más cantidades en tu carrito exceden el stock disponible. Por favor, ajusta las cantidades.",
        type: "error",
        duration: 5000,
      });
      return;
    }

    const orderData: OrderInput = {
      name: orderName,
      products: cartItems.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      })),
      status: "PENDING",
    };

    try {
      await createOrder({ variables: { data: orderData } });
    } catch (error) {}
  };

  if (productsLoading) {
    return (
      <Center flexDirection="column" minH="100vh">
        <Spinner color="blue.500" size="xl" />
        <Text fontSize="xl" mt={4}>
          Cargando productos para validación...
        </Text>
      </Center>
    );
  }

  if (productsError) {
    return (
      <Center flexDirection="column" minH="100vh">
        <Text color="red.500" fontSize="xl">
          Error al cargar productos: {productsError.message}
        </Text>
        <Button mt={4} onClick={() => refetch()}>
          Reintentar
        </Button>
      </Center>
    );
  }

  return (
    <VStack
      alignItems="center"
      bg="gray.contrast"
      justifyContent="center"
      minH="100vh"
      p={4}
    >
      <Box
        bg="gray.contrast"
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="xl"
        maxWidth="700px"
        mt={{ base: 20, md: 0 }}
        p={6}
        width="full"
      >
        <Heading as="h2" color="teal.600" mb={8} size="xl" textAlign="center">
          Finalizar Compra
        </Heading>

        <VStack align="stretch" gap={6}>
          <Field.Root id="order-name">
            <Field.Label fontWeight="bold">
              Nombre de la Orden / Cliente
            </Field.Label>
            <Input
              required
              placeholder="Ej. Mi compra de la semana"
              size="lg"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
            />
          </Field.Root>

          <Field.Root id="customer-email">
            <Field.Label fontWeight="bold">
              Email del Cliente (para Mercado Pago)
            </Field.Label>
            <Input
              required
              placeholder="ejemplo@correo.com"
              size="lg"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </Field.Root>

          <Box divideY={"2px"} />

          <Heading as="h3" mb={2} size="md">
            Productos en tu Carrito ({cartItems.length} ítems)
          </Heading>
          {cartItems.length === 0 ? (
            <Text color="gray.500" fontSize="md" p={4} textAlign="center">
              Tu carrito está vacío. Regresa a{" "}
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => (window.location.href = "/products")}
              >
                productos
              </Button>{" "}
              para agregar algo.
            </Text>
          ) : (
            <VStack align="stretch" gap={4}>
              {cartItems.map((item) => {
                const productDetail = availableProductsMap.get(item.productId);
                const maxStock = productDetail
                  ? productDetail.stock
                  : item.stock;

                return (
                  <HStack
                    bg="gray.contrast"
                    borderRadius="md"
                    borderWidth="1px"
                    justifyContent="space-between"
                    key={item.productId}
                    p={3}
                  >
                    <Box>
                      <Text fontSize="lg" fontWeight="bold">
                        {item.productName}
                      </Text>
                      <Text color="gray.600" fontSize="sm">
                        ${item.price.toFixed(2)} c/u
                      </Text>
                      {productDetail && item.quantity > productDetail.stock && (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          ¡Solo quedan {productDetail.stock} en stock!
                        </Text>
                      )}
                    </Box>
                    <HStack gap={3}>
                      <NumberInput.Root
                        max={maxStock}
                        maxW="100px"
                        min={1}
                        size="md"
                        value={item.quantity.toString()}
                        onValueChange={(details) =>
                          handleUpdateCartItemQuantity(
                            item.productId,
                            details.valueAsNumber || 0
                          )
                        }
                      >
                        <NumberInput.Control />
                        <NumberInput.Input />
                      </NumberInput.Root>
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        minW="80px"
                        textAlign="right"
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <IconButton
                        aria-label="Eliminar producto"
                        colorPalette="red"
                        size="md"
                        onClick={() => handleRemoveFromCart(item.productId)}
                      >
                        <LuTrash />
                      </IconButton>
                    </HStack>
                  </HStack>
                );
              })}
            </VStack>
          )}

          <Box divideY={"2px"} />

          <HStack justifyContent="space-between" pt={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Total a Pagar:
            </Text>
            <Text color="green.600" fontSize="2xl" fontWeight="bold">
              ${cartTotal.toFixed(2)}
            </Text>
          </HStack>

          <Button
            colorScheme="blue"
            disabled={
              !orderName.trim() ||
              !customerEmail.trim() ||
              cartItems.length === 0 ||
              productsLoading ||
              isRedirecting
            }
            loading={preferenceLoading || isRedirecting}
            mt={4}
            size="lg"
            onClick={handleGeneratePayment}
          >
            {isRedirecting ? "Redirigiendo..." : "Pagar con Mercado Pago"}
          </Button>

          <Text color="gray.500" fontSize="sm" mt={2} textAlign="center">
            Serás redirigido a la página de Mercado Pago para completar tu
            compra.
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
}
