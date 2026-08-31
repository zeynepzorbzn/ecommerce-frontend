import { gql } from "@apollo/client";

export const UPDATE_CART_ITEM_QUANTITY_MUTATION = gql`
    mutation UpdateCartItemQuantity(
        $cartItemId: ID!
        $quantity: Int!
    ) {
        updateCartItemQuantity(
            cartItemId: $cartItemId
            quantity: $quantity
        ) {
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
export const REMOVE_FROM_CART_MUTATION = gql`
    mutation RemoveFromCart($cartItemId: ID!) {
        removeFromCart(cartItemId: $cartItemId)
    }
`;