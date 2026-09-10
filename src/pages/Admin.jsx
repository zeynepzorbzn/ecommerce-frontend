import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { BarChart3, Package, Store as StoreIcon } from "lucide-react";
import { Link } from "react-router-dom";

import AnalyticsDatePicker from "../components/analytics/AnalyticsDatePicker";
import AnalyticsMetricCard from "../components/analytics/AnalyticsMetricCard";
import AnalyticsProductTable from "../components/analytics/AnalyticsProductTable";
import AnalyticsStoreTable from "../components/analytics/AnalyticsStoreTable";
import {
    GET_PLATFORM_ANALYTICS_QUERY,
    GET_STORE_ANALYTICS_QUERY,
    GET_TOP_SELLING_PRODUCTS_ANALYTICS_QUERY,
    GET_TOP_VIEWED_PRODUCTS_ANALYTICS_QUERY,
} from "../graphqls/queries/analytics";
import { GET_PRODUCTS_QUERY } from "../graphqls/queries/product";
import { GET_STORES_QUERY } from "../graphqls/queries/store";
import { getYesterdayDateString } from "../utils/analyticsDate";

function formatCurrency(value) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 2,
    }).format(Number(value ?? 0));
}

function formatPercent(value) {
    return `${Number(value ?? 0).toFixed(2)}%`;
}

