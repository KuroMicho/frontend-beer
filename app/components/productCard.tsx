import { Box, Image, Text, Button, VStack } from "@chakra-ui/react";

import { useCartStore } from "../store/cart";

import { toaster } from "./ui/toaster";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItemToCart = useCartStore((state) => state.addItemToCart);
  const onOpenSidebar = useCartStore((state) => state.onOpenSidebar);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toaster.create({
        title: "Producto agotado",
        description: `${product.name} no tiene stock disponible.`,
        type: "warning",
        duration: 3000,
      });
      return;
    }

    addItemToCart(product, 1);
    onOpenSidebar();
  };

  return (
    <Box
      bg="gray.contrast"
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="md"
      overflow="hidden"
      p={4}
      textAlign="center"
      width="200px"
    >
      <Image
        alt={product.name}
        mb={4}
        src={`https://placehold.co/200?text=${product.name.replace(/\s/g, "+")}`}
      />
      <VStack align="stretch" gap={2}>
        <Text fontSize="lg" fontWeight="bold" maxLines={1}>
          {product.name}
        </Text>
        <Text color="bg.inverted">${product.price.toFixed(2)}</Text>
        <Text color={product.stock > 0 ? "green.600" : "red.600"} fontSize="sm">
          Stock: {product.stock > 0 ? product.stock : "Agotado"}
        </Text>
        <Button
          colorScheme="blue"
          disabled={product.stock === 0}
          mt={3}
          onClick={handleAddToCart}
        >
          {product.stock > 0 ? "Agregar al Carrito" : "Agotado"}
        </Button>
      </VStack>
    </Box>
  );
};
