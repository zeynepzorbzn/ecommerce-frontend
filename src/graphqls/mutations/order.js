import { gql } from "@apollo/client";

export const CREATE_ORDER_MUTATION = gql`
    mutation CreateOrder($input: OrderInput!) {
        createOrder(input: $input) {
            id
            code
            totalPrice
            productCount
            userId
            addressId
            paymentMethodId
            orderItems {
                id
                quantity
                unitPrice
                productVariantId
                productName
                size
                color
            }
        }
    }
`;