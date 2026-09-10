const FAVORITES_KEY = "zeyz_favorites";

export function getFavoriteIds() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    } catch {
        return [];
    }
}

export function isFavorite(productId) {
    return getFavoriteIds().includes(String(productId));
}

export function toggleFavorite(productId) {
    const id = String(productId);
    const favorites = getFavoriteIds();
    const next = favorites.includes(id)
        ? favorites.filter((favoriteId) => favoriteId !== id)
        : [...favorites, id];

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("favoritesChanged"));
    return next.includes(id);
}
