import { gql } from "@apollo/client";

export const GET_PRODUCTS_QUERY = gql`
    query GetProducts {
        getProducts {
            id
            name
            description
            price
            gender
            season
            storeName
            brandName
            categoryName
            variants {
                id
                size
                stock
                color
                productId
                productName
            }
        }
    }
`;
export const GET_PRODUCT_QUERY = gql`
    query GetProduct($id: ID!) {
        getProduct(id: $id) {
            id
            name
            description
            price
            gender
            season
            storeName
            brandName
            categoryName
            variants {
                id
                size
                stock
                color
                productId
                productName
            }
        }
    }
`;

export const GET_PRODUCTS_BY_CATEGORY_QUERY = gql`
    query GetProductsByCategory($categoryId: ID!) {
        getProductsByCategory(categoryId: $categoryId) {
            id
            name
            description
            price
            gender
            season
            storeName
            brandName
            categoryName
            variants {
                id
                size
                stock
                color
                productId
                productName
            }
        }
    }
`;