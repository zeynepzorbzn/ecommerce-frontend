import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "react-router-dom";
import {
    GET_PRODUCTS_QUERY,
    GET_PRODUCTS_BY_CATEGORY_QUERY
} from "../graphqls/queries/product";
import ProductCard from "../components/home/ProductCard";

function Products() {
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("categoryId");

    const { loading, error, data } = useQuery(
        categoryId
            ? GET_PRODUCTS_BY_CATEGORY_QUERY
            : GET_PRODUCTS_QUERY,
        {
            variables: categoryId
                ? { categoryId }
                : {}
        }
    );
    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Ürünler yükleniyor...</p>
            </main>
        );
    }

    if (error) {
        console.error("GET PRODUCTS ERROR:", error);

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <h1 className="text-4xl font-semibold">
                    Ürünler
                </h1>

                <p className="mt-4 text-red-500">
                    {error.message}
                </p>
            </main>
        );
    }

    const products = categoryId
        ? data?.getProductsByCategory ?? []
        : data?.getProducts ?? [];

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <h1 className="text-4xl font-semibold">
                {categoryId ? "Kategori Ürünleri" : "Ürünler"}
            </h1>

            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

        </main>
    );
}

export default Products;