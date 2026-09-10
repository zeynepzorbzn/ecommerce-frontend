import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

import AnalyticsDatePicker from "../../components/analytics/AnalyticsDatePicker";
import AnalyticsMetricCard from "../../components/analytics/AnalyticsMetricCard";
import AnalyticsProductTable from "../../components/analytics/AnalyticsProductTable";
import {
    GET_MY_PRODUCT_ANALYTICS_QUERY,
    GET_MY_STORE_ANALYTICS_QUERY,
} from "../../graphqls/queries/analytics";
import { GET_MY_STORE_PRODUCTS_QUERY } from "../../graphqls/queries/product";
import { GET_MY_STORE_QUERY } from "../../graphqls/queries/store";
import { getYesterdayDateString } from "../../utils/analyticsDate";

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

function StoreDashboard() {
    const [date, setDate] = useState(getYesterdayDateString());
    const maxDate = getYesterdayDateString();

    const {
        data: storeData,
        loading: storeLoading,
        error: storeError,
    } = useQuery(GET_MY_STORE_QUERY);

    const {
        data: analyticsData,
        loading: analyticsLoading,
        error: analyticsError,
    } = useQuery(GET_MY_STORE_ANALYTICS_QUERY, {
        variables: { date },
    });

    const {
        data: productAnalyticsData,
        loading: productAnalyticsLoading,
    } = useQuery(GET_MY_PRODUCT_ANALYTICS_QUERY, {
        variables: { date },
    });

    const { data: productsData } = useQuery(GET_MY_STORE_PRODUCTS_QUERY);

    const store = storeData?.getMyStore;
    const analytics = analyticsData?.getMyStoreAnalytics;
    const productAnalytics = productAnalyticsData?.getMyProductAnalytics ?? [];
    const products = productsData?.getMyStoreProducts ?? [];

    if (storeLoading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p className="text-sm text-gray-500">Mağaza yükleniyor...</p>
            </main>
        );
    }

    if (storeError || !store) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Store Manager
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                    Mağaza Yönetimi
                </h1>
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                    Mağaza bilgileri yüklenemedi veya hesabınıza bağlı bir mağaza bulunamadı.
                </div>
            </main>
        );
    }

    return (
        <main className="bg-gray-50/60">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
                <div className="flex flex-col gap-6 border-b border-black/5 pb-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                            Store Manager
                        </p>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                            {store.name}
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                            Mağazanızın günlük ürün, satış ve müşteri performansını takip edin.
                        </p>
                    </div>

                    <AnalyticsDatePicker
                        value={date}
                        onChange={setDate}
                        maxDate={maxDate}
                    />
                </div>

                {/* MANAGEMENT */}
                <section className="mt-8 grid gap-4 md:grid-cols-3">
                    <DashboardLink
                        to="/store"
                        title="Mağazam"
                        description="Mağaza bilgilerini görüntüle."
                    />
                    <DashboardLink
                        to="/store/products"
                        title="Ürünlerim"
                        description="Mağazandaki ürünleri yönet."
                    />
                    <DashboardLink
                        to="/store/products/new"
                        title="Yeni Ürün"
                        description="Yeni ürün oluştur."
                    />
                </section>

                {/* ANALYTICS */}
                <section className="mt-14">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                Analytics
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                                Mağaza performansı
                            </h2>
                        </div>
                        <div className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
                            <BarChart3 size={15} />
                            Günlük özet
                        </div>
                    </div>

                    {analyticsLoading ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="h-32 animate-pulse rounded-2xl border border-black/5 bg-white" />
                            ))}
                        </div>
                    ) : analyticsError ? (
                        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                            Seçilen tarih için mağaza analitiği yüklenemedi.
                        </div>
                    ) : !analytics ? (
                        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center text-sm text-gray-500">
                            Seçilen tarih için henüz mağaza analitiği bulunmuyor.
                        </div>
                    ) : (
                        <>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <AnalyticsMetricCard
                                    label="Toplam gelir"
                                    value={formatCurrency(analytics.totalRevenue)}
                                    description="Seçilen günün satış geliri"
                                />
                                <AnalyticsMetricCard
                                    label="Sipariş"
                                    value={analytics.totalOrders}
                                    description="Tamamlanan benzersiz sipariş"
                                />
                                <AnalyticsMetricCard
                                    label="Satılan ürün"
                                    value={analytics.totalProductsSold}
                                    description="Toplam satılan ürün adedi"
                                />
                                <AnalyticsMetricCard
                                    label="Görüntülenme"
                                    value={analytics.totalViews}
                                    description="Ürün görüntülenme sayısı"
                                />
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <AnalyticsMetricCard
                                    label="Ort. sipariş değeri"
                                    value={formatCurrency(analytics.avgOrderValue)}
                                />
                                <AnalyticsMetricCard
                                    label="Dönüşüm"
                                    value={formatPercent(analytics.conversionRate)}
                                    description="Benzersiz görüntüleyenlerden siparişe dönüşüm"
                                />
                                <AnalyticsMetricCard
                                    label="Returning customer"
                                    value={formatPercent(analytics.returningCustomerRate)}
                                    description="Daha önce bu mağazadan alışveriş yapan müşteriler"
                                />
                            </div>
                        </>
                    )}
                </section>

                <section className="mt-10">
                    {productAnalyticsLoading ? (
                        <div className="h-72 animate-pulse rounded-2xl border border-black/5 bg-white" />
                    ) : (
                        <AnalyticsProductTable
                            analytics={productAnalytics}
                            products={products}
                            title="Ürün performansı"
                        />
                    )}
                </section>
            </div>
        </main>
    );
}

function DashboardLink({ to, title, description }) {
    return (
        <Link
            to={to}
            className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md"
        >
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-5 text-gray-500">
                {description}
            </p>
            <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 transition group-hover:text-black">
                Aç →
            </span>
        </Link>
    );
}

export default StoreDashboard;
