import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_ADDRESS_MUTATION } from "../../graphqls/mutations/address";

function AddressForm({ onCreated, onCancel }) {

    const [form, setForm] = useState({
        name: "",
        city: "",
        district: "",
        street: "",
        postalCode: "",
        billing: false,
    });

    const [createAddress, { loading }] = useMutation(
        CREATE_ADDRESS_MUTATION,
        {
            refetchQueries: ["GetMyAddresses"],
        }
    );

    const handleChange = (event) => {

        const { name, value, type, checked } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const result = await createAddress({
                variables: {
                    input: form,
                },
            });

            const address = result.data?.createAddress;

            if (address) {
                onCreated(address);
            }

        } catch (error) {

            console.error("CREATE ADDRESS ERROR:", error);

            alert(
                error.message ||
                "Adres eklenirken bir hata oluştu."
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-5 border p-5"
        >

            <h3 className="text-lg font-medium">
                Yeni Adres
            </h3>

            <div className="mt-5 space-y-4">

                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Adres adı"
                    required
                    className="w-full border px-4 py-3"
                />

                <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Şehir"
                    required
                    className="w-full border px-4 py-3"
                />

                <input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="İlçe"
                    required
                    className="w-full border px-4 py-3"
                />

                <textarea
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="Açık adres"
                    required
                    rows={3}
                    className="w-full border px-4 py-3"
                />

                <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="Posta kodu"
                    required
                    className="w-full border px-4 py-3"
                />

                <label className="flex items-center gap-2 text-sm">

                    <input
                        type="checkbox"
                        name="billing"
                        checked={form.billing}
                        onChange={handleChange}
                    />

                    Fatura adresi olarak kullan

                </label>

            </div>

            <div className="mt-6 flex gap-3">

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black px-6 py-3 text-white disabled:opacity-50"
                >
                    {loading ? "Ekleniyor..." : "Adresi Kaydet"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="border px-6 py-3"
                >
                    Vazgeç
                </button>

            </div>

        </form>
    );
}

export default AddressForm;