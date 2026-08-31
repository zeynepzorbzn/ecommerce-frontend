import axios from "axios";
import { FILE_SERVICE_URL } from "../apollo/config";

export const getProductImage = async (imageToken, accessToken) => {

    if (!imageToken || !accessToken) {
        return null;
    }

    try {

        const response = await axios.get(
            `${FILE_SERVICE_URL}/download/${encodeURIComponent(imageToken)}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: "blob",
            }
        );

        return URL.createObjectURL(response.data);

    } catch (error) {

        console.error(
            "FILE SERVICE IMAGE ERROR:",
            error.response?.status,
            error.message
        );

        return null;
    }
};