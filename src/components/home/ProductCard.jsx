import { useNavigate } from "react-router-dom";
import { getProductImage } from "../../utils/image.js";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function ProductCard({ product }) {

    const navigate = useNavigate();

    const accessToken = useSelector(
        (state) => state.auth.accessToken
    );

    const [imageUrl, setImageUrl] = useState(null);

    const imageToken =
        product?.images?.[0]?.imageToken;

    useEffect(() => {

        if (!imageToken || !accessToken) {
            setImageUrl(null);
            return;
        }

        let objectUrl = null;

        const loadImage = async () => {

            objectUrl = await getProductImage(
                imageToken,
                accessToken
            );

            setImageUrl(objectUrl);
        };

        loadImage();

        return () => {

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }

        };

    }, [imageToken, accessToken]);

    return (
        <div
            onClick={() =>
                navigate(`/products/${product.id}`)
            }
            className="group cursor-pointer"
        >

            <div className="aspect-[4/5] overflow-hidden bg-gray-200">

                {imageUrl ? (

                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                ) : (

                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        Product Image
                    </div>

                )}

            </div>

            <div className="mt-4">

                <p className="text-xs uppercase tracking-wider text-gray-400">
                    {product.categoryName}
                </p>

                <h3 className="mt-1 text-sm font-medium">
                    {product.name}
                </h3>

                <p className="mt-2 text-sm">
                    {Number(product.price).toLocaleString(
                        "tr-TR",
                        {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                        }
                    )} ₺
                </p>

            </div>

        </div>
    );
}

export default ProductCard;