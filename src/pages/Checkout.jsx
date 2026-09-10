import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { GET_CART_QUERY } from "../graphqls/queries/cart";
import { GET_MY_ADDRESSES_QUERY } from "../graphqls/queries/address";
import { GET_MY_PAYMENT_METHODS_QUERY } from "../graphqls/queries/paymentMethod";
import { CREATE_ORDER_MUTATION } from "../graphqls/mutations/order";
import AddressForm from "../components/checkout/AddressForm";
import { showError } from "../utils/toast";

function Checkout() {

    const navigate = useNavigate();

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
    const [ordering, setOrdering] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const {
        data: cartData,
        loading: cartLoading,
    } = useQuery(GET_CART_QUERY);

    const {
        data: addressData,
        loading: addressLoading,
    } = useQuery(GET_MY_ADDRESSES_QUERY);

    const {
        data: paymentData,
        loading: paymentLoading,
    } = useQuery(GET_MY_PAYMENT_METHODS_QUERY);

    const [createOrder] = useMutation(CREATE_ORDER_MUTATION);

    const cart = cartData?.getMyCart;
    const addresses = addressData?.getMyAddresses || [];
    const paymentMethods = paymentData?.getMyPaymentMethods || [];

    const handleCreateOrder = async () => {

        if (!cart) {
            showError(null, "Sepet bulunamadı.");
            return;
        }

        if (!selectedAddressId) {
            showError(null, "Lütfen teslimat adresi seçin.");
            return;
        }

        if (!selectedPaymentMethodId) {
            showError(null, "Lütfen ödeme yöntemi seçin.");
            return;
        }

        try {

            setOrdering(true);

            const result = await createOrder({
                variables: {
                    input: {
                        cartId: cart.id,
                        addressId: selectedAddressId,
                        paymentMethodId: selectedPaymentMethodId,
                    },
                },
            });

            const order = result.data?.createOrder;

            if (!order) {
                throw new Error("Sipariş oluşturulamadı.");
            }

            navigate(`/orders/${order.id}`);

        } catch (error) {

            console.error("CREATE ORDER ERROR:", error);

            showError(
                error,
                "Sipariş oluşturulurken bir hata oluştu."
            );

        } finally {

            setOrdering(false);
        }
    };

    if (cartLoading || addressLoading || paymentLoading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">
                <p>Ödeme bilgileri yükleniyor...</p>
            </main>
        );
    }

    if (!cart || !cart.items?.length) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20">

                <h1 className="text-3xl font-semibold">
                    Sipariş
                </h1>

                <p className="mt-6 text-gray-500">
                    Sepetiniz boş.
                </p>

                <button
                    onClick={() => navigate("/cart")}
                    className="mt-6 bg-black px-6 py-3 text-white"
                >
                    Sepete Git
                </button>

            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <h1 className="text-3xl font-semibold">
                Siparişi Tamamla
            </h1>

            <div className="mt-10 grid gap-12 md:grid-cols-2">

                {/* SOL */}
                <div className="space-y-10">

                    {/* ADDRESS */}
                    <section>

                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-medium">
                                Teslimat Adresi
                            </h2>

                            <button
                                type="button"
                                onClick={() => setShowAddressForm(true)}
                                className="text-sm underline"
                            >
                                Adres Ekle
                            </button>
                        </div>

                        <div className="mt-5 space-y-3">

                            {addresses.length === 0 ? (

                                <p className="text-gray-500">
                                    Kayıtlı adresiniz bulunmuyor.
                                </p>

                            ) : (

                                addresses.map((address) => (

                                    <button
                                        key={address.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedAddressId(address.id)
                                        }
                                        className={`w-full border p-5 text-left ${
                                            selectedAddressId === address.id
                                                ? "border-black"
                                                : "border-gray-200"
                                        }`}
                                    >

                                        <div className="flex justify-between">

                                            <span className="font-medium">
                                                {address.name}
                                            </span>

                                            {address.billing && (
                                                <span className="text-xs">
                                                    Fatura
                                                </span>
                                            )}

                                        </div>

                                        <p className="mt-2 text-sm text-gray-600">
                                            {address.street}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            {address.district} / {address.city}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            {address.postalCode}
                                        </p>

                                    </button>

                                ))

                            )}

                        </div>

                        {showAddressForm && (
                            <AddressForm
                                onCreated={(address) => {
                                    setShowAddressForm(false);
                                    setSelectedAddressId(address.id);
                                }}
                                onCancel={() => setShowAddressForm(false)}
                            />
                        )}

                    </section>


                    {/* PAYMENT */}
                    <section>

                        <div className="flex items-center justify-between">

                            <h2 className="text-xl font-medium">
                                Ödeme Yöntemi
                            </h2>

                            <Link
                                to="/payment-methods"
                                className="text-sm underline"
                            >
                                Kart Ekle
                            </Link>

                        </div>

                        <div className="mt-5 space-y-3">

                            {paymentMethods.length === 0 ? (

                                <p className="text-gray-500">
                                    Kayıtlı ödeme yönteminiz bulunmuyor.
                                </p>

                            ) : (

                                paymentMethods.map((method) => (

                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedPaymentMethodId(
                                                method.id
                                            )
                                        }
                                        className={`w-full border p-5 text-left ${
                                            selectedPaymentMethodId === method.id
                                                ? "border-black"
                                                : "border-gray-200"
                                        }`}
                                    >

                                        <div className="flex justify-between">

                                            <span className="font-medium">
                                                {method.provider || "Kart"}
                                            </span>

                                            {method.isDefault && (
                                                <span className="text-xs">
                                                    Varsayılan
                                                </span>
                                            )}

                                        </div>

                                        <p className="mt-2 text-sm text-gray-600">
                                            {method.maskedCardNumber}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {method.cardHolder}
                                        </p>

                                    </button>

                                ))

                            )}

                        </div>

                    </section>

                </div>


                {/* SAĞ */}
                <div>

                    <div className="border p-6">

                        <h2 className="text-xl font-medium">
                            Sipariş Özeti
                        </h2>

                        <div className="mt-6 space-y-5">

                            {cart.items.map((item) => (

                                <div
                                    key={item.id}
                                    className="flex justify-between gap-4"
                                >

                                    <div>

                                        <p className="font-medium">
                                            {item.productName}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {item.color} / {item.size}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Adet: {item.quantity}
                                        </p>

                                    </div>

                                    <p className="font-medium">
                                        {item.totalPrice} TL
                                    </p>

                                </div>

                            ))}

                        </div>

                        <div className="mt-6 border-t pt-6">

                            <div className="flex justify-between text-lg font-semibold">

                                <span>
                                    Toplam
                                </span>

                                <span>
                                    {cart.totalPrice} TL
                                </span>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={handleCreateOrder}
                            disabled={ordering}
                            className="mt-6 w-full bg-black px-6 py-4 text-white disabled:opacity-50"
                        >
                            {ordering
                                ? "Sipariş oluşturuluyor..."
                                : "Siparişi Tamamla"}
                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default Checkout;