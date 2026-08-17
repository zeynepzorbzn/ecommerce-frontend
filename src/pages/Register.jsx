import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useDispatch } from "react-redux";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { REGISTER_MUTATION } from "../graphqls/mutations/auth.js";
import { login } from "../features/auth/authSlice.js";

function Register() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, { loading, error }] =
        useMutation(REGISTER_MUTATION);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            const { data } = await register({
                variables: {
                    input: {
                        firstName,
                        lastName,
                        email,
                        phoneNumber,
                        password,
                    },
                },
            });

            console.log("Register başarılı:", data);

            dispatch(
                login({
                    accessToken: data.register.accessToken,
                    refreshToken: data.register.refreshToken,
                })
            );
            navigate("/myAccount");

        } catch (error) {
            console.error("Register hatası:", error);
        }
    };

    return (
        <main className="mx-auto max-w-md px-6 py-20">

            <h1 className="text-3xl font-semibold">
                Hesap Oluştur
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
            >
                <p className="mt-6 text-center text-sm text-gray-500">
                    Zaten hesabın var mı?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-black underline underline-offset-4"
                    >
                        Giriş Yap
                    </Link>
                </p>

                {/* First Name */}
                <div>
                    <label className="mb-2 block text-sm">
                        Ad
                    </label>

                    <input
                        type="text"
                        value={firstName}
                        onChange={(event) =>
                            setFirstName(event.target.value)
                        }
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        required
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className="mb-2 block text-sm">
                        Soyad
                    </label>

                    <input
                        type="text"
                        value={lastName}
                        onChange={(event) =>
                            setLastName(event.target.value)
                        }
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="mb-2 block text-sm">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        required
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-2 block text-sm">
                        Telefon
                    </label>

                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(event) =>
                            setPhoneNumber(event.target.value)
                        }
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="mb-2 block text-sm">
                        Şifre
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        required
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        Kayıt oluşturulamadı.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading
                        ? "Hesap oluşturuluyor..."
                        : "Kayıt Ol"}
                </button>

            </form>

        </main>
    );
}

export default Register;