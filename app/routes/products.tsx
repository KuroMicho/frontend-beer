import { useState } from "react";

import { useMutation, useQuery } from "@apollo/client/react/hooks";
import { FaCartShopping } from "react-icons/fa6";

import {
  Box,
  Button,
  Flex,
  Dialog,
  Heading,
  Input,
  Stack,
  Table,
  Portal,
  CloseButton,
  Fieldset,
  Field,
  Center,
  Spinner,
  Text,
  SimpleGrid,
  HStack,
  Badge,
} from "@chakra-ui/react";

import { CartSidebar } from "@/components/cartSiderbar";
import { ProductCard } from "@/components/productCard";
import { toaster } from "@/components/ui/toaster";
import {
  ALL_PRODUCTS,
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "@/graphql/products";
import useAuthStore from "@/store/auth";
import { useCartStore } from "@/store/cart";

type Product = {
  id?: number;
  username?: string;
  name?: string;
  price?: number;
  stock?: number;
  size?: number;
};

const initialProducts: Product[] = [
  { id: 1, name: "Cerveza IPA", price: 8.99, stock: 150, size: 100 },
  { id: 2, name: "Cerveza Stout", price: 9.5, stock: 80, size: 400 },
  { id: 3, name: "Cerveza Trigo", price: 7.99, stock: 120, size: 600 },
];

type CreateProductInput = Omit<Product, "id">;
type UpdateProductInput = Partial<Omit<Product, "id">>;

export default function ProductsPage() {
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();
  const onOpenSidebar = useCartStore((state) => state.onOpenSidebar);
  const { cartItems } = useCartStore();

  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery<{ allProducts: Product[] }>(ALL_PRODUCTS, {
    onError: (error) => {
      toaster.create({
        title: "Error cargando productos",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });

  const [createProduct, { loading: createLoading, error: createError }] =
    useMutation<{ createProduct: Product }, { data: CreateProductInput }>(
      CREATE_PRODUCT,
      {
        update(cache, { data }) {
          const newProduct = data?.createProduct;
          if (newProduct) {
            cache.modify({
              fields: {
                allProducts(existingProducts = []) {
                  return [...existingProducts, newProduct];
                },
              },
            });
          }
        },
        onCompleted: () => {
          toaster.create({
            title: "Producto creado",
            type: "success",
            duration: 2000,
          });
          setOpen(false);
        },
        onError: (error) => {
          toaster.create({
            title: "Error al crear producto",
            description: error.message,
            type: "error",
            duration: 3000,
          });
        },
      }
    );

  const [updateProduct, { loading: updateLoading, error: updateError }] =
    useMutation<
      { updateProduct: Product },
      { updateProductId: number; data: UpdateProductInput }
    >(UPDATE_PRODUCT, {
      refetchQueries: [{ query: ALL_PRODUCTS }],
      onCompleted: () => {
        toaster.create({
          title: "Producto actualizado",
          type: "warning",
          duration: 2000,
        });
        setOpen(false);
      },
      onError: (error) => {
        toaster.create({
          title: "Error al actualizar producto",
          description: error.message,
          type: "error",
          duration: 3000,
        });
      },
    });

  const [deleteProduct, { loading: deleteLoading, error: deleteError }] =
    useMutation<{ deleteProduct: string }, { deleteProductId: number }>(
      DELETE_PRODUCT,
      {
        refetchQueries: [{ query: ALL_PRODUCTS }],
        onCompleted: () => {
          toaster.create({
            title: "Producto eliminado",
            type: "error",
            duration: 2000,
          });
        },
        onError: (error) => {
          toaster.create({
            title: "Error al eliminar producto",
            description: error.message,
            type: "error",
            duration: 3000,
          });
        },
      }
    );

  const handleCreate = () => {
    setCurrentProduct({ name: "", price: 0, stock: 0, size: 0 });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      size: product.size,
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: number | undefined) => {
    if (!id) return;

    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      deleteProduct({ variables: { deleteProductId: id } });
    }
  };

  const handleSubmit = async () => {
    if (!currentProduct) return;

    const { id, ...input } = currentProduct;

    input.username = user?.username;

    try {
      if (isEditing) {
        await updateProduct({
          variables: { updateProductId: id!, data: input },
        });
      } else {
        await createProduct({ variables: { data: input } });
      }
    } catch (error) {}
  };

  const handleCart = () => {
    onOpenSidebar();
  };

  if (queryLoading) {
    return (
      <Center flexDirection="column" minH="100vh">
        <Spinner color="blue.500" size="xl" />
        <Text fontSize="xl" mt={4}>
          Cargando productos...
        </Text>
      </Center>
    );
  }

  if (queryError) {
    return (
      <Center flexDirection="column" minH="100vh">
        <Text color="red.500" fontSize="xl">
          Error al cargar productos: {queryError.message}
        </Text>
        <Button mt={4} onClick={() => refetch()}>
          Reintentar
        </Button>
      </Center>
    );
  }

  const products = data?.allProducts || initialProducts;

  return (
    <Box p={6}>
      <Heading mb={6} size="md">
        Catalogo de Productos
      </Heading>

      <HStack justifyContent="flex-end">
        <Badge
          colorPalette="red"
          cursor="pointer"
          size="lg"
          variant="outline"
          onClick={handleCart}
        >
          <FaCartShopping />
          {cartItems.length}
        </Badge>
      </HStack>
      {/* Aquí es donde agregas la visualización de los productos para que el usuario agregue al carrito */}
      {products.length === 0 ? (
        <Text color="gray.500" fontSize="lg" textAlign="center">
          No hay productos disponibles para la compra.
        </Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          gap={4}
          justifyContent="center"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </SimpleGrid>
      )}

      {/* Aquí es donde agregas el CartSidebar */}

      <CartSidebar />

      <Flex justify="space-between" mb={6} mt={6}>
        <Heading size="lg">Gestión de Productos</Heading>
        <Button colorScheme="teal" onClick={handleCreate}>
          + Nuevo Producto
        </Button>
      </Flex>

      {/* Tabla de productos */}
      <Box overflowX="auto">
        <Table.Root striped colorScheme="gray">
          <Table.Header>
            <Table.Row>
              <Table.Cell>ID</Table.Cell>
              <Table.Cell>Nombre</Table.Cell>
              <Table.Cell>Precio ($)</Table.Cell>
              <Table.Cell>Stock</Table.Cell>
              <Table.Cell>Size</Table.Cell>
              <Table.Cell>Acciones</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.id}</Table.Cell>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.price?.toFixed(2)}</Table.Cell>
                <Table.Cell>{product.stock}</Table.Cell>
                <Table.Cell>{product.size}</Table.Cell>
                <Table.Cell>
                  <Stack direction="row" gap={2}>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      Editar
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(product?.id)}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Diálogo para crear/editar */}
      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  {isEditing ? "Editar Producto" : "Nuevo Producto"}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton
                    position="absolute"
                    right={2}
                    size="sm"
                    top={2}
                  />
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <Dialog.Body>
                <Fieldset.Root size="md">
                  <Fieldset.Content>
                    <Field.Root>
                      <Field.Label>Nombre</Field.Label>
                      <Input
                        value={currentProduct?.name || ""}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct!,
                            name: e.target.value,
                          })
                        }
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Precio</Field.Label>
                      <Input
                        type="number"
                        value={currentProduct?.price || 0}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct!,
                            price: parseFloat(e.target.value),
                          })
                        }
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Stock</Field.Label>
                      <Input
                        type="number"
                        value={currentProduct?.stock || 0}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct!,
                            stock: parseInt(e.target.value),
                          })
                        }
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Size</Field.Label>
                      <Input
                        type="number"
                        value={currentProduct?.size || 0}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct!,
                            size: parseInt(e.target.value),
                          })
                        }
                      />
                    </Field.Root>
                  </Fieldset.Content>
                </Fieldset.Root>
              </Dialog.Body>

              <Dialog.Footer>
                <Button mr={3} variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  Guardar
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
