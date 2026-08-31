import { gql } from "@apollo/client";

export const GET_MY_ADDRESSES_QUERY = gql`
    query GetMyAddresses {
        getMyAddresses {
            id
            name
            city
            district
            street
            postalCode
            billing
        }
    }
`;