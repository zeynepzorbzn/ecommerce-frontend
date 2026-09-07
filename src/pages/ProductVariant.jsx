import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";

import { uploadFile } from "../services/fileService";

import { ADD_PRODUCT_VARIANT_IMAGE_MUTATION } from "../graphqls/mutations/productImage";

import { GET_PRODUCT_QUERY } from "../graphqls/queries/product";

import {
    CREATE_PRODUCT_VARIANT_MUTATION,
    UPDATE_PRODUCT_VARIANT_MUTATION,
    DELETE_PRODUCT_VARIANT_MUTATION
} from "../graphqls/mutations/productVariant";


function ProductVariant() {

    const { id } = useParams();

    const [form, setForm] = useState({
        size: "",
        color: "",
        stock: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const {
        data,
        loading,
        error,
        refetch
    } = useQuery(GET_PRODUCT_QUERY, {
        variables: {
            id: Number(id)
        }
    });

    const [createVariant, { loading: creating }] =
        useMutation(CREATE_PRODUCT_VARIANT_MUTATION);

    const [updateVariant, { loading: updating }] =
        useMutation(UPDATE_PRODUCT_VARIANT_MUTATION);

    const [deleteVariant, { loading: deleting }] =
        useMutation(DELETE_PRODUCT_VARIANT_MUTATION);

    const [addVariantImage, { loading: uploadingImage }] =
        useMutation(ADD_PRODUCT_VARIANT_IMAGE_MUTATION);


    const product = data?.getProduct;

    const variants = product?.variants ?? [];


    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const input = {
                productId: Number(id),
                size: form.size,
                color: form.color,
                stock: Number(form.stock)
            };

            let savedVariantId = editingId;

            if (editingId) {

                await updateVariant({
                    variables: {
                        id: editingId,
                        input
                    }
                });

                alert("Seçenek başarıyla güncellendi.");

            } else {

                const result = await createVariant({
                    variables: {
                        input
                    }
                });

                savedVariantId =
                    result?.data?.createProductVariant?.id;

                alert("Seçenek başarıyla eklendi.");
            }

            // Seçenek oluşturma/düzenleme sırasında seçilen fotoğrafı
            // File Service → MinIO'ya yükle ve varyanta bağla.
            if (selectedFile && savedVariantId) {

                const uploadResponse =
                    await uploadFile(selectedFile);

                const imageToken =
                    uploadResponse?.objectName ||
                    uploadResponse?.object_name;

                if (!imageToken) {
                    throw new Error(
                        "Fotoğraf yüklendi fakat image token alınamadı."
                    );
                }

                await addVariantImage({
                    variables: {
                        variantId: Number(savedVariantId),
                        imageToken
                    }
                });
            }

            setForm({
                size: "",
                color: "",
                stock: ""
            });

            setEditingId(null);
            setSelectedFile(null);

            await refetch();

        } catch (error) {

            console.error(
                "VARIANT SAVE ERROR:",
                error
            );

            alert(
                error.message ||
                "Seçenek kaydedilemedi."
            );
        }
    };


    const handleEdit = (variant) => {

        setEditingId(variant.id);

        setForm({
            size: variant.size,
            color: variant.color,
            stock: String(variant.stock)
        });

        setSelectedFile(null);

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    };


    const handleCancelEdit = () => {

        setEditingId(null);

        setForm({
            size: "",
            color: "",
            stock: ""
        });

        setSelectedFile(null);
    };


    const handleDelete = async (variantId) => {

        const confirmed = window.confirm(
            "Bu seçeneği silmek istediğinize emin misiniz?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteVariant({
                variables: {
                    id: variantId
                }
            });

            if (editingId === variantId) {
                handleCancelEdit();
            }

            await refetch();

            alert("Seçenek silindi.");

        } catch (error) {

            console.error(
                "DELETE VARIANT ERROR:",
                error
            );

            alert(
                error.message ||
                "Seçenek silinemedi."
            );
        }
    };


    const handleImageUpload = async (variantId, file) => {

        if (!file) {
            return;
        }

        try {

            // 1. Fotoğrafı File Service → MinIO'ya yükle
            const uploadResponse = await uploadFile(file);

            console.log(
                "FILE UPLOAD RESPONSE:",
                uploadResponse
            );

            // File Service response'undan image token'ı al
            const imageToken =
                uploadResponse?.objectName ||
                uploadResponse?.object_name;

            if (!imageToken) {

                throw new Error(
                    "Dosya yüklendi fakat image token alınamadı."
                );
            }


            // 2. Image token'ı varyanta bağla
            await addVariantImage({
                variables: {
                    variantId: Number(variantId),
                    imageToken: imageToken
                }
            });


            alert(
                "Fotoğraf başarıyla eklendi."
            );


            // Güncel ürün/varyant bilgilerini getir
            await refetch();

        } catch (error) {

            console.error(
                "VARIANT IMAGE UPLOAD ERROR:",
                error
            );

            alert(
                error.message ||
                "Fotoğraf yüklenirken bir hata oluştu."
            );
        }
    };


    if (loading) {

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">

                <p>
                    Ürün yükleniyor...
                </p>

            </main>
        );
    }


    if (error || !product) {

        return (
            <main className="mx-auto max-w-7xl px-6 py-20">

                <p className="text-red-500">
                    Ürün bulunamadı.
                </p>

            </main>
        );
    }


    return (
        <main className="mx-auto max-w-7xl px-6 py-20">


            {/* HEADER */}

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm uppercase tracking-widest text-gray-400">
                        Store Manager
                    </p>

                    <h1 className="mt-2 text-4xl font-semibold">
                        {product.name}
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Seçenek Yönetimi
                    </p>

                </div>


                <Link
                    to="/store/products"
                    className="border border-black px-5 py-3 text-sm"
                >
                    Ürünlere Dön
                </Link>

            </div>


            {/* VARIANT LIST */}

            <section className="mt-12">

                <h2 className="text-xl font-medium">
                    Mevcut Seçenekler
                </h2>


                {variants.length === 0 ? (

                    <div className="mt-5 border p-8 text-center">

                        <p className="text-gray-500">
                            Bu ürün için henüz seçenek eklenmemiş.
                        </p>

                    </div>

                ) : (

                    <div className="mt-5 overflow-hidden border">

                        <table className="w-full text-left">

                            <thead className="border-b bg-gray-50">

                            <tr>

                                <th className="px-5 py-4">
                                    Renk
                                </th>

                                <th className="px-5 py-4">
                                    Beden
                                </th>

                                <th className="px-5 py-4">
                                    Stok
                                </th>

                                <th className="px-5 py-4">
                                    İşlemler
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {variants.map((variant) => (

                                <tr
                                    key={variant.id}
                                    className="border-b last:border-b-0"
                                >

                                    <td className="px-5 py-4">
                                        {variant.color}
                                    </td>


                                    <td className="px-5 py-4">
                                        {variant.size}
                                    </td>


                                    <td className="px-5 py-4">
                                        {variant.stock}
                                    </td>


                                    <td className="px-5 py-4">

                                        <div className="flex flex-wrap gap-2">


                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(variant)
                                                }
                                                className="border border-black px-3 py-2 text-sm"
                                            >
                                                Düzenle
                                            </button>


                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(variant.id)
                                                }
                                                disabled={deleting}
                                                className="border border-red-500 px-3 py-2 text-sm text-red-500 disabled:opacity-50"
                                            >
                                                {deleting
                                                    ? "Siliniyor..."
                                                    : "Sil"}
                                            </button>


                                            {/* IMAGE UPLOAD */}

                                            <label
                                                className={`cursor-pointer border border-gray-400 px-3 py-2 text-sm ${
                                                    uploadingImage
                                                        ? "cursor-not-allowed opacity-50"
                                                        : ""
                                                }`}
                                            >

                                                {uploadingImage
                                                    ? "Yükleniyor..."
                                                    : "Fotoğraf Ekle"}


                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={uploadingImage}
                                                    onChange={(event) => {

                                                        const file =
                                                            event.target.files?.[0];

                                                        handleImageUpload(
                                                            variant.id,
                                                            file
                                                        );

                                                        event.target.value = "";
                                                    }}
                                                />

                                            </label>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ADD / EDIT VARIANT */}

            <section className="mt-12 max-w-2xl">

                <div className="flex items-center justify-between">

                    <h2 className="text-xl font-medium">

                        {editingId
                            ? "Seçeneği Düzenle"
                            : "Yeni Seçenek Ekle"}

                    </h2>


                    {editingId && (

                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-sm text-gray-500 underline"
                        >
                            Düzenlemeyi İptal Et
                        </button>

                    )}

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >


                    {/* COLOR */}

                    <input
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        placeholder="Renk"
                        className="w-full border p-4"
                        required
                    />


                    {/* SIZE */}

                    <input
                        name="size"
                        value={form.size}
                        onChange={handleChange}
                        placeholder="Beden"
                        className="w-full border p-4"
                        required
                    />


                    {/* STOCK */}

                    <input
                        name="stock"
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="Stok"
                        className="w-full border p-4"
                        required
                    />


                    {/* VARIANT IMAGE */}

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Ürün Seçeneği Fotoğrafı
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                setSelectedFile(
                                    event.target.files?.[0] || null
                                )
                            }
                            className="w-full border p-3 text-sm"
                        />

                        {selectedFile && (
                            <p className="mt-2 text-xs text-gray-500">
                                Seçilen dosya: {selectedFile.name}
                            </p>
                        )}
                    </div>

                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={creating || updating || uploadingImage}
                        className="w-full bg-black p-4 text-white disabled:opacity-50"
                    >

                        {creating || updating || uploadingImage

                            ? "Kaydediliyor..."

                            : editingId

                                ? "Seçeneği Güncelle"

                                : "Seçeneği Ekle"}

                    </button>

                </form>

            </section>

        </main>
    );
}


export default ProductVariant;