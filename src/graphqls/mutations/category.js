import { gql } from "@apollo/client";

export const CREATE_CATEGORY_MUTATION = gql`
    mutation CreateCategory($input: CategoryInput!) {
        createCategory(input: $input) {
            id
            name
        }
    }
`;