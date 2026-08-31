import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSelector } from "react-redux";

import { getProductImage } from "../utils/image";

import { GET_PRODUCT_QUERY } from "../graphqls/queries/product";
import { ADD_TO_CART_MUTATION } from "../graphqls/queries/cart";


function ProductDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const accessToken = useSelector(
        (state) => state.auth.accessToken
    );

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [selectedImage, setSelectedImage] = useState(null);

    /*
     * File Service'den gelen gerçek image URL'leri.
     *
     * {
     *   "image-token-1": "blob:http://localhost:5173/....",
     *   "image-token-2": "blob:http://localhost:5173/...."
     * }
     */
    const [imageUrls, setImageUrls] = useState({});

    /*
     * Ürünü Java Backend'den GraphQL ile alıyoruz.
     *
     * Burada resmin kendisi gelmez.
     * Sadece imageToken gelir.
     */
    const {
        loading,
        error,
        data
    } = useQuery(GET_PRODUCT_QUERY, {
        variables: {
            id
        }
    });

    const [addToCart, { loading: addingToCart }] =
        useMutation(ADD_TO_CART_MUTATION);

    const product = data?.getProduct;

    /*
     * Ürün geldiğinde ilk resmi seç.
     */
    useEffect(() => {

        if (product?.images?.length > 0) {
            setSelectedImage(product.images[0]);
        } else {
            setSelectedImage(null);
        }

    }, [product]);

    /*
     * File Service'den ürün resimlerini getir.
     *
     * ÖNEMLİ:
     *
     * Burada Java API kullanılmıyor.
     *
     * React
     *   ↓
     * File Service
     *   ↓
     * MinIO
     *
     * şeklinde çalışıyor.
     */
    useEffect(() => {

        if (!product?.images?.length || !accessToken) {
            return;
        }

        let cancelled = false;

        const loadImages = async () => {

            const urls = {};

            for (const image of product.images) {

                if (!image?.imageToken) {
                    continue;
                }

                const imageUrl = await getProductImage(
                    image.imageToken,
                    accessToken
                );

                if (imageUrl) {
                    urls[image.imageToken] = imageUrl;
                }
            }

            if (!cancelled) {
                setImageUrls(urls);
            }
        };

        loadImages();

        /*
         * Component kapanırsa oluşturulan blob URL'lerini temizle.
         */
        return () => {

            cancelled = true;

            setImageUrls((currentUrls) => {

                Object.values(currentUrls).forEach((url) => {

                    if (url) {
                        URL.revokeObjectURL(url);
                    }

                });

                return {};
            });
        };

    }, [product, accessToken]);

    /*
     * Loading
     */
    if (loading) {

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Ürün yükleniyor...</p>
            </main>
        );
    }

    /*
     * GraphQL error
     */
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

    /*
     * Ürün bulunamadı
     */
    if (!product) {

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">

                <p>
                    Ürün bulunamadı.
                </p>

            </main>
        );
    }

    /*
     * Sepete ekleme
     */
    const handleAddToCart = async () => {

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (!selectedVariantId) {

            alert(
                "Lütfen bir ürün varyantı seçin."
            );

            return;
        }

        try {

            const result = await addToCart({
                variables: {
                    input: {
                        productVariantId: selectedVariantId,
                        quantity: quantity
                    }
                }
            });

            console.log(
                "Sepete eklendi:",
                result.data
            );

            alert(
                "Ürün sepete eklendi."
            );

        } catch (error) {

            console.error(
                "ADD TO CART ERROR:",
                error
            );

            alert(
                error.message ||
                "Ürün sepete eklenirken bir hata oluştu."
            );
        }
    };

    /*
     * Seçili resmin URL'i.
     */
    const selectedImageUrl =
        selectedImage?.imageToken
            ? imageUrls[selectedImage.imageToken]
            : null;

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <div className="grid gap-12 md:grid-cols-2">

                {/* =========================
                    PRODUCT IMAGES
                ========================== */}

                <div>

                    {/* Büyük resim */}

                    <div className="aspect-[4/5] overflow-hidden bg-gray-200">

                        {selectedImageUrl ? (

                            <img
                                src={selectedImageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />

                        ) : (

                            <div className="flex h-full items-center justify-center text-gray-400">

                                Ürün resmi yükleniyor...

                            </div>

                        )}

                    </div>


                    {/* Küçük resimler */}

                    {product.images?.length > 0 && (

                        <div className="mt-4 flex gap-3 overflow-x-auto">

                            {product.images.map((image) => {

                                const imageUrl =
                                    imageUrls[image.imageToken];

                                return (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedImage(image)
                                        }
                                        className={`h-20 w-20 shrink-0 overflow-hidden border-2 ${
                                            selectedImage?.id === image.id
                                                ? "border-black"
                                                : "border-transparent"
                                        }`}
                                    >

                                        {imageUrl ? (

                                            <img
                                                src={imageUrl}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                                ...
                                            </div>

                                        )}

                                    </button>
                                );
                            })}

                        </div>

                    )}

                </div>


                {/* =========================
                    PRODUCT INFORMATION
                ========================== */}

                <div>

                    <p className="text-sm uppercase tracking-wider text-gray-400">
                        {product.categoryName}
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold">
                        {product.name}
                    </h1>

                    <p className="mt-6 text-2xl">
                        {Number(product.price).toLocaleString("tr-TR")} TL
                    </p>

                    {product.description && (

                        <p className="mt-6 leading-7 text-gray-600">
                            {product.description}
                        </p>

                    )}


                    {/* PRODUCT DETAILS */}

                    <div className="mt-8 space-y-3 text-sm">

                        <p>
                            <span className="font-medium">
                                Marka:
                            </span>{" "}
                            {product.brandName}
                        </p>

                        <p>
                            <span className="font-medium">
                                Mağaza:
                            </span>{" "}
                            {product.storeName}
                        </p>

                        <p>
                            <span className="font-medium">
                                Cinsiyet:
                            </span>{" "}
                            {product.gender}
                        </p>

                        <p>
                            <span className="font-medium">
                                Sezon:
                            </span>{" "}
                            {product.season}
                        </p>

                    </div>


                    {/* =========================
                        VARIANTS
                    ========================== */}

                    <div className="mt-8">

                        <p className="mb-3 text-sm font-medium">
                            Varyant
                        </p>

                        <div className="flex flex-wrap gap-3">

                            {product.variants?.map(
                                (variant) => (

                                    <button
                                        key={variant.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedVariantId(
                                                variant.id
                                            )
                                        }
                                        disabled={
                                            variant.stock <= 0
                                        }
                                        className={`border px-4 py-2 text-sm ${
                                            selectedVariantId === variant.id
                                                ? "border-black bg-black text-white"
                                                : "border-gray-300"
                                        } ${
                                            variant.stock <= 0
                                                ? "cursor-not-allowed opacity-40"
                                                : ""
                                        }`}
                                    >

                                        {variant.color}
                                        {" / "}
                                        {variant.size}

                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* =========================
                        QUANTITY
                    ========================== */}

                    <div className="mt-6">

                        <p className="mb-3 text-sm font-medium">
                            Adet
                        </p>

                        <div className="flex items-center gap-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((q) =>
                                        Math.max(1, q - 1)
                                    )
                                }
                                className="border px-4 py-2"
                            >
                                -
                            </button>

                            <span>
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity(
                                        (q) => q + 1
                                    )
                                }
                                className="border px-4 py-2"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    {/* =========================
                        ADD TO CART
                    ========================== */}

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="mt-8 w-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                    >

                        {addingToCart
                            ? "Sepete ekleniyor..."
                            : "Sepete Ekle"}

                    </button>

                </div>

            </div>

        </main>
    );
}

export default ProductDetail;