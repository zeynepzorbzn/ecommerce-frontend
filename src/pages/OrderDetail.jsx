import { useQuery } from "@apollo/client/react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_MY_ORDERS_QUERY } from "../graphqls/queries/order";

function OrderDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data,
        loading,
        error,
    } = useQuery(GET_MY_ORDERS_QUERY);

    if (loading) {
        return (
            <main className="mx-auto max-w-5xl px-6 py-20">
                <p>Sipariş yükleniyor...</p>
            </main>
        );
    }

    if (error) {

        console.error("ORDER DETAIL ERROR:", error);

        return (
            <main className="mx-auto max-w-5xl px-6 py-20">

                <h1 className="text-3xl font-semibold">
                    Sipariş Detayı
                </h1>

                <p className="mt-6 text-red-500">
                    Sipariş bilgileri yüklenirken bir hata oluştu.
                </p>

            </main>
        );
    }

    const orders = data?.getMyOrders || [];

    const order = orders.find(
        (item) => String(item.id) === String(id)
    );

    if (!order) {
        return (
            <main className="mx-auto max-w-5xl px-6 py-20">

                <h1 className="text-3xl font-semibold">
                    Sipariş Bulunamadı
                </h1>

                <p className="mt-6 text-gray-500">
                    Bu sipariş bulunamadı veya size ait değil.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="mt-6 bg-black px-6 py-3 text-white"
                >
                    Siparişlerime Dön
                </button>

            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-16">

            {/* HEADER */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-semibold">
                        Sipariş Detayı
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Sipariş No: {order.code}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="border px-5 py-3 text-sm"
                >
                    Siparişlerim
                </button>

            </div>


            {/* ORDER INFO */}

            <section className="mt-10 border p-6">

                <div className="grid gap-6 md:grid-cols-3">

                    <div>

                        <p className="text-sm text-gray-500">
                            Sipariş Numarası
                        </p>

                        <p className="mt-1 font-medium">
                            {order.code}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Ürün Sayısı
                        </p>

                        <p className="mt-1 font-medium">
                            {order.productCount}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Toplam
                        </p>

                        <p className="mt-1 font-semibold">
                            {order.totalPrice} TL
                        </p>

                    </div>

                </div>

            </section>


            {/* PRODUCTS */}

            <section className="mt-10">

                <h2 className="text-xl font-medium">
                    Sipariş Ürünleri
                </h2>

                <div className="mt-5 space-y-4">

                    {order.orderItems?.map((item) => (

                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b pb-5"
                        >

                            <div>

                                <p className="font-medium">
                                    {item.productName}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {item.color} / {item.size}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Adet: {item.quantity}
                                </p>

                            </div>

                            <div className="text-right">

                                <p className="font-medium">
                                    {item.unitPrice} TL
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Birim fiyat
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* TOTAL */}

            <section className="mt-10 flex justify-end">

                <div className="w-full border p-6 md:w-80">

                    <div className="flex justify-between">

                        <span className="text-gray-500">
                            Ürün sayısı
                        </span>

                        <span>
                            {order.productCount}
                        </span>

                    </div>

                    <div className="mt-4 flex justify-between text-lg font-semibold">

                        <span>
                            Toplam
                        </span>

                        <span>
                            {order.totalPrice} TL
                        </span>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default OrderDetail;