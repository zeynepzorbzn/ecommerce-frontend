import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/products/${product.id}`)}
            className="group cursor-pointer"
        >
            <div className="aspect-[4/5] overflow-hidden bg-gray-200">
                <div className="flex h-full items-center justify-center text-sm text-gray-400 transition-transform duration-300 group-hover:scale-105">
                    Product Image
                </div>
            </div>

            <div className="mt-4">

                <p className="text-xs uppercase tracking-wider text-gray-400">
                    {product.categoryName}
                </p>

                <h3 className="mt-1 text-sm font-medium">
                    {product.name}
                </h3>

                <p className="mt-2 text-sm">
                    {product.price.toLocaleString("tr-TR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1
                    })} ₺
                </p>

            </div>
        </div>
    );
}

export default ProductCard;