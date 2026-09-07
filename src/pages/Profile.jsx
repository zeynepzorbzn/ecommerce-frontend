import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import { GET_ME_QUERY } from "../graphqls/queries/user";

function Profile() {
    const { data, loading, error } = useQuery(GET_ME_QUERY);

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-6 py-20">
                <p className="text-gray-500">Profil bilgileri yükleniyor...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-auto max-w-6xl px-6 py-20">
                <p className="text-red-500">
                    Profil bilgileri yüklenirken bir hata oluştu.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    {error.message}
                </p>
            </main>
        );
    }

    const user = data?.me;

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
                    Profilim
                </h1>

                <p className="mt-4 text-gray-500">
                    Hesap bilgilerini buradan görüntüleyebilirsin.
                </p>
            </div>

            <section className="mt-10 border border-gray-200">
                <div className="grid md:grid-cols-2">

                    <div className="border-b border-gray-200 p-6 md:border-r">
                        <p className="text-sm text-gray-400">
                            Ad
                        </p>
                        <p className="mt-2 font-medium">
                            {user?.firstName || "-"}
                        </p>
                    </div>

                    <div className="border-b border-gray-200 p-6">
                        <p className="text-sm text-gray-400">
                            Soyad
                        </p>
                        <p className="mt-2 font-medium">
                            {user?.lastName || "-"}
                        </p>
                    </div>

                    <div className="border-b border-gray-200 p-6 md:border-r">
                        <p className="text-sm text-gray-400">
                            E-posta
                        </p>
                        <p className="mt-2 font-medium">
                            {user?.email || "-"}
                        </p>
                    </div>

                    <div className="border-b border-gray-200 p-6">
                        <p className="text-sm text-gray-400">
                            Telefon
                        </p>
                        <p className="mt-2 font-medium">
                            {user?.phoneNumber || "-"}
                        </p>
                    </div>

                    <div className="p-6 md:border-r">
                        <p className="text-sm text-gray-400">
                            Doğum Tarihi
                        </p>
                        <p className="mt-2 font-medium">
                            {user?.birthDate || "-"}
                        </p>
                    </div>

                    <div className="p-6">
                        <p className="text-sm text-gray-400">
                            Kullanıcı ID
                        </p>
                        <p className="mt-2 font-medium">
                            {user?.id || "-"}
                        </p>
                    </div>

                </div>
            </section>

        </main>
    );
}

export default Profile;