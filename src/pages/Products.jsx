import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "react-router-dom";

import {
    GET_PRODUCTS_QUERY,
    GET_PRODUCTS_BY_CATEGORY_QUERY,
    SEARCH_PRODUCTS_QUERY,
} from "../graphqls/queries/product";
import ProductCard from "../components/home/ProductCard";

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const searchQuery = searchParams.get("search") || "";

    const [localSearch, setLocalSearch] = useState(searchQuery);

    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    const normalizedSearch = searchQuery.trim();
    const hasSearch = normalizedSearch.length > 0;

    const activeQuery = hasSearch
        ? SEARCH_PRODUCTS_QUERY
        : categoryId
            ? GET_PRODUCTS_BY_CATEGORY_QUERY
            : GET_PRODUCTS_QUERY;

    const activeVariables = hasSearch
        ? {
            query: normalizedSearch,
            categoryId: categoryId || null,
        }
        : categoryId
            ? { categoryId }
            : {};

    const { loading, error, data } = useQuery(
        activeQuery,
        {
            variables: activeVariables,
        }
    );

    const products = hasSearch
        ? data?.searchProducts ?? []
        : categoryId
            ? data?.getProductsByCategory ?? []
            : data?.getProducts ?? [];

    const filteredProducts = products;

    const submitSearch = (event) => {
        event.preventDefault();
        const value = localSearch.trim();

        const next = new URLSearchParams(searchParams);
        if (value) next.set("search", value);
        else next.delete("search");

        setSearchParams(next);
    };

    const clearSearch = () => {
        const next = new URLSearchParams(searchParams);
        next.delete("search");
        setLocalSearch("");
        setSearchParams(next);
    };

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <div className="h-10 w-48 animate-pulse rounded bg-gray-100" />
                <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-100" />
                    ))}
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <h1 className="text-4xl font-semibold">Ürünler</h1>
                <p className="mt-4 text-sm text-red-500">
                    Ürünler yüklenirken bir hata oluştu: {error.message}
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
            <div className="flex flex-col justify-between gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end">
                <div>
                    <p className="section-kicker">
                        {categoryId ? "Kategori" : "Shop"}
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                        {categoryId ? "Kategori Ürünleri" : "Tüm Ürünler"}
                    </h1>
                    <p className="mt-3 text-sm text-gray-500">
                        {filteredProducts.length} ürün
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <SlidersHorizontal size={17} />
                    <span>Keşfet ve seç</span>
                </div>
            </div>

            <form onSubmit={submitSearch} className="mt-8 flex max-w-2xl rounded-2xl border border-black/10 bg-gray-50 p-2">
                <Search className="ml-3 self-center text-gray-400" size={18} />
                <input
                    value={localSearch}
                    onChange={(event) => setLocalSearch(event.target.value)}
                    placeholder="Ürün, marka veya kategori ara..."
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
                />
                <button
                    type="submit"
                    className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
                >
                    Ara
                </button>
            </form>

            {searchQuery && (
                <div className="mt-5 flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-black px-3 py-1.5 text-white">
                        “{searchQuery}”
                    </span>
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="flex items-center gap-1 text-gray-500 hover:text-black"
                    >
                        Temizle
                        <X size={14} />
                    </button>
                </div>
            )}

            {filteredProducts.length > 0 ? (
                <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-4 md:gap-x-5">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="mt-12 rounded-2xl bg-gray-50 py-24 text-center">
                    <h2 className="text-xl font-semibold">Ürün bulunamadı.</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Arama kelimeni değiştirmeyi deneyebilirsin.
                    </p>
                </div>
            )}
        </main>
    );
}

export default Products;
