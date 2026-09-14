import { Link } from "react-router-dom";

function formatCurrency(value) {
    const number = Number(value ?? 0);

    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 2,
    }).format(number);
}

function formatPercent(value) {
    return `${Number(value ?? 0).toFixed(2)}%`;
}

function AnalyticsProductTable({ analytics, products = [], title = "Ürün performansı" }) {
    const productMap = new Map(
        products.map((product) => [String(product.id), product])
    );

    return (
        <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
            <div className="border-b border-black/5 px-5 py-5 sm:px-6">
                <h2 className="text-lg font-semibold tracking-tight">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Ürün bazında görüntülenme, sepet ve satış performansı.
                </p>
            </div>

            {analytics.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-gray-500">
                    Seçilen tarih için ürün analitiği bulunmuyor.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left text-sm">
                        <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.14em] text-gray-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Ürün</th>
                                <th className="px-5 py-3 font-semibold">Görüntülenme</th>
                                <th className="px-5 py-3 font-semibold">Sepet</th>
                                <th className="px-5 py-3 font-semibold">Satış</th>
                                <th className="px-5 py-3 font-semibold">Gelir</th>
                                <th className="px-5 py-3 font-semibold">Ort. fiyat</th>
                                <th className="px-5 py-3 font-semibold">Stok etkisi</th>
                                <th className="px-5 py-3 font-semibold">Dönüşüm</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {analytics.map((item) => {
                                const product = productMap.get(String(item.productId));

                                return (
                                    <tr key={`${item.productId}-${item.date}`} className="transition hover:bg-gray-50/70">
                                        <td className="px-5 py-4">
                                            {product ? (
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="font-medium text-gray-900 hover:underline"
                                                >
                                                    {product.name}
                                                </Link>
                                            ) : (
                                                <span className="font-medium text-gray-900">
                                                    Ürün #{item.productId}
                                                </span>
                                            )}
                                            {product?.storeName && (
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {product.storeName}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {item.viewCount}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {item.cartAddCount}
                                        </td>
                                        <td className="px-5 py-4 font-medium">
                                            {item.purchaseCount}
                                        </td>
                                        <td className="px-5 py-4 font-medium">
                                            {formatCurrency(item.revenue)}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatCurrency(item.avgPrice)}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {Number(item.stockImpactScore ?? 0).toFixed(2)}
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

export default AnalyticsProductTable;
