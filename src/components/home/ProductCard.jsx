import { useEffect, useMemo, useState } from "react";
import { Heart, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getProductImage } from "../../utils/image.js";
import { isFavorite, toggleFavorite } from "../../utils/favorites.js";

function ProductCard({ product, badge }) {
    const navigate = useNavigate();

    const accessToken = useSelector(
        (state) => state.auth.accessToken
    );

    const [imageUrls, setImageUrls] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [favorite, setFavorite] = useState(() =>
        isFavorite(product?.id)
    );

    /*
     * =========================================================
     * ANA SAYFA KARTINDA KULLANILACAK FOTOĞRAFLAR
     * =========================================================
     *
     * Öncelik:
     *
     * 1. Ürünün kendi fotoğrafları
     * 2. Ürünün kendi fotoğrafı yoksa
     *    fotoğrafı olan ilk varyantın fotoğrafları
     *
     * Böylece varyant bazlı fotoğrafları olan ürünler
     * ana sayfada da görünebilir.
     */
    const cardImages = useMemo(() => {

        const productImages =
            product?.images ?? [];

        /*
         * Önce ürünün doğrudan kendisine ait
         * fotoğrafları kontrol edilir.
         */
        const directImages =
            productImages.filter(
                (image) =>
                    image?.imageToken &&
                    !image?.variantId
            );

        if (directImages.length > 0) {
            return directImages;
        }

        /*
         * Ürün seviyesinde fotoğraf yoksa
         * varyant fotoğraflarına geç.
         */
        const variants =
            product?.variants ?? [];

        /*
         * Önce stokta olan ve fotoğrafı bulunan
         * bir varyantı tercih et.
         */
        const variantWithImages =
            variants.find(
                (variant) =>
                    Number(variant?.stock) > 0 &&
                    variant?.images?.some(
                        (image) =>
                            image?.imageToken
                    )
            ) ??
            variants.find(
                (variant) =>
                    variant?.images?.some(
                        (image) =>
                            image?.imageToken
                    )
            );

        if (!variantWithImages) {
            return [];
        }

        return (
            variantWithImages.images ?? []
        ).filter(
            (image) =>
                image?.imageToken
        );

    }, [
        product?.images,
        product?.variants
    ]);


    /*
     * =========================================================
     * FOTOĞRAF TOKEN KEY
     * =========================================================
     *
     * cardImages array'inin referansını dependency olarak
     * kullanmak yerine gerçekten fotoğrafların değişip
     * değişmediğini token'lar üzerinden takip ediyoruz.
     *
     * Örnek:
     *
     * token1|token2|token3
     *
     * Aynı fotoğraflar olduğu sürece gereksiz yükleme
     * tetiklenmez.
     */
    const imageTokens = useMemo(() => {

        return cardImages
            .map(
                (image) =>
                    image?.imageToken
            )
            .filter(Boolean)
            .join("|");

    }, [cardImages]);


    /*
     * =========================================================
     * FAVORİ DURUMU
     * =========================================================
     */
    useEffect(() => {

        const update = () => {
            setFavorite(
                isFavorite(product?.id)
            );
        };

        window.addEventListener(
            "favoritesChanged",
            update
        );

        window.addEventListener(
            "storage",
            update
        );

        return () => {

            window.removeEventListener(
                "favoritesChanged",
                update
            );

            window.removeEventListener(
                "storage",
                update
            );
        };

    }, [product?.id]);


    /*
     * =========================================================
     * FOTOĞRAFLARI YÜKLE
     * =========================================================
     *
     * Blob URL yaşam döngüsü merkezi image cache tarafından yönetilir.
     * Component unmount olduğunda URL revoke edilmez; aynı imageToken
     * başka bir sayfada tekrar kullanılabilir.
     */
    useEffect(() => {

        if (!imageTokens) {
            setImageUrls([]);
            setCurrentImageIndex(0);
            return;
        }

        let cancelled = false;

        const loadImages = async () => {

            const validImages =
                cardImages.filter(
                    (image) =>
                        image?.imageToken
                );


            if (!validImages.length) {

                if (!cancelled) {
                    setImageUrls([]);
                    setCurrentImageIndex(0);
                }

                return;
            }


            /*
             * -------------------------------------------------
             * İlk fotoğraf
             * -------------------------------------------------
             */
            const firstImage =
                validImages[0];

            const firstUrl =
                await getProductImage(
                    firstImage.imageToken,
                    accessToken
                );


            if (cancelled) {
                return;
            }


            if (firstUrl) {

                setImageUrls([firstUrl]);
                setCurrentImageIndex(0);

            } else {

                setImageUrls([]);
                setCurrentImageIndex(0);
            }


            /*
             * -------------------------------------------------
             * Diğer fotoğraflar
             * -------------------------------------------------
             */
            if (validImages.length <= 1) {
                return;
            }


            const remainingResults =
                await Promise.all(
                    validImages
                        .slice(1)
                        .map(async (image) => {

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
                        })
                );


            if (cancelled) {
                return;
            }


            const allUrls = [
                firstUrl,
                ...remainingResults
                    .map(({ url }) => url)
                    .filter(Boolean)
            ];


            setImageUrls(allUrls);
            setCurrentImageIndex(0);
        };


        loadImages();


        return () => {
            cancelled = true;
        };


    }, [
        imageTokens,
        accessToken
    ]);

    /*
     * =========================================================
     * OTOMATİK FOTOĞRAF DEĞİŞTİRME
     * =========================================================
     */
    useEffect(() => {

        if (imageUrls.length <= 1) {
            return;
        }

        const interval =
            setInterval(() => {

                setCurrentImageIndex(
                    (current) =>
                        current ===
                        imageUrls.length - 1
                            ? 0
                            : current + 1
                );

            }, 3000);

        return () =>
            clearInterval(interval);

    }, [imageUrls.length]);


    /*
     * =========================================================
     * FAVORİ
     * =========================================================
     */
    const handleFavorite = (event) => {

        event.stopPropagation();

        setFavorite(
            toggleFavorite(product.id)
        );
    };


    return (
        <article
            onClick={() =>
                navigate(
                    `/products/${product.id}`
                )
            }
            className="group cursor-pointer"
        >

            <div className="
                relative
                aspect-[4/5]
                overflow-hidden
                rounded-2xl
                bg-gray-100
            ">

                {imageUrls.length > 0 ? (

                    <div className="
                        relative
                        h-full
                        w-full
                    ">

                        {imageUrls.map(
                            (url, index) => (

                                <img
                                    key={`${url}-${index}`}
                                    src={url}
                                    alt={`${product.name} - ${index + 1}`}
                                    loading={
                                        index === 0
                                            ? "eager"
                                            : "lazy"
                                    }
                                    decoding="async"
                                    className={`
                                        absolute
                                        inset-0
                                        h-full
                                        w-full
                                        object-cover
                                        transition-all
                                        duration-700
                                        ease-out
                                        ${
                                        index ===
                                        currentImageIndex
                                            ? "scale-100 opacity-100"
                                            : "scale-[1.02] opacity-0"
                                    }
                                    `}
                                />

                            )
                        )}

                    </div>

                ) : (

                    <div className="
                        flex
                        h-full
                        items-center
                        justify-center
                        bg-gradient-to-br
                        from-gray-100
                        to-gray-200
                        text-xs
                        uppercase
                        tracking-widest
                        text-gray-400
                    ">
                        ZEY'Z
                    </div>

                )}


                {/* BADGE */}

                <div className="
                    absolute
                    left-3
                    top-3
                    flex
                    gap-2
                ">

                    {badge && (
                        <span className="
                            rounded-full
                            bg-white
                            px-3
                            py-1.5
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wider
                            shadow-sm
                        ">
                            {badge}
                        </span>
                    )}

                </div>


                {/* FOTOĞRAF GÖSTERGELERİ */}

                {imageUrls.length > 1 && (

                    <div className="
                        absolute
                        bottom-4
                        left-1/2
                        z-10
                        flex
                        -translate-x-1/2
                        gap-1.5
                    ">

                        {imageUrls.map(
                            (_, index) => (

                                <span
                                    key={index}
                                    className={`
                                        h-1
                                        rounded-full
                                        transition-all
                                        duration-300
                                        ${
                                        index ===
                                        currentImageIndex
                                            ? "w-5 bg-white"
                                            : "w-1 bg-white/60"
                                    }
                                    `}
                                />

                            )
                        )}

                    </div>
                )}


                {/* FAVORİ */}

                <button
                    type="button"
                    onClick={handleFavorite}
                    className={`
                        absolute
                        right-3
                        top-3
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        backdrop-blur-md
                        transition
                        duration-300
                        ${
                        favorite
                            ? "bg-black text-white"
                            : "bg-white/90 text-black hover:bg-black hover:text-white"
                    }
                    `}
                    aria-label={
                        favorite
                            ? "Favorilerden çıkar"
                            : "Favorilere ekle"
                    }
                >

                    <Heart
                        size={17}
                        fill={
                            favorite
                                ? "currentColor"
                                : "none"
                        }
                        strokeWidth={1.7}
                    />

                </button>


                {/* ÜRÜNÜ İNCELE */}

                <div className="
                    absolute
                    bottom-3
                    left-3
                    right-3
                    translate-y-2
                    opacity-0
                    transition
                    duration-300
                    group-hover:translate-y-0
                    group-hover:opacity-100
                ">

                    <div className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-white/95
                        py-3
                        text-xs
                        font-semibold
                        shadow-lg
                        backdrop-blur
                    ">
                        Ürünü İncele
                        <Plus size={15} />
                    </div>

                </div>

            </div>


            {/* ÜRÜN BİLGİLERİ */}

            <div className="
                px-1
                pt-4
            ">

                <div className="
                    flex
                    items-start
                    justify-between
                    gap-3
                ">

                    <div className="
                        min-w-0
                    ">

                        <p className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.16em]
                            text-gray-400
                        ">
                            {product.categoryName ||
                                "Koleksiyon"}
                        </p>

                        <h3 className="
                            mt-1
                            truncate
                            text-sm
                            font-semibold
                            text-gray-900
                        ">
                            {product.name}
                        </h3>

                        {product.brandName && (
                            <p className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">
                                {product.brandName}
                            </p>
                        )}

                    </div>

                    <p className="
                        shrink-0
                        text-sm
                        font-semibold
                    ">
                        {Number(
                            product.price
                        ).toLocaleString(
                            "tr-TR",
                            {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                            }
                        )}{" "}
                        ₺
                    </p>

                </div>

            </div>

        </article>
    );
}

export default ProductCard;