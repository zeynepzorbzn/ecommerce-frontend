import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../features/auth/authSlice";

function MyAccount() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <main className="mx-auto max-w-6xl px-6 py-20">

            {/* HEADER */}

            <div>
                <p className="text-sm uppercase tracking-widest text-gray-400">
                    Hesabım
                </p>

                <h1 className="mt-2 text-4xl font-semibold">
                    Hoş geldin 👋
                </h1>

                <p className="mt-4 text-gray-500">
                    Hesabını, siparişlerini ve kişisel bilgilerini buradan
                    yönetebilirsin.
                </p>
            </div>


            {/* ACCOUNT MENU */}

            <section className="mt-12 grid gap-5 md:grid-cols-2">

                {/* PROFILE */}

                <Link
                    to="/account/profile"
                    className="border border-gray-200 p-7 transition hover:border-black"
                >
                    <h2 className="text-xl font-medium">
                        Profilim
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Hesap ve profil bilgilerini görüntüle.
                    </p>

                    <span className="mt-6 inline-block text-sm underline underline-offset-4">
                        Profilime Git →
                    </span>
                </Link>


                {/* ORDERS */}

                <Link
                    to="/orders"
                    className="border border-gray-200 p-7 transition hover:border-black"
                >
                    <h2 className="text-xl font-medium">
                        Siparişlerim
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Geçmiş siparişlerini ve sipariş detaylarını görüntüle.
                    </p>

                    <span className="mt-6 inline-block text-sm underline underline-offset-4">
                        Siparişlerime Git →
                    </span>
                </Link>


                {/* ADDRESSES */}

                <Link
                    to="/account/addresses"
                    className="border border-gray-200 p-7 transition hover:border-black"
                >
                    <h2 className="text-xl font-medium">
                        Adreslerim
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Teslimat ve fatura adreslerini yönet.
                    </p>

                    <span className="mt-6 inline-block text-sm underline underline-offset-4">
                        Adreslerime Git →
                    </span>
                </Link>


                {/* PAYMENT METHODS */}

                <Link
                    to="/payment-methods"
                    className="border border-gray-200 p-7 transition hover:border-black"
                >
                    <h2 className="text-xl font-medium">
                        Ödeme Yöntemlerim
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Kayıtlı ödeme yöntemlerini yönet.
                    </p>

                    <span className="mt-6 inline-block text-sm underline underline-offset-4">
                        Ödeme Yöntemlerime Git →
                    </span>
                </Link>

            </section>


            {/* ACCOUNT STATUS */}

            <section className="mt-10 border border-gray-200 p-7">

                <p className="text-sm text-gray-500">
                    Hesap Durumu
                </p>

                <p className="mt-2 font-medium">
                    {auth.isAuthenticated
                        ? "Giriş yapılmış"
                        : "Giriş yapılmamış"}
                </p>

            </section>


            {/* LOGOUT */}

            <button
                type="button"
                onClick={handleLogout}
                className="mt-8 border border-black px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
            >
                Çıkış Yap
            </button>

        </main>
    );
}

export default MyAccount;