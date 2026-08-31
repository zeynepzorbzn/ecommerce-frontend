import { gql } from "@apollo/client";

export const CREATE_PAYMENT_METHOD_MUTATION = gql`
    mutation CreatePaymentMethod($input: PaymentMethodInput!) {
        createPaymentMethod(input: $input) {
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