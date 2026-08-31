import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_MY_PAYMENT_METHODS_QUERY } from "../graphqls/queries/paymentMethod";
import { CREATE_PAYMENT_METHOD_MUTATION } from "../graphqls/mutations/paymentMethod";

function PaymentPage() {
    const {
        data,
        loading,
        error,
        refetch,
    } = useQuery(GET_MY_PAYMENT_METHODS_QUERY);

    const [createPaymentMethod] = useMutation(
        CREATE_PAYMENT_METHOD_MUTATION
    );

    const [showForm, setShowForm] = useState(false);

    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expireMonth, setExpireMonth] = useState("");
    const [expireYear, setExpireYear] = useState("");
    const [isDefault, setIsDefault] = useState(false);

    const [saving, setSaving] = useState(false);

    const paymentMethods = data?.getMyPaymentMethods || [];

    const formatCardNumber = (value) => {
        const numbers = value
            .replace(/\D/g, "")
            .slice(0, 16);

        return numbers.replace(/(.{4})/g, "$1 ").trim();
    };

    const handleCardNumberChange = (event) => {
        setCardNumber(
            formatCardNumber(event.target.value)
        );
    };

    const resetForm = () => {
        setCardNumber("");
        setCardHolder("");
        setExpireMonth("");
        setExpireYear("");
        setIsDefault(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const cleanCardNumber =
            cardNumber.replace(/\s/g, "");

        if (cleanCardNumber.length !== 16) {
            alert("Kart numarası 16 haneli olmalıdır.");
            return;
        }

        if (!cardHolder.trim()) {
            alert("Kart sahibi bilgisi girilmelidir.");
            return;
        }

        const month = Number(expireMonth);
        const year = Number(expireYear);

        if (
            !month ||
            month < 1 ||
            month > 12
        ) {
            alert("Geçerli bir son kullanma ayı girin.");
            return;
        }

        if (!year) {
            alert("Geçerli bir son kullanma yılı girin.");
            return;
        }

        try {
            setSaving(true);

            await createPaymentMethod({
                variables: {
                    input: {
                        cardNumber: cleanCardNumber,
                        cardHolder: cardHolder.trim(),
                        expireMonth: month,
                        expireYear: year,
                        isDefault,
                    },
                },
            });

            await refetch();

            resetForm();
            setShowForm(false);

            alert("Ödeme yöntemi başarıyla eklendi.");
        } catch (error) {
            console.error(
                "CREATE PAYMENT METHOD ERROR:",
                error
            );

            alert(
                error?.message ||
                "Ödeme yöntemi eklenirken bir hata oluştu."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="mx-auto max-w-5xl px-6 py-20">
                <p>Ödeme yöntemleri yükleniyor...</p>
            </main>
        );
    }

    if (error) {
        console.error(
            "GET PAYMENT METHODS ERROR:",
            error
        );

        return (
            <main className="mx-auto max-w-5xl px-6 py-20">
                <h1 className="text-3xl font-semibold">
                    Ödeme Yöntemleri
                </h1>

                <p className="mt-6 text-red-500">
                    Ödeme yöntemleri yüklenirken bir hata oluştu.
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-16">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">
                        Ödeme Yöntemleri
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Kayıtlı kartlarınızı yönetin.
                    </p>
                </div>

                {!showForm && (
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="bg-black px-6 py-3 text-sm text-white"
                    >
                        Yeni Kart Ekle
                    </button>
                )}
            </div>

            {showForm && (
                <section className="mt-10 border p-6">

                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-medium">
                            Yeni Ödeme Yöntemi
                        </h2>

                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setShowForm(false);
                            }}
                            className="text-sm text-gray-500"
                        >
                            İptal
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Kart Numarası
                            </label>

                            <input
                                type="text"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="1234 5678 9012 3456"
                                inputMode="numeric"
                                className="w-full border px-4 py-3 outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Kart Sahibi
                            </label>

                            <input
                                type="text"
                                value={cardHolder}
                                onChange={(event) =>
                                    setCardHolder(event.target.value)
                                }
                                placeholder="AD SOYAD"
                                className="w-full border px-4 py-3 uppercase outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Son Kullanma Ayı
                                </label>

                                <select
                                    value={expireMonth}
                                    onChange={(event) =>
                                        setExpireMonth(event.target.value)
                                    }
                                    className="w-full border px-4 py-3 outline-none"
                                >
                                    <option value="">
                                        Ay
                                    </option>

                                    {Array.from(
                                        { length: 12 },
                                        (_, index) => index + 1
                                    ).map((month) => (
                                        <option
                                            key={month}
                                            value={month}
                                        >
                                            {String(month).padStart(2, "0")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Son Kullanma Yılı
                                </label>

                                <input
                                    type="number"
                                    value={expireYear}
                                    onChange={(event) =>
                                        setExpireYear(event.target.value)
                                    }
                                    placeholder="2028"
                                    min="2026"
                                    className="w-full border px-4 py-3 outline-none"
                                />
                            </div>

                        </div>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={isDefault}
                                onChange={(event) =>
                                    setIsDefault(event.target.checked)
                                }
                            />

                            <span className="text-sm">
                                Varsayılan ödeme yöntemi yap
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-black px-6 py-4 text-white disabled:opacity-50"
                        >
                            {saving
                                ? "Kaydediliyor..."
                                : "Kartı Kaydet"}
                        </button>

                    </form>
                </section>
            )}

            <section className="mt-10">

                {paymentMethods.length === 0 ? (
                    <div className="border p-10 text-center">
                        <p className="text-gray-500">
                            Henüz kayıtlı ödeme yönteminiz bulunmuyor.
                        </p>

                        {!showForm && (
                            <button
                                type="button"
                                onClick={() => setShowForm(true)}
                                className="mt-5 bg-black px-6 py-3 text-sm text-white"
                            >
                                İlk Kartınızı Ekleyin
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">

                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className="border p-6"
                            >

                                <div className="flex items-start justify-between">

                                    <div>
                                        <p className="text-lg font-medium">
                                            {method.maskedCardNumber}
                                        </p>

                                        <p className="mt-2 text-sm text-gray-600">
                                            {method.cardHolder}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Son kullanma:{" "}
                                            {String(method.expireMonth).padStart(2, "0")}
                                            /
                                            {method.expireYear}
                                        </p>
                                    </div>

                                    {method.isDefault && (
                                        <span className="border px-3 py-1 text-xs">
                                            Varsayılan
                                        </span>
                                    )}

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default PaymentPage;