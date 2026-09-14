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

function AnalyticsStoreTable({ analytics, stores = [] }) {
    const storeMap = new Map(
        stores.map((store) => [String(store.id), store])
    );

    return (
        <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
            <div className="border-b border-black/5 px-5 py-5 sm:px-6">
                <h2 className="text-lg font-semibold tracking-tight">
                    Mağaza performansı
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Mağazaların günlük satış ve müşteri performansını karşılaştır.
                </p>
            </div>

            {analytics.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-gray-500">
                    Seçilen tarih için mağaza analitiği bulunmuyor.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left text-sm">
                        <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.14em] text-gray-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Mağaza</th>
                                <th className="px-5 py-3 font-semibold">Görüntülenme</th>
                                <th className="px-5 py-3 font-semibold">Satış</th>
                                <th className="px-5 py-3 font-semibold">Sipariş</th>
                                <th className="px-5 py-3 font-semibold">Gelir</th>
                                <th className="px-5 py-3 font-semibold">Ort. Sipariş</th>
                                <th className="px-5 py-3 font-semibold">Returning</th>
                                <th className="px-5 py-3 font-semibold">Dönüşüm</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {analytics.map((item) => {
                                const store = storeMap.get(String(item.storeId));

                                return (
                                    <tr key={`${item.storeId}-${item.date}`} className="transition hover:bg-gray-50/70">
                                        <td className="px-5 py-4 font-medium">
                                            {store?.name ?? `Mağaza #${item.storeId}`}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {item.totalViews}
                                        </td>
                                        <td className="px-5 py-4 font-medium">
                                            {item.totalProductsSold}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {item.totalOrders}
                                        </td>
                                        <td className="px-5 py-4 font-medium">
                                            {formatCurrency(item.totalRevenue)}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatCurrency(item.avgOrderValue)}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatPercent(item.returningCustomerRate)}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatPercent(item.conversionRate)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default AnalyticsStoreTable;
