import {Search, User, ShoppingBag,} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {

    const navigate = useNavigate();
    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated);

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-semibold tracking-widest"
                > ZEY'Z
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 text-sm md:flex">
                    <a href="#"
                       className="transition hover:text-gray-500">
                        En Yeniler
                    </a>
                    <a
                        href="#"
                        className="transition hover:text-gray-500"
                    >
                        Mağazalar
                    </a>
                    <a
                        href="#"
                        className="transition hover:text-gray-500"
                    >
                        Kategoriler
                    </a>
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
                        className="transition hover:text-gray-500"
                        aria-label="Search"
                    >
                        <Search size={20} strokeWidth={1.7} />
                    </button>

                    <button
                        onClick={() => {
                            if (isAuthenticated) {
                                navigate("/myAccount");
                            } else {
                                navigate("/account");
                            }
                        }}
                        className="transition hover:text-gray-500"
                        aria-label="Account"
                    >
                        <User size={20} strokeWidth={1.7} />
                    </button>

                    <Link
                        to="/cart"
                        className="relative transition hover:text-gray-500"
                        aria-label="Shopping cart"
                    >
                        <ShoppingBag size={20} strokeWidth={1.7} />
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
