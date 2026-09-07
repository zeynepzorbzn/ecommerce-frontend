import { gql } from "@apollo/client";

export const GET_MY_STORE_QUERY = gql`
    query GetMyStore {
        getMyStore {
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
export const GET_STORES_QUERY = gql`
    query GetStores {
        getStores {
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
