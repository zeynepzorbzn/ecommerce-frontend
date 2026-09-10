import axios from "axios";

const FILE_SERVICE_URL =
    import.meta.env.VITE_FILE_SERVICE_URL ||
    "http://localhost:8001/api/v1";

export const uploadFile = async (file) => {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(
            `${FILE_SERVICE_URL}/upload`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        if (error.response?.status === 401 && token) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("roleName");
            sessionStorage.setItem("sessionExpired", "true");
            window.location.assign("/login");
        }

        throw error;
    }
};
