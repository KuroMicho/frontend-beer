import { toaster } from "@/components/ui/toaster";
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
  NativeSelect,
} from "@chakra-ui/react";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
};

const initialProducts: Product[] = [
  { id: 1, name: "Cerveza IPA", price: 8.99, stock: 150, category: "IPA" },
  { id: 2, name: "Cerveza Stout", price: 9.5, stock: 80, category: "Oscura" },
  { id: 3, name: "Cerveza Trigo", price: 7.99, stock: 120, category: "Blanca" },
];

const categories = ["IPA", "Oscura", "Blanca", "Pilsen", "Ale"];

export default function ProductsPage() {
  // Estados
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  // Handlers CRUD
  const handleCreate = () => {
    setCurrentProduct({ id: 0, name: "", price: 0, stock: 0 });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    toaster.create({
      title: "Producto eliminado",
      type: "error",
      duration: 2000,
    });
  };

  const handleSubmit = () => {
    if (isEditing) {
      // Actualizar
      setProducts(
        products.map((p) => (p.id === currentProduct!.id ? currentProduct! : p))
      );
      toaster.create({
        title: "Producto actualizado",
        type: "warning",
        duration: 2000,
      });
    } else {
      // Crear
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts([...products, { ...currentProduct!, id: newId }]);
      toaster.create({
        title: "Producto creado",
        type: "success",
        duration: 2000,
      });
    }
    setOpen(false);
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" mb={6}>
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
              <Table.Cell>Acciones</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.id}</Table.Cell>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.price.toFixed(2)}</Table.Cell>
                <Table.Cell>{product.stock}</Table.Cell>
                <Table.Cell>
                  <Stack direction="row" gap={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleEdit(product)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(product.id)}
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
                    size="sm"
                    position="absolute"
                    right={2}
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
                      <Field.Label>Categoría</Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          name="category"
                          value={currentProduct?.category || "IPA"}
                          onChange={(e) =>
                            setCurrentProduct({
                              ...currentProduct!,
                              category: e.currentTarget.value,
                            })
                          }
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    </Field.Root>
                  </Fieldset.Content>
                </Fieldset.Root>
              </Dialog.Body>

              <Dialog.Footer>
                <Button variant="outline" mr={3} onClick={() => setOpen(false)}>
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
