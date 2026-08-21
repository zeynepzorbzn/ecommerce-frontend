import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Account() {

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    if (isAuthenticated) {
        return <Navigate to="/myAccount" replace />;
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-20">

            <div className="mx-auto max-w-2xl text-center">

                <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
                    ZEY'Z
                </p>

                <h1 className="mt-3 text-4xl font-semibold">
                    Hesabına Hoş Geldin
                </h1>

                <p className="mt-4 text-gray-500">
                    Alışverişe devam etmek veya hesabını oluşturmak için
                    bir seçenek seç.
                </p>

            </div>

            <div className="mx-auto mt-12 grid max-w-2xl gap-4 md:grid-cols-2">

                <Link
                    to="/login"
                    className="border border-gray-200 p-8 transition hover:border-black"
                >
                    <h2 className="text-xl font-medium">
                        Giriş Yap
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Mevcut hesabına giriş yap.
                    </p>

                    <span className="mt-8 inline-block text-sm underline underline-offset-4">
                        Giriş Yap →
                    </span>
                </Link>

                <Link
                    to="/register"
                    className="border border-gray-200 p-8 transition hover:border-black"
                >
                    <h2 className="text-xl font-medium">
                        Kayıt Ol
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Yeni bir ZEY'Z hesabı oluştur.
                    </p>

                    <span className="mt-8 inline-block text-sm underline underline-offset-4">
                        Kayıt Ol →
                    </span>
                </Link>

            </div>

        </main>
    );
}

export default Account;