function Admin() {
    const [date, setDate] = useState(getYesterdayDateString());
    const maxDate = getYesterdayDateString();

    const {
        data: platformData,
        loading: platformLoading,
        error: platformError,
    } = useQuery(GET_PLATFORM_ANALYTICS_QUERY, {
        variables: { date },
    });

    const {
        data: storeAnalyticsData,
        loading: storeAnalyticsLoading,
    } = useQuery(GET_STORE_ANALYTICS_QUERY, {
        variables: { date },
    });

    const {
        data: viewedData,
    } = useQuery(GET_TOP_VIEWED_PRODUCTS_ANALYTICS_QUERY, {
        variables: { date },
    });

    const {
        data: sellingData,
    } = useQuery(GET_TOP_SELLING_PRODUCTS_ANALYTICS_QUERY, {
        variables: { date },
    });

    const { data: productsData } = useQuery(GET_PRODUCTS_QUERY);
    const { data: storesData } = useQuery(GET_STORES_QUERY);

    const platform = platformData?.getPlatformAnalytics;
    const storeAnalytics = storeAnalyticsData?.getStoreAnalytics ?? [];
    const viewedProducts = viewedData?.getTopViewedProducts ?? [];
    const sellingProducts = sellingData?.getTopSellingProducts ?? [];
    const products = productsData?.getProducts ?? [];
    const stores = storesData?.getStores ?? [];

    const topSellingProduct = platform?.topSellingProductId
        ? products.find(
            (product) => String(product.id) === String(platform.topSellingProductId)
        )
        : null;

    const topStore = platform?.topStoreId
        ? stores.find(
            (store) => String(store.id) === String(platform.topStoreId)
        )
        : null;

    const hasPlatformData = Boolean(platform);

    return (
        <main className="bg-gray-50/60">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
                <div className="flex flex-col gap-6 border-b border-black/5 pb-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                            Administration
                        </p>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                            Admin Panel
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                            Platform yönetimi ve günlük performans analitiklerini tek ekrandan takip et.
                        </p>
                    </div>

                    <AnalyticsDatePicker
                        value={date}
                        onChange={setDate}
                        maxDate={maxDate}
                    />
                </div>

                {/* MANAGEMENT */}
                <section className="mt-8">
                    <div className="mb-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Yönetim
                        </p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight">
                            Sistem yönetimi
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <AdminLinkCard
                            to="/admin/stores"
                            title="Mağazalar"
                            description="Mağazaları ve yöneticilerini yönet."
                        />
                        <AdminLinkCard
                            to="/admin/users"
                            title="Kullanıcılar"
                            description="Kullanıcı hesaplarını görüntüle ve yönet."
                        />
                        <AdminLinkCard
                            to="/admin/brands"
                            title="Markalar"
                            description="Marka kayıtlarını yönet."
                        />
                        <AdminLinkCard
                            to="/admin/categories"
                            title="Kategoriler"
                            description="Ürün kategorilerini yönet."
                        />
                    </div>
                </section>

                {/* ANALYTICS */}
                <section className="mt-14">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                Analytics
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                                Platform performansı
                            </h2>
                        </div>
                        <div className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
                            <BarChart3 size={15} />
                            Günlük özet
                        </div>
                    </div>

                    {platformLoading ? (
                        <AnalyticsLoadingCards />
                    ) : platformError ? (
                        <AnalyticsError message="Platform analitiği yüklenemedi." />
                    ) : !hasPlatformData ? (
                        <AnalyticsEmpty message="Seçilen tarih için platform analitiği bulunmuyor." />
                    ) : (
                        <>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <AnalyticsMetricCard
                                    label="Toplam gelir"
                                    value={formatCurrency(platform.totalRevenue)}
                                    description="Seçilen günün toplam satın alma geliri"
                                />
                                <AnalyticsMetricCard
                                    label="Sipariş"
                                    value={platform.totalOrders}
                                    description="Tamamlanan benzersiz sipariş"
                                />
                                <AnalyticsMetricCard
                                    label="Aktif kullanıcı"
                                    value={platform.activeUsers}
                                    description="O gün analytics event oluşturan kullanıcı"
                                />
                                <AnalyticsMetricCard
                                    label="Dönüşüm"
                                    value={formatPercent(platform.systemConversionRate)}
                                    description="Satın alma yapan aktif kullanıcı oranı"
                                />
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <AnalyticsMetricCard
                                    label="Toplam kullanıcı"
                                    value={platform.totalUsers}
                                />
                                <AnalyticsMetricCard
                                    label="Yeni kullanıcı"
                                    value={platform.newUsers}
                                />
                                <AnalyticsMetricCard
                                    label="Toplam mağaza"
                                    value={platform.totalStores}
                                />
                                <AnalyticsMetricCard
                                    label="En çok satan"
                                    value={topSellingProduct?.name ?? (platform.topSellingProductId ? `Ürün #${platform.topSellingProductId}` : "—")}
                                />
                            </div>

                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                                                Günün lider ürünü
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {topSellingProduct?.name ?? (platform.topSellingProductId ? `Ürün #${platform.topSellingProductId}` : "Veri yok")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                            <StoreIcon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                                                En çok satış yapan mağaza
                                            </p>
                                            <p className="mt-1 font-semibold">
                                                {topStore?.name ?? (platform.topStoreId ? `Mağaza #${platform.topStoreId}` : "Veri yok")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>

                <section className="mt-10 grid gap-8 xl:grid-cols-2">
                    <AnalyticsProductTable
                        analytics={viewedProducts}
                        products={products}
                        title="En çok görüntülenen ürünler"
                    />
                    <AnalyticsProductTable
                        analytics={sellingProducts}
                        products={products}
                        title="En çok satan ürünler"
                    />
                </section>

                <section className="mt-8">
                    {storeAnalyticsLoading ? (
                        <AnalyticsLoadingTable />
                    ) : (
                        <AnalyticsStoreTable
                            analytics={storeAnalytics}
                            stores={stores}
                        />
                    )}
                </section>
            </div>
        </main>
    );
}

function AdminLinkCard({ to, title, description }) {
    return (
        <Link
            to={to}
            className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md"
        >
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-5 text-gray-500">
                {description}
            </p>
            <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 transition group-hover:text-black">
                Yönet →
            </span>
        </Link>
    );
}

function AnalyticsLoadingCards() {
    return (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-2xl border border-black/5 bg-white" />
            ))}
        </div>
    );
}

function AnalyticsLoadingTable() {
    return (
        <div className="h-72 animate-pulse rounded-2xl border border-black/5 bg-white" />
    );
}

function AnalyticsEmpty({ message }) {
    return (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center text-sm text-gray-500">
            {message}
        </div>
    );
}

function AnalyticsError({ message }) {
    return (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-600">
            {message}
        </div>
    );
}

export default Admin;
