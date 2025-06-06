import React from "react";

import { LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  Button,
  VStack,
  Text,
  HStack,
  NumberInput,
  IconButton,
  Portal,
} from "@chakra-ui/react";

import { useCartStore } from "../store/cart";

import { toaster } from "./ui/toaster";


export const CartSidebar: React.FC = () => {
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.cartItems);
  const isSidebarOpen = useCartStore((state) => state.isSidebarOpen);
  const onCloseSidebar = useCartStore((state) => state.onCloseSidebar);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const updateCartItemQuantity = useCartStore(
    (state) => state.updateCartItemQuantity
  );

  const handleGoToCheckout = () => {
    onCloseSidebar();
    navigate("/checkout");
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    if (newQuantity <= 0) {
      removeCartItem(productId);
      toaster.create({
        title: "Producto eliminado",
        description: "Se ha eliminado el producto del carrito.",
        type: "info",
        duration: 2000,
      });
      return;
    }

    if (newQuantity > item.stock) {
      toaster.create({
        title: "Stock limitado",
        description: `Solo hay ${item.stock} unidades disponibles de ${item.productName}.`,
        type: "warning",
        duration: 3000,
      });
    }

    updateCartItemQuantity(productId, newQuantity);
  };

  return (
    <Drawer.Root open={isSidebarOpen} size="sm" onOpenChange={onCloseSidebar}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              Tu Carrito ({totalItems} ítems)
            </DrawerHeader>

            <DrawerBody>
              {cartItems.length === 0 ? (
                <Text color="gray.500" mt={4} textAlign="center">
                  Tu carrito está vacío.
                </Text>
              ) : (
                <VStack align="stretch" gap={4}>
                  {cartItems.map((item) => (
                    <HStack
                      alignItems="center"
                      borderRadius="md"
                      borderWidth="1px"
                      gap={4}
                      justifyContent="flex-start"
                      key={item.productId}
                      p={2}
                    >
                      <VStack align="flex-start" gap={0}>
                        <Text fontWeight="bold" maxLines={1}>
                          {item.productName}
                        </Text>
                        <Text color="gray.600" fontSize="sm">
                          ${item.price.toFixed(2)} c/u
                        </Text>
                      </VStack>
                      <HStack flex="1" gap={4}>
                        {/* Componente NumberInput para ajustar la cantidad */}
                        <NumberInput.Root
                          max={item.stock}
                          maxW="80px"
                          min={0}
                          size="sm"
                          value={item.quantity.toString()}
                          onValueChange={(details) =>
                            handleUpdateQuantity(
                              item.productId,
                              details.valueAsNumber || 0
                            )
                          }
                        >
                          <NumberInput.Control />
                          <NumberInput.Input />
                        </NumberInput.Root>
                        <Text
                          flex="1"
                          fontWeight="bold"
                          minW="60px"
                          textAlign="left"
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                        <IconButton
                          aria-label="Eliminar producto"
                          colorPalette="red"
                          size="sm"
                          onClick={() => removeCartItem(item.productId)}
                        >
                          <LuTrash />
                        </IconButton>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              )}
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <VStack gap={4} width="full">
                <HStack justifyContent="space-between" width="full">
                  <Text fontSize="lg" fontWeight="bold">
                    Total:
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    ${cartTotal.toFixed(2)}
                  </Text>
                </HStack>
                <Button
                  colorScheme="green"
                  disabled={cartItems.length === 0}
                  size="lg"
                  width="full"
                  onClick={handleGoToCheckout}
                >
                  Ir a Finalizar Orden
                </Button>
              </VStack>
            </DrawerFooter>
          </DrawerContent>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
