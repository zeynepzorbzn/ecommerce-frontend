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

                images {
                    id
                    imageToken
                    productId
                    variantId
                }
            }

            images {
                id
                imageToken
                productId
                variantId
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

                images {
                    id
                    imageToken
                    productId
                    variantId
                }
            }

            images {
                id
                imageToken
                productId
                variantId
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
            images {
                id
                imageToken
                productId
                variantId
            }
        }
    }
`;

export const GET_MY_STORE_PRODUCTS_QUERY = gql`
    query GetMyStoreProducts {
        getMyStoreProducts {
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
            images {
                id
                imageToken
                productId
                variantId
                
            }
        }
    }
`;
export const SEARCH_PRODUCTS_QUERY = gql`
    query SearchProducts($query: String!, $categoryId: ID) {
        searchProducts(
            query: $query
            categoryId: $categoryId
        ) {
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

                images {
                    id
                    imageToken
                    productId
                    variantId
                }
            }

            images {
                id
                imageToken
                productId
                variantId
            }
        }
    }
`;

