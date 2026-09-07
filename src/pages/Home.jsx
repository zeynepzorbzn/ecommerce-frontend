import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import CategorySection from "../components/home/CategorySection.jsx";
import ProductCard from "../components/home/ProductCard";
import { GET_CATEGORIES_QUERY } from "../graphqls/queries/category";
import { GET_PRODUCTS_QUERY } from "../graphqls/queries/product";
import { getProductImage } from "../utils/image.js";

function ProductSlider({ title, kicker, products, badge }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const PRODUCTS_PER_SLIDE = 4;

    const slides = [];

    for (let i = 0; i < products.length; i += PRODUCTS_PER_SLIDE) {
        slides.push(products.slice(i, i + PRODUCTS_PER_SLIDE));
    }

    const totalSlides = slides.length;

    useEffect(() => {
        if (totalSlides <= 1 || isPaused) {
            return;
        }

        const timer = setInterval(() => {
            setCurrentSlide((current) =>
                current === totalSlides - 1 ? 0 : current + 1
            );
        }, 4000);

        return () => clearInterval(timer);
    }, [totalSlides, isPaused]);

    useEffect(() => {
        if (currentSlide >= totalSlides && totalSlides > 0) {
            setCurrentSlide(0);
        }
    }, [currentSlide, totalSlides]);

    const next = () => {
        if (totalSlides <= 1) return;

        setCurrentSlide((current) =>
            current === totalSlides - 1 ? 0 : current + 1
        );
    };

    const prev = () => {
        if (totalSlides <= 1) return;

        setCurrentSlide((current) =>
            current === 0 ? totalSlides - 1 : current - 1
        );
    };

    return (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">

            {/* HEADER */}
            <div className="mb-10 flex items-end justify-between gap-5">
                <div>
                    <p className="section-kicker">
                        {kicker}
                    </p>

                    <h2 className="section-title">
                        {title}
                    </h2>
                </div>

                {totalSlides > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={prev}
                            className="
                                flex h-10 w-10 items-center justify-center
                                rounded-full
                                border border-black/10
                                bg-white
                                transition-all duration-300
                                hover:bg-black hover:text-white
                            "
                            aria-label="Önceki ürünler"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={next}
                            className="
                                flex h-10 w-10 items-center justify-center
                                rounded-full
                                border border-black/10
                                bg-white
                                transition-all duration-300
                                hover:bg-black hover:text-white
                            "
                            aria-label="Sonraki ürünler"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* SLIDER VIEWPORT */}
            {slides.length > 0 ? (
                <div
                    className="overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* SLIDER TRACK */}
                    <div
                        className="
                            flex
                            transition-transform
                            duration-700
                            ease-[cubic-bezier(0.22,1,0.36,1)]
                        "
                        style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                        }}
                    >
                        {slides.map((slide, slideIndex) => (
                            <div
                                key={slideIndex}
                                className="w-full shrink-0"
                            >
                                <div className="
                                    grid
                                    grid-cols-2
                                    gap-x-3
                                    gap-y-10
                                    md:grid-cols-4
                                    md:gap-x-5
                                ">
                                    {slide.map((product, productIndex) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            badge={
                                                badge && productIndex < 2
                                                    ? badge
                                                    : null
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="
                    rounded-2xl
                    border border-dashed border-gray-300
                    py-16
                    text-center
                    text-sm text-gray-500
                ">
                    Bu bölüm için henüz ürün bulunmuyor.
                </div>
            )}

            {/* SLIDE INDICATORS */}
            {totalSlides > 1 && (
                <div className="mt-7 flex justify-center gap-1.5">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentSlide(index)}
                            className={`
                                h-1.5 rounded-full transition-all duration-300
                                ${
                                currentSlide === index
                                    ? "w-7 bg-black"
                                    : "w-1.5 bg-black/15"
                            }
                            `}
                            aria-label={`${index + 1}. ürün grubu`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function Home() {
    const {
        loading: categoriesLoading,
        error: categoriesError,
        data: categoriesData,
    } = useQuery(GET_CATEGORIES_QUERY);

    const {
        loading: productsLoading,
        error: productsError,
        data: productsData,
    } = useQuery(GET_PRODUCTS_QUERY);

    const categories = categoriesData?.getCategories ?? [];
    const products = productsData?.getProducts ?? [];

    const heroProducts = products.slice(0, 4);

    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        if (heroProducts.length <= 1) {
            return;
        }

        // İlk açılışta ürünlerden rastgele birini seç
        setHeroIndex(
            Math.floor(Math.random() * heroProducts.length)
        );

        const timer = setInterval(() => {
            setHeroIndex((current) =>
                current === heroProducts.length - 1
                    ? 0
                    : current + 1
            );
        }, 4000);

        return () => clearInterval(timer);
    }, [heroProducts.length]);

    const heroProduct = heroProducts[heroIndex];

    return (
        <main className="overflow-hidden">

            {/* HERO / SLIDER */}
            <section className="relative bg-[#f2f0ec]">
                <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
                    <div className="relative z-10 max-w-xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em]">
                            <Sparkles size={13} />
                            Yeni sezon
                        </div>

                        <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                            Aradığın her şeyi
                            <br />
                            <span className="text-gray-500">keşfet.</span>
                        </h1>

                        <p className="mt-7 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
                            Sevdiğin markaları, yeni ürünleri ve özel koleksiyonları
                            ZEY'Z'de tek yerde keşfet.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-3 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                Alışverişe Başla
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                to="/categories"
                                className="rounded-full border border-black/15 bg-white/60 px-7 py-3.5 text-sm font-semibold transition hover:bg-white"
                            >
                                Kategorileri Keşfet
                            </Link>
                        </div>
                    </div>

                    <div className="relative mx-auto h-[430px] w-full max-w-[520px] md:h-[500px]">
                        <div className="absolute inset-4 rotate-[-4deg] rounded-[2rem] bg-white/60 shadow-2xl" />
                        <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-200 to-gray-300 shadow-2xl">
                             (
                                <HeroImage product={heroProduct} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-gray-500">
                                    ZEY'Z COLLECTION
                                </div>
                            )

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-7 pt-28 text-white">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                                    Öne çıkan
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {heroProduct?.name || "Yeni koleksiyon"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST STRIP */}
            <section className="border-b border-black/5 bg-white">
                <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-black/5 px-6 py-5 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500 sm:grid-cols-4">
                    <span>Güvenli alışveriş</span>
                    <span>Kolay iade</span>
                    <span>Yeni koleksiyonlar</span>
                    <span>Özenle seçilmiş ürünler</span>
                </div>
            </section>

            {/* CATEGORIES */}
            {!categoriesLoading && !categoriesError && (
                <CategorySection
                    categories={categories}
                    onCategorySelect={(category) => {
                        window.location.href = `/products?categoryId=${category.id}`;
                    }}
                />
            )}

            {/* PRODUCTS */}
            {!productsLoading && !productsError && (
                <>
                    <div className="bg-gray-50">
                        <ProductSlider
                            kicker="Şimdi keşfet"
                            title="Yeni Gelenler"
                            products={products}
                            badge="Yeni"
                        />
                    </div>

                    <ProductSlider
                        kicker="Seçtiklerimiz"
                        title="Öne Çıkanlar"
                        products={[...products].reverse()}
                        badge="Öne Çıkan"
                    />
                </>
            )}

            {/* DISCOVER BANNER */}
            <section className="mx-auto max-w-7xl px-6 pb-24 pt-6">
                <div className="relative overflow-hidden rounded-[2rem] bg-black px-7 py-16 text-white sm:px-12 lg:px-20 lg:py-20">
                    <div className="relative z-10 max-w-xl">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">
                            ZEY'Z edit
                        </p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Stilini yeniden keşfet.
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-white/55">
                            Günün her anına uyacak ürünleri keşfet ve kendi
                            favorilerini oluştur.
                        </p>
                        <Link
                            to="/products"
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                        >
                            Tüm ürünlere git
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
                    <div className="absolute -bottom-32 right-20 h-80 w-80 rounded-full border border-white/10" />
                </div>
            </section>
        </main>
    );
}


function HeroImage({ product }) {
    const accessToken = useSelector(
        (state) => state.auth.accessToken
    );

    const [imageUrl, setImageUrl] = useState(null);

    const imageToken =
        product?.images?.find(
            (image) =>
                image?.imageToken &&
                !image?.variantId
        )?.imageToken
        ??
        product?.images?.find(
            (image) =>
                image?.imageToken
        )?.imageToken
        ??
        product?.variants
            ?.find(
                (variant) =>
                    Number(variant?.stock) > 0 &&
                    variant?.images?.some(
                        (image) =>
                            image?.imageToken
                    )
            )
            ?.images?.find(
            (image) =>
                image?.imageToken
        )?.imageToken
        ??
        product?.variants
            ?.find(
                (variant) =>
                    variant?.images?.some(
                        (image) =>
                            image?.imageToken
                    )
            )
            ?.images?.find(
            (image) =>
                image?.imageToken
        )?.imageToken;

    useEffect(() => {
        if (!imageToken || !accessToken) {
            setImageUrl(null);
            return;
        }

        let cancelled = false;

        getProductImage(
            imageToken,
            accessToken
        ).then((url) => {
            if (!cancelled) {
                setImageUrl(url);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [imageToken, accessToken]);

    if (!imageUrl) {
        return (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-gray-500">
                ZEY'Z COLLECTION
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-1000 hover:scale-105"
        />
    );
}

export default Home;
