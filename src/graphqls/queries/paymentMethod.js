import { gql } from "@apollo/client";

export const GET_MY_PAYMENT_METHODS_QUERY = gql`
    query GetMyPaymentMethods {
        getMyPaymentMethods {
            id
            maskedCardNumber
            cardHolder
            provider
            lastFourDigits
            expireMonth
            expireYear
            isDefault
        }
    }
`;