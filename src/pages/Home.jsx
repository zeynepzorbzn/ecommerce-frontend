import { useEffect, useState } from "react";
import CategoryCard from "../components/home/CategoryCard";
import ProductCard from "../components/home/ProductCard";
import CategorySection from "../components/home/CategorySection.jsx";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES_QUERY } from "../graphqls/queries/category";



const products = [
    {
        id: 1,
        name: "Kablosuz Kulaklık",
        category: "Elektronik",
        price: "1.299,90 TL",
    },
    {
        id: 2,
        name: "Omuz Çantası",
        category: "Moda",
        price: "1.899,90 TL",
    },
    {
        id: 3,
        name: "Güenş Kremi",
        category: "Güzellik",
        price: "749,90 TL",
    },
    {
        id: 4,
        name: "Masa Lambası",
        category: "Ev Dekorasyon",
        price: "1.499,90 TL",
    },
];

function Home() {
    const { loading: categoriesLoading, error: categoriesError, data: categoriesData } =
        useQuery(GET_CATEGORIES_QUERY);

    const categories = categoriesData?.getCategories ?? [];
    const [selectedCategory, setSelectedCategory] = useState(null);
    const filteredProducts = selectedCategory ? products.filter(
                (product) => product.category === selectedCategory) : products;
    useEffect(() => {console.log("Selected category:", selectedCategory);
    }, [selectedCategory])
    return (
        <main>

            {/* HERO */}
            <section className="bg-gray-100">
                <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 text-center">
                    <div className="max-w-3xl">

                        <p className="mb-5 text-sm uppercase tracking-[0.3em] text-gray-500">
                            ZEY'Z
                        </p>

                        <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
                            İhtiyacın olan her şey.
                            <br />
                            Bir arada.
                        </h1>

                        <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-gray-500">
                            Sevdiğiniz markaları ve ürünleri keşfedin.
                        </p>

                        <Link
                            to="/products"
                            className="mt-8 inline-block bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
                        >
                            Ürünleri Keşfet
                        </Link>

                    </div>
                </div>
            </section>


            {/* CATEGORIES */}
            <CategorySection
                categories={categories}
                onCategorySelect={setSelectedCategory}
            />

            {/* FEATURED PRODUCTS */}
            <section className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-widest text-gray-400">
                                Keşfet
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold">
                                Gelecek Ürünler
                            </h2>
                        </div>
                        <Link
                            to="/products"
                            className="hidden text-sm underline underline-offset-4 md:block"
                        >
                            Hepsini Görüntüle
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">

                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>

            </section>


            {/* NEWSLETTER / DISCOVER */}
            <section className="mx-auto max-w-7xl px-6 py-24">
                <div className="bg-black px-6 py-16 text-center text-white md:px-20">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                       Güncel Kal
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                        Yenilikleri Keşfedin.
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-400">
                        Yeni ürünler, koleksiyonlar ve fırsatlardan haberdar olun.
                    </p>
                    <Link
                        to="/products"
                        className="mt-8 bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-gray-200">

                        Ürünleri Keşfet
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default Home;