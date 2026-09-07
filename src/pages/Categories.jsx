import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES_QUERY } from "../graphqls/queries/category";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/home/CategoryCard";

function Categories() {
    const { loading, error, data } = useQuery(GET_CATEGORIES_QUERY);
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/products?categoryId=${category.id}`);
    };

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <div className="animate-pulse">
                    <div className="h-10 w-48 rounded bg-gray-100" />
                    <div className="mt-3 h-4 w-80 rounded bg-gray-100" />

                    <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="aspect-[4/3] rounded-2xl bg-gray-100"
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        console.error("GET CATEGORIES ERROR:", error);

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                    Bir sorun oluştu
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                    Kategoriler yüklenemedi
                </h1>

                <p className="mt-4 text-sm text-red-500">
                    {error.message}
                </p>
            </main>
        );
    }

    const categories = data?.getCategories ?? [];

    return (
        <main className="overflow-hidden">

            {/* PAGE HEADER */}
            <section className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-20">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <p className="section-kicker">
                            Keşfet
                        </p>

                        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                            Kategoriler
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                            Moda, güzellik, teknoloji ve günlük yaşam için
                            seçilmiş kategorileri keşfet.
                        </p>
                    </div>

                    <span className="hidden text-xs uppercase tracking-[0.18em] text-gray-400 sm:block">
                        {categories.length} kategori
                    </span>
                </div>
            </section>

            {/* CATEGORY GRID */}
            <section className="mx-auto max-w-7xl px-6 pb-24">
                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onClick={handleCategoryClick}
                                compact
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center">
                        <p className="text-sm text-gray-500">
                            Henüz kategori bulunmuyor.
                        </p>
                    </div>
                )}
            </section>

        </main>
    );
}

export default Categories;