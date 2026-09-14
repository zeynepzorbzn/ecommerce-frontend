import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";

let sessionExpirationHandled = false;

export const handleSessionExpired = () => {
    if (sessionExpirationHandled) {
        return;
    }

    sessionExpirationHandled = true;

    store.dispatch(logout());
    sessionStorage.setItem("sessionExpired", "true");
    window.location.assign("/login");
};
