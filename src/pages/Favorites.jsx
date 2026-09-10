import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import ProductCard from "../components/home/ProductCard";
import { GET_PRODUCTS_QUERY } from "../graphqls/queries/product";
import { getFavoriteIds } from "../utils/favorites";

function Favorites() {
    const [favoriteIds, setFavoriteIds] = useState(getFavoriteIds());

    const { loading, error, data } = useQuery(GET_PRODUCTS_QUERY);

    useEffect(() => {
        const update = () => setFavoriteIds(getFavoriteIds());
        window.addEventListener("favoritesChanged", update);
        window.addEventListener("storage", update);

        return () => {
            window.removeEventListener("favoritesChanged", update);
            window.removeEventListener("storage", update);
        };
    }, []);

    const products = useMemo(() => {
        const allProducts = data?.getProducts ?? [];
        return allProducts.filter((product) =>
            favoriteIds.includes(String(product.id))
        );
    }, [data, favoriteIds]);

    return (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
            <div className="flex items-end justify-between gap-5">
                <div>
                    <p className="section-kicker">Senin seçtiklerin</p>
                    <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                        Favorilerim
                    </h1>
                </div>
                <Heart className="hidden sm:block" size={28} strokeWidth={1.4} />
            </div>

            {loading && (
                <p className="mt-12 text-sm text-gray-500">Favoriler yükleniyor...</p>
            )}

            {error && (
                <p className="mt-12 text-sm text-red-500">
                    Ürünler yüklenirken bir hata oluştu.
                </p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="mt-12 rounded-[2rem] bg-gray-50 px-6 py-20 text-center">
                    <Heart className="mx-auto" size={34} strokeWidth={1.2} />
                    <h2 className="mt-5 text-xl font-semibold">
                        Henüz favorin yok.
                    </h2>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                        Beğendiğin ürünlerdeki kalp ikonuna dokunarak onları burada
                        saklayabilirsin.
                    </p>
                    <Link
                        to="/products"
                        className="mt-7 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
                    >
                        Ürünleri keşfet
                    </Link>
                </div>
            )}
        </main>
    );
}

export default Favorites;
