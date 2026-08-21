import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES_QUERY } from "../graphqls/queries/category";
import { useNavigate } from "react-router-dom";

function Categories() {
    const { loading, error, data } = useQuery(GET_CATEGORIES_QUERY);
    const navigate = useNavigate();

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Kategoriler yükleniyor...</p>
            </main>
        );
    }

    if (error) {
        console.error("GET CATEGORIES ERROR:", error);

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <h1 className="text-4xl font-semibold">
                    Kategoriler
                </h1>

                <p className="mt-4 text-red-500">
                    {error.message}
                </p>
            </main>
        );
    }

    const categories = data?.getCategories ?? [];

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <h1 className="text-4xl font-semibold">
                Kategoriler
            </h1>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => navigate(`/products?categoryId=${category.id}`)}
                        className="flex aspect-square items-center justify-center bg-gray-100 transition hover:bg-gray-200"
                    >
    <span className="text-lg font-medium">
        {category.name}
    </span>
                    </button>
                ))}
            </div>

        </main>
    );
}

export default Categories;