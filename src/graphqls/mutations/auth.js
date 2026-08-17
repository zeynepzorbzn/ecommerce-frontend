import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            accessToken
            refreshToken
        }
    }
`;
export const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
          id
          firstName
          lastName
          email
          phoneNumber
          roleName
          accessToken 
          refreshToken
        }
    } 
`;
