import toast from "react-hot-toast";
import { getErrorMessage } from "./errorMessage";

export const showSuccess = (message) => {
    toast.success(message);
};

export const showError = (error, fallback) => {
    toast.error(getErrorMessage(error, fallback));
};

export const showInfo = (message) => {
    toast(message);
};
