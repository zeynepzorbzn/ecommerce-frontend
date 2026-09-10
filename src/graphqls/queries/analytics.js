import { gql } from "@apollo/client";

export const TRACK_ANALYTICS_EVENT_MUTATION = gql`
    mutation TrackAnalyticsEvent($input: AnalyticsEventInput!) {
        trackAnalyticsEvent(input: $input)
    }
`;

export const GET_PLATFORM_ANALYTICS_QUERY = gql`
    query GetPlatformAnalytics($date: Date!) {
        getPlatformAnalytics(date: $date) {
            date
            totalUsers
            activeUsers
            newUsers
            totalRevenue
            totalOrders
            totalStores
            topSellingProductId
            topStoreId
            systemConversionRate
        }
    }
`;

export const GET_STORE_ANALYTICS_QUERY = gql`
    query GetStoreAnalytics($date: Date!) {
        getStoreAnalytics(date: $date) {
            storeId
            date
            totalViews
            totalProductsSold
            totalRevenue
            totalOrders
            avgOrderValue
            returningCustomerRate
            conversionRate
        }
    }
`;

export const GET_MY_STORE_ANALYTICS_QUERY = gql`
    query GetMyStoreAnalytics($date: Date!) {
        getMyStoreAnalytics(date: $date) {
            storeId
            date
            totalViews
            totalProductsSold
            totalRevenue
            totalOrders
            avgOrderValue
            returningCustomerRate
            conversionRate
        }
    }
`;

export const GET_MY_PRODUCT_ANALYTICS_QUERY = gql`
    query GetMyProductAnalytics($date: Date!) {
        getMyProductAnalytics(date: $date) {
            productId
            storeId
            date
            viewCount
            cartAddCount
            purchaseCount
            revenue
            conversionRate
            avgPrice
            stockImpactScore
        }
    }
`;

export const GET_TOP_VIEWED_PRODUCTS_ANALYTICS_QUERY = gql`
    query GetTopViewedProducts($date: Date!) {
        getTopViewedProducts(date: $date) {
            productId
            storeId
            date
            viewCount
            cartAddCount
            purchaseCount
            revenue
            conversionRate
            avgPrice
            stockImpactScore
        }
    }
`;

export const GET_TOP_SELLING_PRODUCTS_ANALYTICS_QUERY = gql`
    query GetTopSellingProducts($date: Date!) {
        getTopSellingProducts(date: $date) {
            productId
            storeId
            date
            viewCount
            cartAddCount
            purchaseCount
            revenue
            conversionRate
            avgPrice
            stockImpactScore
        }
    }
`;