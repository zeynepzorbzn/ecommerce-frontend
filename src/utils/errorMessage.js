export const getErrorMessage = (error, fallback = "İşlem sırasında bir hata oluştu.") => {
    if (!error) {
        return fallback;
    }

    const graphQLErrors =
        error?.graphQLErrors ??
        error?.errors ??
        error?.cause?.errors ??
        [];

    const graphQLMessage = graphQLErrors
        .map((item) => item?.message)
        .find(Boolean);

    const message = graphQLMessage || error?.message;

    if (!message) {
        return fallback;
    }

    const normalized = message.toLowerCase();

    if (
        normalized.includes("not enough permissions") ||
        normalized.includes("access denied") ||
        normalized.includes("forbidden")
    ) {
        return "Bu işlem için yetkiniz bulunmuyor.";
    }

    if (
        normalized.includes("validation") ||
        normalized.includes("invalid input")
    ) {
        return "Girdiğiniz bilgileri kontrol edip tekrar deneyin.";
    }

    if (
        normalized.includes("stock") ||
        normalized.includes("stok")
    ) {
        return "Ürünün stok bilgisi değişmiş olabilir. Lütfen tekrar deneyin.";
    }

    if (
        normalized.includes("network error") ||
        normalized.includes("failed to fetch")
    ) {
        return "Sunucuya ulaşılamadı. Lütfen internet bağlantınızı ve servisin çalıştığını kontrol edin.";
    }

    if (
        normalized.includes("internal server error") ||
        normalized.includes("internal error")
    ) {
        return "Sunucu tarafında beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }

    return message;
};
