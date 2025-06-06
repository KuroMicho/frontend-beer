import { gql } from "@apollo/client/core";

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrderInput!) {
    createOrder(data: $data) {
      id
      name
      username
      status
    }
  }
`;

export const GET_ORDERS_BY_USERNAME = gql`
  query OrdersByUsername($username: String!) {
    ordersByUsername(username: $username) {
      id
      name
      username
      status
      total
      units {
        quantity
        product {
          name
        }
      }
      createdAt
      updatedAt
      user {
        username
      }
    }
  }
`;
