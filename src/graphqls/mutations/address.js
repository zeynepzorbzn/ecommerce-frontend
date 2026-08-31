import { gql } from "@apollo/client";

export const CREATE_ADDRESS_MUTATION = gql`
    mutation CreateAddress($input: AddressInput!) {
        createAddress(input: $input) {
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