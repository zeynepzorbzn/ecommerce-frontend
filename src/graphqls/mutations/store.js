import { gql } from "@apollo/client";

export const CREATE_STORE_MUTATION = gql`
    mutation CreateStore($input: StoreInput!) {
        createStore(input: $input) {
            id
            name
            email
            phoneNumber
            ownerName
            city
            district
            street
            postalCode
        }
    }
`;
