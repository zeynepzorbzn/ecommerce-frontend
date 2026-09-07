import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import { GET_MY_STORE_QUERY } from "../graphqls/queries/store";

function Store() {

    const {
        data,
        loading,
        error
    } = useQuery(GET_MY_STORE_QUERY);

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Mağaza yükleniyor...</p>
            </main>
        );
    }

    if (error) {

        console.error("GET MY STORE ERROR:", error);

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p className="text-red-500">
                    Mağaza yüklenirken bir hata oluştu.
                </p>
            </main>
        );
    }

    const store = data?.getMyStore;

    if (!store) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <h1 className="text-3xl font-semibold">
                    Mağazam
                </h1>

                <p className="mt-6 text-gray-500">
                    Henüz size atanmış bir mağaza bulunmuyor.
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm uppercase tracking-widest text-gray-400">
                        Store Manager
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold">
                        {store.name}
                    </h1>
                </div>

                <Link
                    to="/store/products"
                    className="bg-black px-6 py-3 text-sm text-white"
                >
                    Ürünlerim
                </Link>

            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">

                <div className="border p-6">
                    <p className="text-sm text-gray-500">
                        Mağaza
                    </p>

                    <p className="mt-2 text-lg font-medium">
                        {store.name}
                    </p>
                </div>

                <div className="border p-6">
                    <p className="text-sm text-gray-500">
                        E-posta
                    </p>

                    <p className="mt-2 text-lg font-medium">
                        {store.email}
                    </p>
                </div>

                <div className="border p-6">
                    <p className="text-sm text-gray-500">
                        Telefon
                    </p>

                    <p className="mt-2 text-lg font-medium">
                        {store.phoneNumber}
                    </p>
                </div>

            </div>

            <div className="mt-10">

                <Link
                    to="/store/products/new"
                    className="inline-block border border-black px-6 py-3 text-sm"
                >
                    + Yeni Ürün Ekle
                </Link>

            </div>

        </main>
    );
}

export default Store;