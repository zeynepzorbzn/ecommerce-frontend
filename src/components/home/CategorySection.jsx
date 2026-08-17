import CategoryCard from "./CategoryCard";

function CategorySection({ categories, onCategorySelect }) {
    return (
        <section className="mx-auto max-w-7xl px-6 py-20">

            <div className="mb-10 flex items-end justify-between">

                <div>
                    <p className="text-sm uppercase tracking-widest text-gray-400">
                        Keşfet
                    </p>

                    <h2 className="mt-2 text-3xl font-semibold">
                        Kategoriler
                    </h2>
                </div>

                <button className="hidden text-sm underline underline-offset-4 md:block">
                    Hepsini Görüntüle
                </button>

            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                {categories.map((category) => (
                    <CategoryCard
                        key={category}
                        category={category}
                        onClick={onCategorySelect}
                    />
                ))}

            </div>

        </section>
    );
}
export default CategorySection;