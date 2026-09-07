import { gql } from "@apollo/client";

export const CREATE_BRAND_MUTATION = gql`
    mutation CreateBrand($input: BrandInput!) {
        createBrand(input: $input) {
            id
            name
        }
    }
`;