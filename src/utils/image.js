import axios from "axios";

const FILE_SERVICE_URL =
    import.meta.env.VITE_FILE_SERVICE_URL ||
    "http://localhost:8001/api/v1";

/*
 * =========================================================
 * PRODUCT IMAGE CACHE
 * =========================================================
 *
 * imageToken -> browser object URL
 *
 * Object URL'lerin sahibi bu modüldür. Component'ler bu URL'leri
 * revoke etmez. Böylece aynı görsel farklı sayfalarda/component'lerde
 * güvenle tekrar kullanılabilir.
 *
 * Cache yalnızca uygulama yaşam döngüsü boyunca bellekte tutulur.
 * clearProductImageCache() çağrıldığında URL'ler merkezi olarak
 * revoke edilir.
 */
const imageUrlCache = new Map();

/*
 * Aynı imageToken için aynı anda birden fazla HTTP isteği oluşmasını
 * engeller.
 *
 * imageToken -> Promise<string | null>
 */
const imageRequestCache = new Map();
let cacheVersion = 0;

const isValidImageBlob = (blob) =>
    blob instanceof Blob &&
    blob.size > 0 &&
    (!blob.type || blob.type.startsWith("image/"));

/**
 * File Service'den ürün görselini getirir.
 *
 * Akış:
 * 1. Cache'de varsa mevcut object URL döner.
 * 2. Aynı görsel yükleniyorsa mevcut Promise beklenir.
 * 3. Yoksa File Service'den Blob alınır ve object URL oluşturulur.
 * 4. URL merkezi cache'e alınır.
 *
 * Component'ler URL.revokeObjectURL() çağırmamalıdır.
 */
export const getProductImage = async (imageToken, accessToken) => {
    if (!imageToken || !accessToken) {
        return null;
    }

    const cachedUrl = imageUrlCache.get(imageToken);

    if (cachedUrl) {
        return cachedUrl;
    }

    const pendingRequest = imageRequestCache.get(imageToken);

    if (pendingRequest) {
        return pendingRequest;
    }

    const requestVersion = cacheVersion;

    const request = axios
        .get(
            `${FILE_SERVICE_URL}/download/${encodeURIComponent(imageToken)}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: "blob",
            }
        )
        .then((response) => {
            const blob = response.data;

            if (!isValidImageBlob(blob)) {
                throw new Error("File Service geçerli bir görsel döndürmedi.");
            }

            const objectUrl = URL.createObjectURL(blob);

            if (requestVersion !== cacheVersion) {
                URL.revokeObjectURL(objectUrl);
                return null;
            }

            imageUrlCache.set(imageToken, objectUrl);

            return objectUrl;
        })
        .catch((error) => {
            console.error(
                "FILE SERVICE IMAGE ERROR:",
                {
                    imageToken,
                    status: error.response?.status,
                    message: error.message,
                }
            );

            return null;
        })
        .finally(() => {
            imageRequestCache.delete(imageToken);
        });

    imageRequestCache.set(imageToken, request);

    return request;
};

/**
 * Merkezi image cache'i temizler.
 *
 * Logout, kullanıcı değişimi veya uygulamanın bilinçli bir şekilde
 * image cache'i sıfırlaması gereken durumlarda kullanılabilir.
 */
export const clearProductImageCache = () => {
    cacheVersion += 1;

    imageUrlCache.forEach((url) => {
        URL.revokeObjectURL(url);
    });

    imageUrlCache.clear();
    imageRequestCache.clear();
};
