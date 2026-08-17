import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function MyAccount() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");};

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <p className="text-sm uppercase tracking-widest text-gray-400">
                Hesabım
            </p>

            <h1 className="mt-2 text-4xl font-semibold">
                Hoş geldin 👋
            </h1>

            <p className="mt-4 text-gray-500">
                Bu sayfayı yalnızca giriş yapmış kullanıcılar görebilir.
            </p>

            <div className="mt-10 border border-gray-200 p-6">
                <p className="text-sm text-gray-500">
                    Authentication durumu
                </p>

                <p className="mt-2 font-medium">
                    {auth.isAuthenticated
                        ? "Giriş yapılmış"
                        : "Giriş yapılmamış"}
                </p>
                <button
                    onClick={handleLogout}
                    className="mt-8 bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    Çıkış Yap
                </button>
            </div>

        </main>
    );
}

export default MyAccount;