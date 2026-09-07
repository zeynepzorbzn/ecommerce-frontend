import { gql } from "@apollo/client";

export const GET_BRANDS_QUERY = gql`
    query GetBrands {
        getBrands {
            id
            name
        }
    }
`;