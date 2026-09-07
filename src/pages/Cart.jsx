import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { GET_CART_QUERY } from "../graphqls/queries/cart";
import {UPDATE_CART_ITEM_QUANTITY_MUTATION, REMOVE_FROM_CART_MUTATION} from "../graphqls/mutations/cart";
import { getProductImage } from "../utils/image.js";


function Cart() {

    const { data, loading, error } = useQuery(GET_CART_QUERY);
    const accessToken = useSelector(
        (state) => state.auth.accessToken
    );

   const [imageUrls, setImageUrls] = useState({});

    const [updateQuantity] = useMutation(UPDATE_CART_ITEM_QUANTITY_MUTATION, {refetchQueries: ["GetMyCart"]});
    const [removeFromCart] = useMutation(REMOVE_FROM_CART_MUTATION, {refetchQueries: ["GetMyCart"]});
    const cart = data?.getMyCart;

    useEffect(() => {

        if (!cart?.items?.length || !accessToken) {
            setImageUrls({});
            return;
        }

        let cancelled = false;

        const loadImages = async () => {
            const images = {};
            for (const item of cart.items) {

                if (!item.imageToken) {
                    continue;
                }
                try {
                    const imageUrl = await getProductImage(item.imageToken, accessToken);
                    if (imageUrl) {
                        images[item.id] = imageUrl;
                    }
                } catch (error) {
                    console.error(`Cart image error (${item.productName}):`, error);
                }
            }
            if (!cancelled) {
                setImageUrls(images);
            }
        };

        loadImages();
        return () => {
            cancelled = true;
        };

    }, [cart, accessToken]);

    const handleQuantityChange = async (item, newQuantity) => {

        if (newQuantity < 1) {
            return;
        }
        try {
            await updateQuantity({
                variables: {
                    cartItemId: item.id,
                    quantity: newQuantity
                }
            });

        } catch (error) {

            console.error(
                "Quantity update error:",
                error
            );
        }
    };
    const handleRemove = async (cartItemId) => {
        try {

            await removeFromCart({
                variables: {
                    cartItemId
                }});
        } catch (error) {

            console.error(
                "Ürün sepetten silinemedi:",
                error
            );
        }
    };
    if (loading) {

        return (
            <div className="mx-auto max-w-7xl px-6 py-20">
                Sepet yükleniyor...
            </div>
        );
    }
    if (error) {
        console.error("Cart error:", error);
        return (
            <div className="mx-auto max-w-7xl px-6 py-20">

                <h1 className="text-3xl font-semibold">
                    Sepetim
                </h1>

                <p className="mt-6 text-red-500">
                    Sepet yüklenirken bir hata oluştu.
                </p>

            </div>
        );
    }
    if (!cart) {

        return (
            <div className="mx-auto max-w-7xl px-6 py-20">

                <h1 className="text-3xl font-semibold">
                    Sepetim
                </h1>

                <p className="mt-6 text-gray-500">
                    Sepetiniz boş.
                </p>

            </div>
        );
    }
    return (
        <main className="mx-auto max-w-7xl px-6 py-20">

            {/* TITLE */}

            <h1 className="text-3xl font-semibold">
                Sepetim
            </h1>

            {/* CART ITEMS */}
            <div className="mt-10">

                {cart.items?.length === 0 ? (
                    <p className="text-gray-500">
                        Sepetiniz boş.
                    </p>

                ) : (

                    <div className="space-y-6">
                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border-b pb-6"
                            >

                                {/* LEFT SIDE */}
                                <div
                                    className="flex cursor-pointer items-center gap-5"
                                    onClick={() => {
                                        window.location.href =
                                            `/products/${item.productId}`;
                                    }}
                                >

                                    {/* PRODUCT IMAGE */}
                                    <div className="h-24 w-24 shrink-0 overflow-hidden bg-gray-100">

                                        {item.imageToken && imageUrls[item.id] ? (

                                            <img
                                                src={imageUrls[item.id]}
                                                alt={item.productName}
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                                Ürün
                                            </div>

                                        )}

                                    </div>

                                    {/* PRODUCT INFO */}
                                    <div>
                                        <h2 className="font-medium">
                                            {item.productName}
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {item.color} / {item.size}
                                        </p>

                                        {/* QUANTITY */}
                                        <div
                                            className="mt-3 flex items-center gap-3"
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={item.quantity <= 1}
                                                className="flex h-8 w-8 items-center justify-center rounded border disabled:opacity-40"
                                            >
                                                -
                                            </button>

                                            <span className="min-w-[25px] text-center">
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded border"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                {/* RIGHT SIDE */}
                                <div className="flex items-center gap-6">

                                    {/* PRICE */}
                                    <div className="font-medium">
                                        {Number(
                                            item.totalPrice
                                        ).toLocaleString("tr-TR")}{" "}
                                        TL
                                    </div>

                                    {/* REMOVE */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemove(item.id)
                                        }
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CART TOTAL */}
            {cart.items?.length > 0 && (

                <div className="mt-10 flex justify-end">

                    <div className="text-right">

                        <p className="text-sm text-gray-500">
                            Toplam
                        </p>

                        <p className="mt-2 text-2xl font-semibold">
                            {Number(
                                cart.totalPrice
                            ).toLocaleString("tr-TR")}{" "}
                            TL
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.href = "/checkout"}
                            className="mt-6 bg-black px-8 py-4 text-white"
                        >
                            Ödemeye Geç
                        </button>

                    </div>

                </div>


            )}

        </main>
    );
}
export default Cart;