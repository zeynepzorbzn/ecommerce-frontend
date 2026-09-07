import { gql } from "@apollo/client";

export const GET_ME_QUERY = gql`
    query GetMe {
        me {
            id
            firstName
            lastName
            email
            birthDate
            phoneNumber
        }
    }
`;

export const GET_USERS_QUERY = gql`
    query GetUsers {
        users {
            id
            firstName
            lastName
            email
            birthDate
            phoneNumber
        }
    }
`;
