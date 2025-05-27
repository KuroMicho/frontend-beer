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
  mutation SignUp($userInput: SignUp) {
    signUp(userInput: $userInput) {
      message
    }
  }
`;

export const SIGN_OUT = gql`
  mutation SignOut($usernameInput: Username!) {
    signOut(usernameInput: $usernameInput) {
      message
    }
  }
`;

export const VALIDATE_TOKEN = gql`
  mutation ValidateToken($tokenInput: Token!) {
    validateToken(tokenInput: $tokenInput) {
      isValid
      username
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshInput: Refresh!) {
    refreshToken(refreshInput: $refreshInput) {
      accessToken
      refreshToken
      tokenType
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
