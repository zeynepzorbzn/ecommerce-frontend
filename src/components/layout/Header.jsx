import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { useDispatch, useSelector } from "react-redux";
import {
    ChevronDown,
    Heart,
    Menu,
    Search,
    ShoppingBag,
    User,
    X,
} from "lucide-react";

import { GET_CATEGORIES_QUERY } from "../../graphqls/queries/category";
import { GET_CART_QUERY } from "../../graphqls/queries/cart";
import { logout } from "../../features/auth/authSlice";
import { getFavoriteIds } from "../../utils/favorites";

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [accountOpen, setAccountOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [favoriteCount, setFavoriteCount] = useState(getFavoriteIds().length);

    const auth = useSelector((state) => state.auth);
    const isAuthenticated = auth.isAuthenticated;
    const roleName = auth.roleName;

    const { data: categoriesData } = useQuery(GET_CATEGORIES_QUERY);
    const { data: cartData } = useQuery(GET_CART_QUERY, {
        skip: !isAuthenticated,
    });

    const categories = categoriesData?.getCategories ?? [];
    const cartCount = cartData?.getMyCart?.productCount ?? 0;

    useEffect(() => {
        const updateFavorites = () => setFavoriteCount(getFavoriteIds().length);
        window.addEventListener("favoritesChanged", updateFavorites);
        window.addEventListener("storage", updateFavorites);

        return () => {
            window.removeEventListener("favoritesChanged", updateFavorites);
            window.removeEventListener("storage", updateFavorites);
        };
    }, []);

    const closeMenus = () => {
        setAccountOpen(false);
        setCategoriesOpen(false);
        setMobileOpen(false);
    };

    const handleAccountClick = () => {
        if (!isAuthenticated) {
            navigate("/account");
            return;
        }
        setAccountOpen((previous) => !previous);
        setCategoriesOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        closeMenus();
        navigate("/");
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const value = search.trim();

        if (!value) {
            navigate("/products");
        } else {
            navigate(`/products?search=${encodeURIComponent(value)}`);
        }

        setSearchOpen(false);
        setSearch("");
        closeMenus();
    };

    return (
        <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-[76px] items-center justify-between gap-4">

                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen((open) => !open)}
                        className="rounded-full p-2 transition hover:bg-black hover:text-white md:hidden"
                        aria-label="Menüyü aç"
                    >
                        {mobileOpen ? <X size={21} /> : <Menu size={21} />}
                    </button>

                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={closeMenus}
                        className="shrink-0 text-2xl font-semibold tracking-[0.28em] transition-opacity hover:opacity-60 sm:text-3xl"
                    >
                        ZEY'Z
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="hidden items-center gap-7 text-[13px] font-medium md:flex lg:gap-9">
                        <Link
                            to="/products"
                            className="nav-link"
                        >
                            Yeni Gelenler
                        </Link>

                        <Link
                            to="/stores"
                            className="nav-link"
                        >
                            Mağazalar
                        </Link>

                        {/* Category dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setCategoriesOpen(true)}
                            onMouseLeave={() => setCategoriesOpen(false)}
                        >
                            <button
                                type="button"
                                onClick={() => setCategoriesOpen((open) => !open)}
                                className="nav-link flex items-center gap-1"
                            >
                                Kategoriler
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {categoriesOpen && (
                                <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3">
                                    <div className="rounded-2xl border border-black/10 bg-white p-2 shadow-2xl">
                                        <Link
                                            to="/categories"
                                            onClick={closeMenus}
                                            className="mb-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold hover:bg-gray-100"
                                        >
                                            Tüm Kategoriler
                                            <span>→</span>
                                        </Link>

                                        <div className="max-h-80 overflow-y-auto">
                                            {categories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    to={`/products?categoryId=${category.id}`}
                                                    onClick={closeMenus}
                                                    className="block rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-black"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/products?discount=true"
                            className="nav-link font-semibold"
                        >
                            İNDİRİM
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Search */}
                        <div className="relative">
                            {searchOpen && (
                                <form
                                    onSubmit={handleSearch}
                                    className="absolute right-0 top-12 z-50 flex w-72 rounded-2xl border border-black/10 bg-white p-2 shadow-xl sm:w-80"
                                >
                                    <input
                                        autoFocus
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Ürün ara..."
                                        className="min-w-0 flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                    />
                                    <button
                                        type="submit"
                                        className="ml-2 rounded-xl bg-black px-4 text-white transition hover:scale-[1.02]"
                                    >
                                        <Search size={18} />
                                    </button>
                                </form>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    setSearchOpen((open) => !open);
                                    setAccountOpen(false);
                                }}
                                className="rounded-full p-2.5 transition hover:bg-black hover:text-white"
                                aria-label="Arama"
                            >
                                <Search size={20} strokeWidth={1.7} />
                            </button>
                        </div>

                        {/* Favorites */}
                        <Link
                            to="/favorites"
                            className="relative rounded-full p-2.5 transition hover:bg-black hover:text-white"
                            aria-label="Favorilerim"
                        >
                            <Heart size={20} strokeWidth={1.7} />
                            {favoriteCount > 0 && (
                                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>

                        {/* Account */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={handleAccountClick}
                                className="flex items-center gap-1 rounded-full p-2.5 transition hover:bg-black hover:text-white"
                                aria-label="Hesabım"
                            >
                                <User size={20} strokeWidth={1.7} />
                                {isAuthenticated && <ChevronDown size={13} />}
                            </button>

                            {accountOpen && isAuthenticated && (
                                <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-2xl">
                                    <div className="border-b border-gray-100 px-4 py-4">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                                            Hesap
                                        </p>
                                        <p className="mt-1 text-sm font-semibold">
                                            {roleName === "ADMIN"
                                                ? "Admin"
                                                : roleName === "STORE_MANAGER"
                                                    ? "Mağaza Yöneticisi"
                                                    : "Kullanıcı"}
                                        </p>
                                    </div>

                                    <Link to="/myAccount" onClick={closeMenus} className="account-link">
                                        Hesabım
                                    </Link>
                                    <Link to="/orders" onClick={closeMenus} className="account-link">
                                        Siparişlerim
                                    </Link>

                                    {roleName === "STORE_MANAGER" && (
                                        <>
                                            <Link to="/store" onClick={closeMenus} className="account-link">
                                                Mağazam
                                            </Link>
                                            <Link to="/store/products" onClick={closeMenus} className="account-link">
                                                Ürünlerim
                                            </Link>
                                        </>
                                    )}

                                    {roleName === "ADMIN" && (
                                        <>
                                            <Link to="/admin" onClick={closeMenus} className="account-link">
                                                Admin Panel
                                            </Link>
                                            <Link to="/admin/stores" onClick={closeMenus} className="account-link">
                                                Mağazalar
                                            </Link>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="mt-1 w-full border-t border-gray-100 px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                                    >
                                        Çıkış Yap
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative rounded-full p-2.5 transition hover:bg-black hover:text-white"
                            aria-label="Sepetim"
                        >
                            <ShoppingBag size={20} strokeWidth={1.7} />
                            {cartCount > 0 && (
                                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile search */}
                {searchOpen && (
                    <form
                        onSubmit={handleSearch}
                        className="mb-3 flex rounded-2xl border border-black/10 bg-gray-50 p-2 md:hidden"
                    >
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Ürün ara..."
                            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                        />
                        <button type="submit" className="rounded-xl bg-black px-4 text-white">
                            <Search size={17} />
                        </button>
                    </form>
                )}

                {/* Mobile navigation */}
                {mobileOpen && (
                    <nav className="border-t border-gray-100 py-4 md:hidden">
                        <div className="grid gap-1">
                            <Link to="/products" onClick={closeMenus} className="mobile-nav-link">
                                Yeni Gelenler
                            </Link>
                            <Link to="/stores" onClick={closeMenus} className="mobile-nav-link">
                                Mağazalar
                            </Link>
                            <Link to="/categories" onClick={closeMenus} className="mobile-nav-link">
                                Kategoriler
                            </Link>
                            <Link to="/products?discount=true" onClick={closeMenus} className="mobile-nav-link font-semibold">
                                İNDİRİM
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Header;
