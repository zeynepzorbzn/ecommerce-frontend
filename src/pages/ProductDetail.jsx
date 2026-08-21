import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_QUERY } from "../graphqls/queries/product";

function ProductDetail() {
    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_PRODUCT_QUERY, {
        variables: {
            id,
        },
    });

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Ürün yükleniyor...</p>
            </main>
        );
    }

    if (error) {
        console.error("GET PRODUCT ERROR:", error);

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p className="text-red-500">
                    Ürün yüklenirken bir hata oluştu.
                </p>
            </main>
        );
    }

    const product = data?.getProduct;

    if (!product) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Ürün bulunamadı.</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <div className="grid gap-12 md:grid-cols-2">

                {/* Product Image */}
                <div className="aspect-[4/5] bg-gray-200">
                    <div className="flex h-full items-center justify-center text-gray-400">
                        Product Image
                    </div>
                </div>

                {/* Product Information */}
                <div>

                    <p className="text-sm uppercase tracking-wider text-gray-400">
                        {product.categoryName}
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold">
                        {product.name}
                    </h1>

                    <p className="mt-6 text-2xl">
                        {product.price.toLocaleString("tr-TR")} TL
                    </p>

                    {product.description && (
                        <p className="mt-6 leading-7 text-gray-600">
                            {product.description}
                        </p>
                    )}

                    <div className="mt-8 space-y-3 text-sm">
                        <p>
                            <span className="font-medium">Marka:</span>{" "}
                            {product.brandName}
                        </p>

                        <p>
                            <span className="font-medium">Mağaza:</span>{" "}
                            {product.storeName}
                        </p>

                        <p>
                            <span className="font-medium">Cinsiyet:</span>{" "}
                            {product.gender}
                        </p>

                        <p>
                            <span className="font-medium">Sezon:</span>{" "}
                            {product.season}
                        </p>
                    </div>

                </div>

            </div>

        </main>
    );
}

export default ProductDetail;