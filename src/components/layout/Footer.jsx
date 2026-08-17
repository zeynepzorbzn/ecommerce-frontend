function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">

            <div className="mx-auto max-w-7xl px-6 py-12">

                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

                    {/* Brand */}
                    <div>
                        <h2 className="text-xl font-semibold tracking-widest">
                            ZEY'Z
                        </h2>

                        <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
                            Sevdiğiniz markaları ve ürünleri keşfedin.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="text-sm font-semibold">
                            Alışveriş
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm text-gray-500">
                            <li>En Yeniler</li>
                            <li>Mağazalar</li>
                            <li>Kategoriler</li>
                            <li>İNDİRİM!</li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="text-sm font-semibold">
                            Yardım
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm text-gray-500">
                            <li>Bize Ulaşın-İletişim</li>
                            <li>Kargo ve İade</li>
                            <li>Geri Dönüşler</li>
                            <li>Sıkça Sorulan Sorular</li>
                        </ul>
                    </div>

                    {/* Follow */}
                    <div>
                        <h3 className="text-sm font-semibold">
                            Bizi Takip Edin
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm text-gray-500">
                            <li>Instagram</li>
                            <li>TikTok</li>
                            <li>Twitter</li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
                    © 2026 ZEY'Z. Tüm Hakları Saklıdır.
                </div>

            </div>

        </footer>
    )
}

export default Footer