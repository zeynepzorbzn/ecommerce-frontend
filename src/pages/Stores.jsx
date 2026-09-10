import { useQuery } from "@apollo/client/react";
import { MapPin, Store as StoreIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { GET_STORES_QUERY } from "../graphqls/queries/store";

function Stores() {
    const { loading, error, data } = useQuery(GET_STORES_QUERY);
    const stores = data?.getStores ?? [];

    return (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
            <div className="max-w-2xl">
                <p className="section-kicker">Keşfet</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                    Mağazalar
                </h1>
                <p className="mt-4 text-sm leading-7 text-gray-500">
                    ZEY'Z üzerindeki mağazaları keşfet ve koleksiyonlarına göz at.
                </p>
            </div>

            {loading && (
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="h-52 animate-pulse rounded-2xl bg-gray-100" />
                    ))}
                </div>
            )}

            {error && (
                <div className="mt-12 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
                    Mağazalar yüklenirken bir hata oluştu.
                </div>
            )}

            {!loading && !error && (
                stores.length > 0 ? (
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {stores.map((store) => (
                            <Link
                                key={store.id}
                                to="/products"
                                className="group rounded-2xl border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 transition group-hover:bg-black group-hover:text-white">
                                    <StoreIcon size={21} />
                                </div>
                                <h2 className="mt-6 text-xl font-semibold">{store.name}</h2>
                                {store.ownerName && (
                                    <p className="mt-1 text-sm text-gray-500">{store.ownerName}</p>
                                )}
                                {store.city && (
                                    <p className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                                        <MapPin size={14} />
                                        {store.city}{store.district ? `, ${store.district}` : ""}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="mt-12 rounded-2xl border border-dashed border-gray-300 py-20 text-center text-sm text-gray-500">
                        Henüz mağaza bulunmuyor.
                    </div>
                )
            )}
        </main>
    );
}

export default Stores;
