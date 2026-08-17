function CategoryCard({ category, onClick }) {
    return (
        <button
            onClick={() => onClick(category)}
            className="group flex aspect-square items-center justify-center bg-gray-100 transition hover:bg-gray-200"
        >
            <span className="text-lg font-medium transition-transform group-hover:scale-105">
                {category}
            </span>
        </button>
    );
}

export default CategoryCard;