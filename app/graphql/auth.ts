import { gql } from "@apollo/client/core";

export const SIGN_IN = gql`
  mutation SignIn($userInput: SignIn) {
    signIn(userInput: $userInput) {
      refreshToken
      token
    }
  }
`;

export const SIGN_UP = gql`
  mutation SignUp($userInput: UserInput!) {
    signUp(userInput: $userInput) {
      accessToken
      refreshToken
      user {
        id
        username
        email
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      id
      username
      email
    }
  }
`;
