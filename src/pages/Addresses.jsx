import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { GET_MY_ADDRESSES_QUERY } from "../graphqls/queries/address";
import { CREATE_ADDRESS_MUTATION } from "../graphqls/mutations/address";

function Addresses() {
    const { data, loading, refetch } = useQuery(GET_MY_ADDRESSES_QUERY);

    const [createAddress] = useMutation(CREATE_ADDRESS_MUTATION);

    const [form, setForm] = useState({
        name: "",
        city: "",
        district: "",
        street: "",
        postalCode: "",
        billing: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createAddress({
                variables: {
                    input: form,
                },
            });

            setForm({
                name: "",
                city: "",
                district: "",
                street: "",
                postalCode: "",
                billing: false,
            });

            await refetch();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="mx-auto max-w-6xl px-6 py-16">

            <Link
                to="/myAccount"
                className="text-sm text-gray-500 hover:text-black"
            >
                ← Hesabım
            </Link>

            <div className="mt-8">
                <p className="text-sm uppercase tracking-widest text-gray-400">
                    Hesabım
                </p>

                <h1 className="mt-2 text-4xl font-semibold">
                    Adreslerim
                </h1>

                <p className="mt-4 text-gray-500">
                    Teslimat ve fatura adreslerini buradan yönetebilirsin.
                </p>
            </div>

            <section className="mt-10">
                <h2 className="text-xl font-medium">
                    Kayıtlı Adreslerim
                </h2>

                {loading ? (
                    <p className="mt-6 text-gray-500">
                        Adresler yükleniyor...
                    </p>
                ) : data?.getMyAddresses?.length === 0 ? (
                    <p className="mt-6 text-gray-500">
                        Henüz kayıtlı bir adresin yok.
                    </p>
                ) : (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {data?.getMyAddresses?.map((address) => (
                            <div
                                key={address.id}
                                className="border border-gray-200 p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <h3 className="font-medium">
                                        {address.name}
                                    </h3>

                                    {address.billing && (
                                        <span className="text-xs uppercase tracking-wide text-gray-400">
                                            Fatura
                                        </span>
                                    )}
                                </div>

                                <p className="mt-4 text-sm leading-6 text-gray-600">
                                    {address.street}
                                    <br />
                                    {address.district} / {address.city}
                                    <br />
                                    {address.postalCode}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="mt-12 border border-gray-200 p-7">
                <h2 className="text-xl font-medium">
                    Yeni Adres Ekle
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 grid gap-5 md:grid-cols-2"
                >
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Adres adı (Ev, İş vb.)"
                        required
                        className="border border-gray-300 px-4 py-3 text-sm"
                    />

                    <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Şehir"
                        required
                        className="border border-gray-300 px-4 py-3 text-sm"
                    />

                    <input
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        placeholder="İlçe"
                        required
                        className="border border-gray-300 px-4 py-3 text-sm"
                    />

                    <input
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        placeholder="Posta kodu"
                        required
                        className="border border-gray-300 px-4 py-3 text-sm"
                    />

                    <textarea
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        placeholder="Açık adres"
                        required
                        rows={4}
                        className="border border-gray-300 px-4 py-3 text-sm md:col-span-2"
                    />

                    <label className="flex items-center gap-3 text-sm text-gray-600 md:col-span-2">
                        <input
                            type="checkbox"
                            name="billing"
                            checked={form.billing}
                            onChange={handleChange}
                        />

                        Fatura adresi olarak kullan
                    </label>

                    <button
                        type="submit"
                        className="w-fit border border-black px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
                    >
                        Adres Ekle
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Addresses;