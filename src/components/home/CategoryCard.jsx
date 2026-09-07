import { ArrowUpRight } from "lucide-react";

const categoryImages = {
    "Çanta": "/categories/canta.jpg",
    "Dış Giyim": "/categories/dis-giyim.jpg",
    "Ayakkabı": "/categories/ayakkabi.jpg",
    "Gözlük": "/categories/gozluk.jpg",
    "Makyaj": "/categories/makyaj.jpg",
    "Cilt Bakım": "/categories/cilt-bakim.jpg",
    "Elektronik": "/categories/elektronik.jpg",
    "Ev Dekorasyon": "/categories/ev-dekorasyon.jpg",
};

function CategoryCard({ category, onClick, compact = false }) {
    const image = categoryImages[category.name];

    return (
        <button
            onClick={() => onClick(category)}
            className={`
                group relative w-full overflow-hidden rounded-2xl
                bg-gradient-to-br from-gray-100 to-gray-200
                text-left transition duration-500
                hover:-translate-y-1 hover:shadow-2xl
                ${compact ? "aspect-[4/3]" : "aspect-[4/5]"}
            `}
        >
            {image && (
                <img
                    src={image}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            )}

            <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/15" />

            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

            <div
                className={`
                    absolute bottom-4 left-4 right-4
                    flex items-end justify-between text-white
                    ${compact ? "sm:bottom-4 sm:left-4" : "sm:bottom-5 sm:left-5"}
                `}
            >
                <div>
                    <span
                        className={`
                            font-semibold drop-shadow-md
                            ${compact ? "text-base sm:text-lg" : "text-xl"}
                        `}
                    >
                        {category.name}
                    </span>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/65">
                        Keşfet →
                    </p>
                </div>

                <span
                    className="
                        flex h-8 w-8 shrink-0 items-center justify-center
                        rounded-full bg-white/90 text-black
                        transition duration-300
                        group-hover:translate-x-1
                    "
                >
                    <ArrowUpRight size={16} />
                </span>
            </div>
        </button>
    );
}

export default CategoryCard;