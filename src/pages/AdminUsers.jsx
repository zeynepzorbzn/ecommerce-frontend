import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";

import { GET_USERS_QUERY } from "../graphqls/queries/user";

function AdminUsers() {

    const { data, loading, error } =
        useQuery(GET_USERS_QUERY);

    if (loading) return <main className="p-20">Yükleniyor...</main>;

    if (error) return (
        <main className="p-20 text-red-500">
            Kullanıcılar yüklenemedi.
        </main>
    );

    const users = data?.users ?? [];

    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            <Link to="/admin" className="text-sm text-gray-500">
                ← Admin Panel
            </Link>

            <h1 className="mt-6 text-4xl font-semibold">
                Kullanıcılar
            </h1>

            <div className="mt-10 grid gap-4 md:grid-cols-2">

                {users.map((user) => (
                    <div
                        key={user.id}
                        className="border p-6"
                    >
                        <h2 className="font-medium">
                            {user.firstName} {user.lastName}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {user.email}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            {user.phoneNumber || "-"}
                        </p>
                    </div>
                ))}

            </div>
        </main>
    );
}

export default AdminUsers;