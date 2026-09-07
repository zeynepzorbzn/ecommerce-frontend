import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";

function CategorySection({ categories, onCategorySelect }) {
    const visibleCategories = categories.slice(0, 8);

    return (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
            <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                    <p className="section-kicker">Keşfet</p>
                    <h2 className="section-title">Kategoriler</h2>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
                        Aradığın stile göre keşfetmeye başla.
                    </p>
                </div>

                <Link
                    to="/categories"
                    className="hidden text-sm font-medium underline decoration-black/20 underline-offset-8 transition hover:decoration-black sm:block"
                >
                    Tümünü Gör
                </Link>
            </div>

            {visibleCategories.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {visibleCategories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onClick={onCategorySelect}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-500">
                    Kategoriler henüz eklenmedi.
                </div>
            )}

            <Link
                to="/categories"
                className="mt-5 block text-center text-sm font-medium underline underline-offset-8 sm:hidden"
            >
                Tüm kategorileri gör
            </Link>
        </section>
    );
}

export default CategorySection;
