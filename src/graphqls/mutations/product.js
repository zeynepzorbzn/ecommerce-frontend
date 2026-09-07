import { gql } from "@apollo/client";

export const CREATE_PRODUCT_MUTATION = gql`
    mutation CreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            id
            name
            description
            price
            gender
            season
            storeName
            brandName
            categoryName
        }
    }
`;
export const UPDATE_PRODUCT_MUTATION = gql`
    mutation UpdateProduct($id: ID!, $input: ProductInput!) {
        updateProduct(id: $id, input: $input) {
            id
            name
            description
            price
            gender
            season
            storeName
            brandName
            categoryName
        }
    }
`;

export const DELETE_PRODUCT_MUTATION = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id)
    }
`;
