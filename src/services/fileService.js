import axios from "axios";

const FILE_SERVICE_URL =
    import.meta.env.VITE_FILE_SERVICE_URL ||
    "http://localhost:8001/api/v1";

export const uploadFile = async (file) => {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("file", file);

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
};
