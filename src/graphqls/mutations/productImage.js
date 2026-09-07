import { gql } from "@apollo/client";

export const ADD_PRODUCT_VARIANT_IMAGE_MUTATION = gql`
    mutation AddProductVariantImage(
        $variantId: ID!
        $imageToken: String!
    ) {
        addProductVariantImage(
            variantId: $variantId
            imageToken: $imageToken
        ) {
            id
            imageToken
            productId
            variantId
        }
    }
`;
export const ADD_PRODUCT_IMAGE_MUTATION = gql`
    mutation AddProductImage(
        $productId: ID!
        $imageToken: String!
    ) {
        addProductImage(
            productId: $productId
            imageToken: $imageToken
        ) {
            id
            imageToken
            productId
            variantId
        }
    }
`;
