import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { GET_BRANDS_QUERY } from "../graphqls/queries/brand";
import { CREATE_BRAND_MUTATION } from "../graphqls/mutations/brand";

function AdminBrands() {

    const { data, loading, refetch } =
        useQuery(GET_BRANDS_QUERY);

    const [createBrand] =
        useMutation(CREATE_BRAND_MUTATION);

    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createBrand({
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
                Markalar
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mt-8 flex gap-3"
            >
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Yeni marka"
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
                    data?.getBrands?.map((brand) => (
                        <div
                            key={brand.id}
                            className="border p-5"
                        >
                            {brand.name}
                        </div>
                    ))
                )}

            </div>
        </main>
    );
}

export default AdminBrands;