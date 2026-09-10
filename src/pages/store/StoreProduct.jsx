import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { showError, showSuccess } from "../../utils/toast";

import {DELETE_PRODUCT_MUTATION} from "../../graphqls/mutations/product";

import { GET_MY_STORE_PRODUCTS_QUERY } from "../../graphqls/queries/product";

function StoreProduct() {

    const { data, loading, error } = useQuery(
        GET_MY_STORE_PRODUCTS_QUERY
    );
    const [deleteProduct] =
        useMutation(DELETE_PRODUCT_MUTATION);

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Ürünler yükleniyor...</p>
            </main>
        );
    }

    if (error) {
        console.error("MY STORE PRODUCTS ERROR:", error);

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p className="text-red-500">
                    Ürünler yüklenirken hata oluştu.
                </p>
            </main>
        );
    }

    const products =
        data?.getMyStoreProducts ?? [];

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm uppercase tracking-widest text-gray-400">
                        Store Manager
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold">
                        Ürünlerim
                    </h1>
                </div>

                <Link
                    to="/store/products/new"
                    className="bg-black px-6 py-3 text-sm text-white"
                >
                    + Yeni Ürün
                </Link>

            </div>

            {products.length === 0 ? (

                <div className="mt-12 border p-10 text-center">

                    <p className="text-gray-500">
                        Henüz ürününüz bulunmuyor.
                    </p>

                    <Link
                        to="/store/products/new"
                        className="mt-5 inline-block border border-black px-5 py-3"
                    >
                        İlk Ürününü Ekle
                    </Link>

                </div>


            ) : (


                <div className="mt-10 grid gap-6 md:grid-cols-3">

                    {products.map((product) => (

                        <div
                            key={product.id}
                            className="border p-6"
                        >

                            <h2 className="text-lg font-medium">
                                {product.name}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                {product.brandName}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                {product.categoryName}
                            </p>

                            <p className="mt-4 text-lg font-semibold">
                                {Number(product.price).toLocaleString("tr-TR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })} TL
                            </p>
                            <div className="mt-5 flex gap-3">

                                <Link
                                    to={`/store/products/${product.id}/edit`}
                                    className="border border-black px-4 py-2 text-sm"
                                >
                                    Düzenle
                                </Link>

                                <button
                                    onClick={async () => {
                                        if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
                                            return;
                                        }

                                        try {
                                            await deleteProduct({
                                                variables: {
                                                    id: product.id
                                                }
                                            });

                                            showSuccess("Ürün silindi.");
                                            window.location.reload();

                                        } catch (error) {
                                            showError(error, "Ürün silinemedi.");
                                        }
                                    }}
                                    className="border border-red-500 px-4 py-2 text-sm text-red-500"
                                >
                                    Sil
                                </button>

                                <Link
                                    to={`/store/products/${product.id}/variants`}
                                    className="border border-black px-4 py-2 text-sm"
                                >
                                    Seçenekler
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
}

export default StoreProduct;