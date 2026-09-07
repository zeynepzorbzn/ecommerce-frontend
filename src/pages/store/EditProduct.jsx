import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { GET_PRODUCT_QUERY } from "../../graphqls/queries/product";
import { GET_BRANDS_QUERY } from "../../graphqls/queries/brand";
import { GET_CATEGORIES_QUERY } from "../../graphqls/queries/category";

import {
    UPDATE_PRODUCT_MUTATION
} from "../../graphqls/mutations/product";

function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { data, loading: productLoading } =
        useQuery(GET_PRODUCT_QUERY, {
            variables: { id }
        });

    const { data: brandData } =
        useQuery(GET_BRANDS_QUERY);

    const { data: categoryData } =
        useQuery(GET_CATEGORIES_QUERY);

    const [updateProduct, { loading }] =
        useMutation(UPDATE_PRODUCT_MUTATION);

    const product = data?.getProduct;

    const [form, setForm] = useState(null);

    if (productLoading) {
        return (
            <main className="mx-auto max-w-4xl px-6 py-20">
                Ürün yükleniyor...
            </main>
        );
    }

    if (!product) {
        return (
            <main className="mx-auto max-w-4xl px-6 py-20">
                Ürün bulunamadı.
            </main>
        );
    }

    const currentForm = form ?? {
        name: product.name ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
        gender: product.gender ?? "",
        season: product.season ?? "",
        brandId: "",
        categoryId: ""
    };

    const handleChange = (e) => {
        setForm({
            ...currentForm,
            [e.target.name]: e.target.value
        });
    };

    const parsePrice = (value) => {
        if (!value) return 0;

        return Number(
            String(value)
                .replace(/\./g, "")
                .replace(",", ".")
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateProduct({
                variables: {
                    id,
                    input: {
                        name: currentForm.name,
                        description: currentForm.description,
                        price: parsePrice(currentForm.price),
                        gender: currentForm.gender,
                        season: currentForm.season,
                        brandId: Number(currentForm.brandId),
                        categoryId: Number(currentForm.categoryId),
                        storeId: 0
                    }
                }
            });

            alert("Ürün güncellendi.");
            navigate("/store/products");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <main className="mx-auto max-w-4xl px-6 py-20">

            <h1 className="text-4xl font-semibold">
                Ürünü Düzenle
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-5"
            >

                <input
                    name="name"
                    value={currentForm.name}
                    onChange={handleChange}
                    className="w-full border p-4"
                    placeholder="Ürün adı"
                    required
                />

                <textarea
                    name="description"
                    value={currentForm.description}
                    onChange={handleChange}
                    className="w-full border p-4"
                    rows="5"
                    placeholder="Açıklama"
                />

                <input
                    name="price"
                    value={currentForm.price}
                    onChange={handleChange}
                    className="w-full border p-4"
                    placeholder="Fiyat"
                    required
                />

                <select
                    name="brandId"
                    value={currentForm.brandId}
                    onChange={handleChange}
                    className="w-full border p-4"
                    required
                >
                    <option value="">Marka seç</option>

                    {brandData?.getBrands?.map((brand) => (
                        <option
                            key={brand.id}
                            value={brand.id}
                        >
                            {brand.name}
                        </option>
                    ))}
                </select>

                <select
                    name="categoryId"
                    value={currentForm.categoryId}
                    onChange={handleChange}
                    className="w-full border p-4"
                    required
                >
                    <option value="">Kategori seç</option>

                    {categoryData?.getCategories?.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                <input
                    name="gender"
                    value={currentForm.gender}
                    onChange={handleChange}
                    className="w-full border p-4"
                    placeholder="Cinsiyet"
                />

                <input
                    name="season"
                    value={currentForm.season}
                    onChange={handleChange}
                    className="w-full border p-4"
                    placeholder="Sezon"
                />

                <button
                    disabled={loading}
                    className="w-full bg-black p-4 text-white"
                >
                    {loading ? "Güncelleniyor..." : "Kaydet"}
                </button>

            </form>
        </main>
    );
}

export default EditProduct;