import { gql } from "@apollo/client";

export const GET_PRODUCT_VARIANTS_QUERY = gql`
    query GetProductVariants {
        getProductVariants {
            id
            size
            stock
            color
            productId
            productName
        }
    }
`;

export const GET_PRODUCT_VARIANT_BY_ID_QUERY = gql`
    query GetProductVariantById($id: ID!) {
        getProductVariantById(id: $id) {
            id
            size
            stock
            color
            productId
            productName
        }
    }
`;
import { gql } from "@apollo/client";

export const CREATE_PRODUCT_VARIANT_MUTATION = gql`
    mutation CreateProductVariant($input: ProductVariantInput!) {
        createProductVariant(input: $input) {
            id
            size
            stock
            color
            productId
            productName
        }
    }
`;

export const UPDATE_PRODUCT_VARIANT_MUTATION = gql`
    mutation UpdateProductVariant(
        $id: ID!
        $input: ProductVariantInput!
    ) {
        updateProductVariant(
            id: $id
            input: $input
        ) {
            id
            size
            stock
            color
            productId
            productName
        }
    }
`;

export const DELETE_PRODUCT_VARIANT_MUTATION = gql`
    mutation DeleteProductVariant($id: ID!) {
        deleteProductVariant(id: $id)
    }
`;