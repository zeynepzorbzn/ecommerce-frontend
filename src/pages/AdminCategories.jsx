import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { GET_CATEGORIES_QUERY } from "../graphqls/queries/category";
import { CREATE_CATEGORY_MUTATION } from "../graphqls/mutations/category";

function AdminCategories() {

    const { data, loading, refetch } =
        useQuery(GET_CATEGORIES_QUERY);

    const [createCategory] =
        useMutation(CREATE_CATEGORY_MUTATION);

    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createCategory({
            variables: {
                input: { name }
            }
        });

        setName("");
        refetch();
    };

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <Link to="/admin" className="text-sm text-gray-500">
                ← Admin Panel
            </Link>

            <h1 className="mt-6 text-4xl font-semibold">
                Kategoriler
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mt-8 flex gap-3"
            >
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Yeni kategori"
                    className="border p-3"
                    required
                />

                <button className="bg-black px-5 text-white">
                    Ekle
                </button>
            </form>

            <div className="mt-10 grid gap-4 md:grid-cols-3">

                {loading ? (
                    <p>Yükleniyor...</p>
                ) : (
                    data?.getCategories?.map((category) => (
                        <div
                            key={category.id}
                            className="border p-5"
                        >
                            {category.name}
                        </div>
                    ))
                )}

            </div>
        </main>
    );
}

export default AdminCategories;