import { Camera, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="mt-20 bg-[#111111] text-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    <div className="lg:col-span-1">
                        <Link
                            to="/"
                            className="text-2xl font-semibold tracking-[0.28em]"
                        >
                            ZEY'Z
                        </Link>
                        <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
                            Günlük stilini tamamlayacak ürünleri, markaları ve
                            mağazaları tek yerde keşfet.
                        </p>

                        <div className="mt-7 flex gap-2">
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="rounded-full border border-white/15 p-2.5 transition hover:bg-white hover:text-black"
                            >
                                <Camera size={17} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                            Alışveriş
                        </h3>
                        <div className="mt-5 grid gap-3 text-sm text-white/70">
                            <Link className="footer-link" to="/products">Yeni Gelenler</Link>
                            <Link className="footer-link" to="/products">Tüm Ürünler</Link>
                            <Link className="footer-link" to="/categories">Kategoriler</Link>
                            <Link className="footer-link" to="/stores">Mağazalar</Link>
                            <Link className="footer-link" to="/favorites">Favoriler</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                            Yardım
                        </h3>
                        <div className="mt-5 grid gap-3 text-sm text-white/70">
                            <span className="footer-link cursor-pointer">Kargo ve İade</span>
                            <span className="footer-link cursor-pointer">Sıkça Sorulan Sorular</span>
                            <span className="footer-link cursor-pointer">Geri Dönüşler</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                            İletişim
                        </h3>
                        <div className="mt-5 space-y-4 text-sm text-white/70">
                            <div className="flex gap-3">
                                <Mail size={17} className="mt-0.5 shrink-0" />
                                <span>info@zeyz.com</span>
                            </div>
                            <div className="flex gap-3">
                                <MapPin size={17} className="mt-0.5 shrink-0" />
                                <span>Türkiye</span>
                            </div>
                        </div>

                        <Link
                            to="/products"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:gap-3"
                        >
                            Alışverişe Başla
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
                    <span>© 2026 ZEY'Z. Tüm Hakları Saklıdır.</span>
                    <span>Modern shopping experience.</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
