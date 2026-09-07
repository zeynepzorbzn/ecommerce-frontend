import { Link } from "react-router-dom";

function Admin() {

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <p className="text-sm uppercase tracking-widest text-gray-400">
                Administration
            </p>

            <h1 className="mt-2 text-4xl font-semibold">
                Admin Panel
            </h1>

            <div className="mt-10 grid gap-6 md:grid-cols-4">

                <Link
                    to="/admin/stores"
                    className="border p-6 hover:bg-gray-50"
                >
                    <h2 className="text-xl font-medium">
                        Mağazalar
                    </h2>
                </Link>

                <Link
                    to="/admin/users"
                    className="border p-6 hover:bg-gray-50"
                >
                    <h2 className="text-xl font-medium">
                        Kullanıcılar
                    </h2>
                </Link>

                <Link
                    to="/admin/brands"
                    className="border p-6 hover:bg-gray-50"
                >
                    <h2 className="text-xl font-medium">
                        Markalar
                    </h2>
                </Link>

                <Link
                    to="/admin/categories"
                    className="border p-6 hover:bg-gray-50"
                >
                    <h2 className="text-xl font-medium">
                        Kategoriler
                    </h2>
                </Link>

            </div>

        </main>
    );
}

export default Admin;