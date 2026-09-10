import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { showError, showSuccess } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../services/fileService";
import { ADD_PRODUCT_IMAGE_MUTATION } from "../../graphqls/mutations/productImage";

import { GET_BRANDS_QUERY } from "../../graphqls/queries/brand";
import { GET_CATEGORIES_QUERY } from "../../graphqls/queries/category";
import { CREATE_PRODUCT_MUTATION } from "../../graphqls/mutations/product";

function CreateProduct() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        gender: "",
        season: "",
        brandId: "",
        categoryId: "",
    });

    const {
        data: brandData,
        loading: brandsLoading
    } = useQuery(GET_BRANDS_QUERY);

    const {
        data: categoryData,
        loading: categoriesLoading
    } = useQuery(GET_CATEGORIES_QUERY);

    const [createProduct, { loading }] =
        useMutation(CREATE_PRODUCT_MUTATION);
    const [addProductImage] =
        useMutation(ADD_PRODUCT_IMAGE_MUTATION);

    const [selectedFiles, setSelectedFiles] = useState([]);


    const brands = brandData?.getBrands ?? [];

    const categories = categoryData?.getCategories ?? [];

    const parsePrice = (value) => {
        if (!value) return 0;

        return Number(
            value
                .replace(/\./g, "")
                .replace(",", ".")
        );
    };
    const handleChange = (event) => {

        const { name, value } =
            event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const result = await createProduct({
                variables: {
                    input: {
                        name: form.name,
                        description: form.description,
                        price: parsePrice(form.price),
                        gender: form.gender,
                        season: form.season,
                        brandId: Number(form.brandId),
                        categoryId: Number(form.categoryId),

                        /*
                         * STORE_MANAGER için backend
                         * kendi mağazasını buluyor.
                         */
                        storeId: 0
                    }
                }
            });

            const productId =
                result?.data?.createProduct?.id;

            if (!productId) {
                throw new Error(
                    "Ürün oluşturuldu fakat ürün ID alınamadı."
                );
            }

            for (const file of selectedFiles) {

                const uploadResponse =
                    await uploadFile(file);

                const imageToken =
                    uploadResponse?.objectName ||
                    uploadResponse?.object_name;

                if (!imageToken) {
                    throw new Error(
                        "Fotoğraf yüklendi fakat image token alınamadı."
                    );
                }

                await addProductImage({
                    variables: {
                        productId: Number(productId),
                        imageToken
                    }
                });
            }

            showSuccess("Ürün başarıyla oluşturuldu.");

            navigate("/store/products");

        } catch (error) {

            console.error(
                "CREATE PRODUCT ERROR:",
                error
            );

            showError(
                error,
                "Ürün oluşturulamadı."
            );
        }
    };

    return (
        <main className="mx-auto max-w-4xl px-6 py-20">

            <h1 className="text-4xl font-semibold">
                Yeni Ürün
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
            >

                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ürün adı"
                    className="w-full border p-4"
                    required
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Açıklama"
                    className="w-full border p-4"
                    rows="5"
                />

                <input
                    name="price"
                    type="text"
                    inputMode="decimal"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Fiyat"
                    className="w-full border p-4"
                    required
                />

                <select
                    name="brandId"
                    value={form.brandId}
                    onChange={handleChange}
                    className="w-full border p-4"
                    required
                >

                    <option value="">
                        Marka seç
                    </option>

                    {brands.map((brand) => (
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
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full border p-4"
                    required
                >

                    <option value="">
                        Kategori seç
                    </option>

                    {categories.map((category) => (
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
                    value={form.gender}
                    onChange={handleChange}
                    placeholder="Cinsiyet"
                    className="w-full border p-4"
                />

                <input
                    name="season"
                    value={form.season}
                    onChange={handleChange}
                    placeholder="Sezon"
                    className="w-full border p-4"
                />

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Ürün Fotoğrafları
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) =>
                            setSelectedFiles(
                                Array.from(event.target.files || [])
                            )
                        }
                        className="w-full border p-4"
                    />

                    {selectedFiles.length > 0 && (
                        <p className="mt-2 text-xs text-gray-500">
                            {selectedFiles.length} fotoğraf seçildi.
                        </p>
                    )}
                </div>


                <button
                    type="submit"
                    disabled={
                        loading ||
                        brandsLoading ||
                        categoriesLoading
                    }
                    className="w-full bg-black p-4 text-white"
                >
                    {loading
                        ? "Oluşturuluyor..."
                        : "Ürünü Oluştur"}
                </button>

            </form>

        </main>
    );
}

export default CreateProduct;