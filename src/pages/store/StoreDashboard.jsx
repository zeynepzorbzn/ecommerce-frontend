import { Link } from "react-router-dom";

function StoreDashboard() {

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <p className="text-sm uppercase tracking-widest text-gray-400">
                Store Manager
            </p>

            <h1 className="mt-2 text-4xl font-semibold">
                Mağaza Yönetimi
            </h1>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

                <Link
                    to="/store"
                    className="border p-6 hover:bg-gray-50"
                >
                    <h2 className="text-xl font-medium">
                        Mağazam
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Mağaza bilgilerini görüntüle.
                    </p>
                </Link>

                <Link
                    to="/store/products"
                    className="border p-6 hover:bg-gray-50"
                >
                    <h2 className="text-xl font-medium">
                        Ürünlerim
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Mağazandaki ürünleri yönet.
                    </p>
                </Link>

                <Link
                    to="/store/products/new"
                    className="border p-6 hover:bg-gray-50"
                >
                    <h2 className="text-xl font-medium">
                        Yeni Ürün
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Yeni ürün oluştur.
                    </p>
                </Link>

            </div>

        </main>
    );
}

export default StoreDashboard;