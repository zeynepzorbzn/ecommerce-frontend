import { gql } from "@apollo/client";

export const GET_MY_ORDERS_QUERY = gql`
    query GetMyOrders {
        getMyOrders {
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