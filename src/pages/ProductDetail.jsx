import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getProductImage } from "../utils/image";

import { GET_PRODUCT_QUERY } from "../graphqls/queries/product";
import { ADD_TO_CART_MUTATION, GET_CART_QUERY } from "../graphqls/queries/cart";
import { TRACK_ANALYTICS_EVENT_MUTATION } from "../graphqls/queries/analytics";
import { getAnalyticsSessionId } from "../utils/analytics";
import { showError, showSuccess } from "../utils/toast";


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

    const trackedProductId = useRef(null);

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
        useMutation(ADD_TO_CART_MUTATION, {
            refetchQueries: [
                {
                    query: GET_CART_QUERY,
                },
            ],
            awaitRefetchQueries: true,
        });

    const [trackAnalyticsEvent] = useMutation(
        TRACK_ANALYTICS_EVENT_MUTATION
    );


    const product = data?.getProduct;

    useEffect(() => {
        if (!product?.id) {
            return;
        }

        if (trackedProductId.current === product.id) {
            return;
        }

        trackedProductId.current = product.id;

        trackAnalyticsEvent({
            variables: {
                input: {
                    eventType: "VIEW_PRODUCT",
                    productId: Number(product.id),
                    sessionId: getAnalyticsSessionId(),
                    value: null
                }
            }
        }).catch((error) => {
            console.error(
                "Analytics VIEW_PRODUCT error:",
                error
            );
        });
    }, [product?.id, trackAnalyticsEvent]);


    /*
     * =========================================================
     * ÜRÜN AÇILDIĞINDA İLK VARYANTI OTOMATİK SEÇ
     * =========================================================
     *
     * Ürünün varyantları varsa ilk stokta olan varyant seçilir.
     *
     * Örneğin:
     *
     * 36 → stok 0
     * 37 → stok 5
     * 38 → stok 10
     *
     * otomatik olarak 37 seçilir.
     *
     * Ürünün hiç varyantı yoksa selectedVariantId null kalır.
     */
    useEffect(() => {

        if (!product) {
            return;
        }

        const variants = product.variants ?? [];

        if (variants.length === 0) {
            setSelectedVariantId(null);
            return;
        }

        const firstAvailableVariant =
            variants.find(
                (variant) => Number(variant.stock) > 0
            ) ?? variants[0];

        setSelectedVariantId(
            firstAvailableVariant.id
        );

    }, [product?.id]);


    /*
     * =========================================================
     * SEÇİLEN VARYANTI BUL
     * =========================================================
     */
    const selectedVariant = product?.variants?.find(
        (variant) =>
            Number(variant.id) === Number(selectedVariantId)
    );


    /*
     * =========================================================
     * GALERİDE GÖSTERİLECEK FOTOĞRAFLAR
     * =========================================================
     *
     * Varyant seçilmişse:
     *      → sadece o varyantın fotoğrafları
     *
     * Varyant seçilmemişse:
     *      → ürünün genel fotoğrafları
     *
     * Ürünün hiç varyantı yoksa da:
     *      → ürünün genel fotoğrafları
     */
    const galleryImages =
        selectedVariantId && selectedVariant
            ? selectedVariant.images ?? []
            : product?.images ?? [];


    /*
     * =========================================================
     * VARYANT / ÜRÜN DEĞİŞİNCE İLK FOTOĞRAFI SEÇ
     * =========================================================
     *
     * Burada galleryImages dependency olarak kullanılmıyor.
     *
     * Çünkü galleryImages her render'da yeni bir array
     * oluşturabilir ve bu da Maximum update depth hatasına
     * neden olabilir.
     */
    useEffect(() => {

        if (!product) {
            return;
        }

        const images =
            selectedVariantId && selectedVariant
                ? selectedVariant.images ?? []
                : product.images ?? [];

        if (images.length > 0) {
            setSelectedImage(images[0]);
        } else {
            setSelectedImage(null);
        }

    }, [
        product?.id,
        selectedVariantId
    ]);


    /*
     * =========================================================
     * GÖRSEL TOKENLARININ STABİL ANAHTARI
     * =========================================================
     *
     * galleryImages array'i render'larda yeniden oluşabileceği
     * için doğrudan dependency olarak kullanmıyoruz.
     *
     * Bunun yerine fotoğraf tokenlarından stabil bir string
     * oluşturuyoruz.
     */
    const galleryImageTokens = galleryImages
        .map((image) => image?.imageToken)
        .filter(Boolean)
        .join("|");


    /*
     * =========================================================
     * FILE SERVICE'DEN GÖRSELLERİ YÜKLE
     * =========================================================
     *
     * İlk fotoğraf önce yüklenir.
     *
     * Böylece kullanıcı bütün fotoğrafların yüklenmesini
     * beklemeden ilk fotoğrafı görebilir.
     *
     * Diğer fotoğraflar paralel olarak yüklenir.
     */

    useEffect(() => {

        const images =
            selectedVariantId && selectedVariant
                ? selectedVariant.images ?? []
                : product?.images ?? [];


        if (!images.length) {

            setImageUrls({});

            return;
        }


        let cancelled = false;



        const loadImages = async () => {

            const validImages =
                images.filter(
                    (image) =>
                        image?.imageToken
                );


            if (!validImages.length) {

                if (!cancelled) {
                    setImageUrls({});
                }

                return;
            }


            /*
             * -----------------------------------------------------
             * Bütün görseller
             * -----------------------------------------------------
             */
            const results =
                await Promise.all(
                    validImages.map(
                        async (image) => {

                            const url =
                                await getProductImage(
                                    image.imageToken,
                                    accessToken
                                );

                            return {
                                token:
                                image.imageToken,
                                url
                            };
                        }
                    )
                );


            if (cancelled) {
                return;
            }


            const urls = {};


            results.forEach(
                ({ token, url }) => {

                    if (url) {

                        urls[token] = url;
                    }

                }
            );


            setImageUrls(urls);
        };


        loadImages();


        return () => {
            cancelled = true;
        };


    }, [
        product?.id,
        selectedVariantId,
        galleryImageTokens,
        accessToken
    ]);

    /*
     * =========================================================
     * LOADING
     * =========================================================
     */
    if (loading) {

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Ürün yükleniyor...</p>
            </main>
        );
    }


    /*
     * =========================================================
     * GRAPHQL ERROR
     * =========================================================
     */
    if (error) {

        console.error(
            "GET PRODUCT ERROR:",
            error
        );

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">

                <p className="text-red-500">
                    Ürün yüklenirken bir hata oluştu.
                </p>

            </main>
        );
    }


    /*
     * =========================================================
     * ÜRÜN BULUNAMADI
     * =========================================================
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
     * =========================================================
     * SEPETE EKLEME
     * =========================================================
     */
    const handleAddToCart = async () => {

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (!selectedVariantId) {
            showError(
                null,
                "Lütfen bir ürün seçeneği seçin."
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

            // Analytics: ADD_TO_CART
            try {
                await trackAnalyticsEvent({
                    variables: {
                        input: {
                            eventType: "ADD_TO_CART",
                            productId: Number(product.id),
                            sessionId: getAnalyticsSessionId(),
                            value: Number(product.price) * quantity
                        }
                    }
                });
            } catch (analyticsError) {
                console.error(
                    "Analytics ADD_TO_CART error:",
                    analyticsError
                );
            }

            showSuccess("Ürün sepete eklendi.");

        } catch (error) {

            console.error(
                "ADD TO CART ERROR:",
                error
            );

            showError(
                error,
                "Ürün sepete eklenirken bir hata oluştu."
            );
        }
    };




    /*
     * =========================================================
     * SEÇİLİ RESMİN URL'İ
     * =========================================================
     */
    const selectedImageUrl =
        selectedImage?.imageToken
            ? imageUrls[selectedImage.imageToken]
            : null;


    /*
     * =========================================================
     * GALERİDEKİ MEVCUT FOTOĞRAFIN INDEX'İ
     * =========================================================
     */
    const currentImageIndex =
        selectedImage
            ? galleryImages.findIndex(
                (image) =>
                    image.id === selectedImage.id
            )
            : -1;


    /*
     * =========================================================
     * ÖNCEKİ FOTOĞRAF
     * =========================================================
     */
    const handlePreviousImage = () => {

        if (galleryImages.length === 0) {
            return;
        }


        const previousIndex =
            currentImageIndex <= 0
                ? galleryImages.length - 1
                : currentImageIndex - 1;


        setSelectedImage(
            galleryImages[previousIndex]
        );
    };


    /*
     * =========================================================
     * SONRAKİ FOTOĞRAF
     * =========================================================
     */
    const handleNextImage = () => {

        if (galleryImages.length === 0) {
            return;
        }


        const nextIndex =
            currentImageIndex >= galleryImages.length - 1 ||
            currentImageIndex === -1
                ? 0
                : currentImageIndex + 1;


        setSelectedImage(
            galleryImages[nextIndex]
        );
    };


    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <div className="grid gap-12 md:grid-cols-2">


                {/* =================================================
                    PRODUCT IMAGES
                ================================================== */}

                <div>

                    {/* Büyük resim */}

                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">


                        {/* =================================================
                            SOL OK
                        ================================================== */}

                        {galleryImages.length > 1 && (

                            <button
                                type="button"
                                onClick={
                                    handlePreviousImage
                                }
                                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-black hover:text-white"
                                aria-label="Önceki fotoğraf"
                            >

                                <ChevronLeft size={20} />

                            </button>

                        )}


                        {/* =================================================
                            SAĞ OK
                        ================================================== */}

                        {galleryImages.length > 1 && (

                            <button
                                type="button"
                                onClick={
                                    handleNextImage
                                }
                                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-black hover:text-white"
                                aria-label="Sonraki fotoğraf"
                            >

                                <ChevronRight size={20} />

                            </button>

                        )}


                        {/* =================================================
                            BÜYÜK FOTOĞRAF
                        ================================================== */}

                        {selectedImageUrl ? (

                            <img
                                src={selectedImageUrl}
                                alt={product.name}
                                className="h-full w-full object-contain"
                            />

                        ) : (

                            <div className="flex h-full items-center justify-center text-gray-400">

                                {galleryImages.length > 0
                                    ? "Ürün resmi yükleniyor..."
                                    : "Bu seçenek için fotoğraf bulunmuyor."}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        KÜÇÜK RESİMLER
                    ================================================== */}

                    {galleryImages.length > 0 && (

                        <div className="mt-4 flex gap-3 overflow-x-auto">

                            {galleryImages.map(
                                (image) => {

                                    const imageUrl =
                                        imageUrls[
                                            image.imageToken
                                            ];


                                    return (

                                        <button
                                            key={image.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedImage(
                                                    image
                                                )
                                            }
                                            className={`h-20 w-20 shrink-0 overflow-hidden border-2 ${
                                                selectedImage?.id ===
                                                image.id
                                                    ? "border-black"
                                                    : "border-transparent"
                                            }`}
                                        >

                                            {imageUrl ? (

                                                <img
                                                    src={imageUrl}
                                                    alt={
                                                        product.name
                                                    }
                                                    className="h-full w-full object-contain"
                                                />

                                            ) : (

                                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                                    ...
                                                </div>

                                            )}

                                        </button>

                                    );
                                }
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    PRODUCT INFORMATION
                ================================================== */}

                <div>

                    <p className="text-sm uppercase tracking-wider text-gray-400">
                        {product.categoryName}
                    </p>


                    <h1 className="mt-2 text-4xl font-semibold">

                        {product.brandName && (

                            <span className="font-bold text-gray-950">

                                {product.brandName}
                                {" "}

                            </span>

                        )}

                        <span className="text-gray-700">
                            {product.name}
                        </span>

                    </h1>


                    <p className="mt-6 text-2xl">

                        {Number(
                            product.price
                        ).toLocaleString(
                            "tr-TR"
                        )}

                        {" "}TL

                    </p>


                    {product.description && (

                        <p className="mt-6 leading-7 text-gray-600">
                            {product.description}
                        </p>

                    )}


                    {/* =================================================
                        PRODUCT DETAILS
                    ================================================== */}

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


                    {/* =================================================
                        VARIANTS
                    ================================================== */}

                    {product.variants?.length > 0 && (

                        <div className="mt-8">

                            <p className="mb-3 text-sm font-medium">
                                Seçenek
                            </p>


                            <div className="flex flex-wrap gap-3">

                                {product.variants.map(
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
                                                Number(
                                                    selectedVariantId
                                                ) ===
                                                Number(
                                                    variant.id
                                                )
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

                    )}


                    {/* =================================================
                        QUANTITY
                    ================================================== */}

                    <div className="mt-6">

                        <p className="mb-3 text-sm font-medium">
                            Adet
                        </p>


                        <div className="flex items-center gap-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity(
                                        (q) =>
                                            Math.max(
                                                1,
                                                q - 1
                                            )
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


                    {/* =================================================
                        ADD TO CART
                    ================================================== */}

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={
                            addingToCart ||
                            (
                                product.variants?.length > 0 &&
                                !selectedVariantId
                            )
                        }
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