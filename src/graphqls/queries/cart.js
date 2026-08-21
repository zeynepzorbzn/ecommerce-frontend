import { gql } from "@apollo/client";

export const GET_CART_QUERY = gql`
    query GetCartByUserId($userId: ID!) {
        getCartByUserId(userId: $userId) {
            id
            totalPrice
            productCount
            userId
            items {
                id
                quantity
                totalPrice
                productVariantId
                productName
                size
                color
            }
        }
    }
`;