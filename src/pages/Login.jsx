import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {useDispatch} from "react-redux";
import {LOGIN_MUTATION} from "../graphqls/mutations/auth.js";
import { login } from "../features/auth/authSlice";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const { data } = await loginMutation({
                variables: {
                    input: {
                        email,
                        password,
                    },
                },
            });

            dispatch(
                login({
                    accessToken: data.login.accessToken,
                    refreshToken: data.login.refreshToken,
                    roleName: data.login.roleName,
                })
            );
            navigate("/MyAccount");

        } catch (error) {
            console.error("Login hatası:", error);
        }
    };
    return (
        <main className="mx-auto max-w-md px-6 py-20">

            <h1 className="text-3xl font-semibold">
                Giriş Yap
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
            >
                <p className="mt-6 text-center text-sm text-gray-500">
                    Hesabın yok mu?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-black underline underline-offset-4"
                    >
                        Kayıt Ol
                    </Link>
                </p>

                <div>
                    <label className="mb-2 block text-sm">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        placeholder="email@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm">
                        Şifre
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        Email veya şifre hatalı.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>

            </form>

        </main>
    );
}

export default Login;