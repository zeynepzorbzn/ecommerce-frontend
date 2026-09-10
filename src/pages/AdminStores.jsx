import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import { GET_STORES_QUERY } from "../graphqls/queries/store";
import { GET_USERS_QUERY } from "../graphqls/queries/user";
import { CREATE_STORE_MUTATION } from "../graphqls/mutations/store";
import { showError, showSuccess } from "../utils/toast";

function AdminStores() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        ownerId: "",
        city: "",
        district: "",
        street: "",
        postalCode: ""
    });

    const {
        data,
        loading,
        error,
        refetch
    } = useQuery(GET_STORES_QUERY);

    const {
        data: userData,
        loading: usersLoading
    } = useQuery(GET_USERS_QUERY);

    const [createStore, { loading: creating }] =
        useMutation(CREATE_STORE_MUTATION);

    const stores = data?.getStores ?? [];
    const users = userData?.users ?? [];

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await createStore({
                variables: {
                    input: {
                        name: form.name,
                        email: form.email,
                        phoneNumber: form.phoneNumber,
                        ownerId: form.ownerId,
                        city: form.city,
                        district: form.district,
                        street: form.street,
                        postalCode: form.postalCode
                    }
                }
            });

            showSuccess("Mağaza başarıyla oluşturuldu.");

            setForm({
                name: "",
                email: "",
                phoneNumber: "",
                ownerId: "",
                city: "",
                district: "",
                street: "",
                postalCode: ""
            });

            await refetch();

        } catch (error) {
            console.error("CREATE STORE ERROR:", error);

            showError(
                error,
                "Mağaza oluşturulamadı."
            );
        }
    };

    if (loading) {
        return <main className="p-20">Yükleniyor...</main>;
    }

    if (error) {
        return (
            <main className="p-20 text-red-500">
                Mağazalar yüklenemedi.
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <Link to="/admin" className="text-sm text-gray-500">
                ← Admin Panel
            </Link>

            <div className="mt-6 flex items-end justify-between gap-6">
                <div>
                    <p className="text-sm uppercase tracking-widest text-gray-400">
                        Administration
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold">
                        Mağazalar
                    </h1>
                </div>
            </div>

            {/* CREATE STORE */}

            <section className="mt-10 max-w-3xl border p-6 md:p-8">

                <h2 className="text-xl font-medium">
                    Yeni Mağaza Ekle
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Mağaza yöneticisini seçerek mağaza bilgilerini oluştur.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 grid gap-4 md:grid-cols-2"
                >

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Mağaza adı"
                        className="border p-4"
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Mağaza e-postası"
                        className="border p-4"
                        required
                    />

                    <input
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="Telefon"
                        className="border p-4"
                        required
                    />

                    <select
                        name="ownerId"
                        value={form.ownerId}
                        onChange={handleChange}
                        className="border p-4"
                        required
                        disabled={usersLoading}
                    >
                        <option value="">
                            {usersLoading
                                ? "Kullanıcılar yükleniyor..."
                                : "Mağaza yöneticisi seç"}
                        </option>

                        {users.map((user) => (
                            <option
                                key={user.id}
                                value={user.id}
                            >
                                {user.firstName} {user.lastName} — {user.email}
                            </option>
                        ))}
                    </select>

                    <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Şehir"
                        className="border p-4"
                    />

                    <input
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        placeholder="İlçe"
                        className="border p-4"
                        required
                    />

                    <input
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        placeholder="Sokak / Cadde"
                        className="border p-4"
                        required
                    />

                    <input
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        placeholder="Posta kodu"
                        className="border p-4"
                        required
                    />

                    <button
                        type="submit"
                        disabled={creating || usersLoading}
                        className="md:col-span-2 bg-black p-4 text-white disabled:opacity-50"
                    >
                        {creating
                            ? "Oluşturuluyor..."
                            : "Mağazayı Oluştur"}
                    </button>

                </form>
            </section>

            {/* STORE LIST */}

            <section className="mt-14">

                <h2 className="text-xl font-medium">
                    Mevcut Mağazalar
                </h2>

                {stores.length === 0 ? (
                    <div className="mt-5 border p-8 text-center text-gray-500">
                        Henüz mağaza bulunmuyor.
                    </div>
                ) : (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">

                        {stores.map((store) => (
                            <div
                                key={store.id}
                                className="border p-6"
                            >
                                <h3 className="text-xl font-medium">
                                    {store.name}
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    {store.email}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {store.phoneNumber}
                                </p>

                                <p className="mt-3 text-sm">
                                    Sahibi: {store.ownerName}
                                </p>

                                {(store.city || store.district || store.street) && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        {[store.street, store.district, store.city]
                                            .filter(Boolean)
                                            .join(", ")}
                                        {store.postalCode
                                            ? ` — ${store.postalCode}`
                                            : ""}
                                    </p>
                                )}
                            </div>
                        ))}

                    </div>
                )}

            </section>
        </main>
    );
}

export default AdminStores;
