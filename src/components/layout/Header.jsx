import { Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../../features/auth/authSlice";

function Header() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [accountOpen, setAccountOpen] = useState(false);

    const auth = useSelector(
        (state) => state.auth
    );

    const isAuthenticated = auth.isAuthenticated;
    const roleName = auth.roleName;

    const handleAccountClick = () => {

        if (!isAuthenticated) {
            navigate("/account");
            return;
        }

        setAccountOpen((previous) => !previous);
    };

    const handleLogout = () => {

        dispatch(logout());

        setAccountOpen(false);

        navigate("/");
    };

    return (
        <header className="relative border-b border-gray-200 bg-white">

            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                {/* Logo */}

                <Link
                    to="/"
                    className="text-2xl font-semibold tracking-widest"
                >
                    ZEY'Z
                </Link>


                {/* Navigation */}

                <nav className="hidden items-center gap-8 text-sm md:flex">

                    <Link
                        to="/products"
                        className="transition hover:text-gray-500"
                    >
                        En Yeniler
                    </Link>

                    <Link
                        to="/products"
                        className="transition hover:text-gray-500"
                    >
                        Mağazalar
                    </Link>

                    <Link
                        to="/categories"
                        className="transition hover:text-gray-500"
                    >
                        Kategoriler
                    </Link>

                    <a
                        href="#"
                        className="transition hover:text-gray-500"
                    >
                        İNDİRİM!
                    </a>

                </nav>


                {/* Actions */}

                <div className="flex items-center gap-5">

                    <button
                        type="button"
                        className="transition hover:text-gray-500"
                        aria-label="Search"
                    >
                        <Search
                            size={20}
                            strokeWidth={1.7}
                        />
                    </button>

                    {/* ACCOUNT */}

                    <div className="relative">

                        <button
                            type="button"
                            onClick={handleAccountClick}
                            className="flex items-center gap-1 transition hover:text-gray-500"
                            aria-label="Account"
                        >

                            <User
                                size={20}
                                strokeWidth={1.7}
                            />

                            {isAuthenticated && (
                                <ChevronDown
                                    size={14}
                                    strokeWidth={1.7}
                                />
                            )}

                        </button>


                        {/* DROPDOWN */}

                        {accountOpen && isAuthenticated && (

                            <div className="absolute right-0 top-10 z-50 w-56 border border-gray-200 bg-white p-2 shadow-lg">

                                <div className="border-b border-gray-100 px-4 py-3">

                                    <p className="text-xs uppercase tracking-widest text-gray-400">
                                        Hesap
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {roleName === "ADMIN"
                                            ? "Admin"
                                            : roleName === "STORE_MANAGER"
                                                ? "Mağaza Yöneticisi"
                                                : "Kullanıcı"}
                                    </p>

                                </div>


                                <Link
                                    to="/myAccount"
                                    onClick={() => setAccountOpen(false)}
                                    className="block px-4 py-3 text-sm hover:bg-gray-50"
                                >
                                    Hesabım
                                </Link>


                                <Link
                                    to="/orders"
                                    onClick={() => setAccountOpen(false)}
                                    className="block px-4 py-3 text-sm hover:bg-gray-50"
                                >
                                    Siparişlerim
                                </Link>


                                {/* STORE MANAGER */}

                                {roleName === "STORE_MANAGER" && (

                                    <Link
                                        to="/store"
                                        onClick={() => setAccountOpen(false)}
                                        className="block px-4 py-3 text-sm hover:bg-gray-50"
                                    >
                                        Mağazam
                                    </Link>

                                )}


                                {/* ADMIN */}

                                {roleName === "ADMIN" && (

                                    <Link
                                        to="/admin"
                                        onClick={() => setAccountOpen(false)}
                                        className="block px-4 py-3 text-sm hover:bg-gray-50"
                                    >
                                        Admin Panel
                                    </Link>

                                )}


                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full border-t border-gray-100 px-4 py-3 text-left text-sm text-red-500 hover:bg-gray-50"
                                >
                                    Çıkış Yap
                                </button>

                            </div>

                        )}

                    </div>


                    {/* CART */}

                    <Link
                        to="/cart"
                        className="relative transition hover:text-gray-500"
                        aria-label="Shopping cart"
                    >

                        <ShoppingBag
                            size={20}
                            strokeWidth={1.7}
                        />

                        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                            0
                        </span>

                    </Link>

                </div>

            </div>

        </header>
    );
}

export default Header;