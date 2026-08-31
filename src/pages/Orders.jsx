import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { GET_MY_ORDERS_QUERY } from "../graphqls/queries/order";

function Orders() {

    const navigate = useNavigate();

    const {
        data,
        loading,
        error,
    } = useQuery(GET_MY_ORDERS_QUERY);

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Siparişler yükleniyor...</p>
            </main>
        );
    }

    if (error) {

        console.error("ORDERS ERROR:", error);

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">

                <h1 className="text-3xl font-semibold">
                    Siparişlerim
                </h1>

                <p className="mt-6 text-red-500">
                    Siparişler yüklenirken bir hata oluştu.
                </p>

            </main>
        );
    }

    const orders = data?.getMyOrders || [];

    return (
        <main className="mx-auto max-w-7xl px-6 py-16">

            <h1 className="text-3xl font-semibold">
                Siparişlerim
            </h1>

            <p className="mt-2 text-gray-500">
                Geçmiş siparişlerinizi buradan görüntüleyebilirsiniz.
            </p>


            {orders.length === 0 ? (

                <div className="mt-10 border p-10 text-center">

                    <p className="text-gray-500">
                        Henüz bir siparişiniz bulunmuyor.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="mt-6 bg-black px-6 py-3 text-white"
                    >
                        Alışverişe Başla
                    </button>

                </div>

            ) : (

                <div className="mt-10 space-y-5">

                    {orders.map((order) => (

                        <button
                            key={order.id}
                            type="button"
                            onClick={() =>
                                navigate(`/orders/${order.id}`)
                            }
                            className="w-full border p-6 text-left transition hover:border-black"
                        >

                            <div className="flex flex-col justify-between gap-6 md:flex-row">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Sipariş No
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {order.code}
                                    </p>

                                    <p className="mt-3 text-sm text-gray-500">
                                        {order.productCount} ürün
                                    </p>

                                </div>


                                <div className="text-left md:text-right">

                                    <p className="text-sm text-gray-500">
                                        Toplam
                                    </p>

                                    <p className="mt-1 text-lg font-semibold">
                                        {order.totalPrice} TL
                                    </p>

                                    <p className="mt-3 text-sm underline">
                                        Detayları Gör
                                    </p>

                                </div>

                            </div>

                        </button>

                    ))}

                </div>

            )}

        </main>
    );
}

export default Orders;