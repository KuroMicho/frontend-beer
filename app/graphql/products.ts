import { gql } from "@apollo/client/core";

export const ALL_PRODUCTS = gql`
  query AllProducts {
    allProducts {
      id
      name
      description
      username
      image
      price
      stock
      size
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductInput!) {
    createProduct(data: $data) {
      id
      name
      description
      username
      image
      price
      stock
      size
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($updateProductId: ID!, $data: ProductInput!) {
    updateProduct(id: $updateProductId, data: $data) {
      id
      name
      description
      username
      image
      price
      stock
      size
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($deleteProductId: ID!) {
    deleteProduct(id: $deleteProductId) {
      success
      message
    }
  }
`;
