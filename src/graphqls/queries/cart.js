import { gql } from "@apollo/client";

export const GET_CART_QUERY = gql`
    query GetMyCart {
        getMyCart {
            id
            totalPrice
            productCount
            userId
            items {
                id
                quantity
                totalPrice
                productId
                productVariantId
                productName
                size
                color
                imageToken
            }
        }
    }
`;

export const ADD_TO_CART_MUTATION = gql`
    mutation AddToCart($input: CartItemInput!) {
        addToCart(input: $input) {
            id
            quantity
            totalPrice
            productVariantId
            productName
            size
            color
        }
    }
`;

