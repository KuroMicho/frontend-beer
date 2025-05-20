import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode";
import type { Route } from "./+types/home";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { FaBeer, FaStar } from "react-icons/fa";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beerify" },
    {
      name: "description",
      content:
        "Welcome to Beerify An Web Page Application to Manage Beer Shoops!",
    },
  ];
}

const featuredBeers = [
  {
    id: 1,
    name: "Stout Irlandés",
    description: "Negra con sabores a café y chocolate",
    price: "$9.50",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400",
  },
  {
    id: 2,
    name: "Stout Irlandés",
    description: "Negra con sabores a café y chocolate",
    price: "$9.50",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400",
  },
  {
    id: 3,
    name: "Trigo Baviera",
    description: "Refrescante con toques de plátano y clavo",
    price: "$7.99",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400",
  },
];

export default function Home() {
  return (
    <Box bg={"orange.contrast"} minH="100vh" p={{ base: 4, md: 8 }}>
      {/* Hero Section */}
      <Stack
        direction={{ base: "column", md: "row" }}
        align="center"
        mb={12}
        spaceX={8}
        spaceY={8}
      >
        <Box flex={1}>
          <Heading as="h1" size="2xl" mb={4} bg="gray.contrast">
            <Icon as={FaBeer} mr={2} /> Bienvenidos a BeerShop
          </Heading>
          <Text fontSize="xl" mb={6}>
            Descubre las mejores cervezas artesanales de la región
          </Text>
          <Button colorScheme="normal" size="lg">
            Ver Catálogo
          </Button>
        </Box>
        <Box flex={1}>
          <Image
            src="https://images.unsplash.com/photo-1505075106905-fb052892c116?w=800"
            alt="Cervezas artesanales"
            borderRadius="lg"
            boxShadow="xl"
          />
        </Box>
      </Stack>

      {/* Featured Beers */}
      <Box py={8}>
        <Heading
          as="h2"
          size="xl"
          mb={8}
          textAlign="center"
          color="bg.inverted"
        >
          Nuestras Especialidades
        </Heading>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          {featuredBeers.map((beer) => (
            <Card.Root
              key={beer.id}
              bg="orange.contrast"
              boxShadow="md"
              margin={{ base: "auto", lg: "initial" }}
              width={{ base: "360px", lg: "100%" }}
              _hover={{ transform: "scale(1.03)", transition: "all 0.3s" }}
            >
              <CardBody>
                <Image
                  src={beer.image}
                  alt={beer.name}
                  borderRadius="lg"
                  h="200px"
                  w="100%"
                  objectFit="cover"
                />
                <Stack mt={4}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">{beer.name}</Heading>
                    <Tag.Root colorScheme="normal">{beer.price}</Tag.Root>
                  </Flex>
                  <Text>{beer.description}</Text>
                  <Flex align="center">
                    <Icon as={FaStar} color="yellow.400" mr={1} />
                    <Text fontWeight="bold">{beer.rating}</Text>
                  </Flex>
                </Stack>
              </CardBody>
              <CardFooter>
                <Button colorScheme="normal" variant="outline" w="full">
                  Añadir al carrito
                </Button>
              </CardFooter>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Box>

      {/* Brewery Info */}
      <Box
        bg={"orange.subtle"}
        p={8}
        borderRadius="xl"
        mt={12}
        textAlign="center"
      >
        <Heading as="h3" size="lg" mb={4} color={"bg.inverted"}>
          Visita Nuestra Cervecería
        </Heading>
        <Text mb={6}>Horario: Lunes a Sábado - 12:00 a 23:00 hrs</Text>
        <Button colorScheme="amber" size="lg">
          Ver Ubicación
        </Button>
      </Box>
    </Box>
  );
}
