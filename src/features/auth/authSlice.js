import { createSlice } from "@reduxjs/toolkit";
import { clearProductImageCache } from "../../utils/image.js";

const savedAccessToken = localStorage.getItem("accessToken");
const savedRefreshToken = localStorage.getItem("refreshToken");
const savedRoleName = localStorage.getItem("roleName");

const initialState = {
    accessToken: savedAccessToken,
    refreshToken: savedRefreshToken,
    roleName: savedRoleName,
    isAuthenticated: !!savedAccessToken,
};

const authSlice = createSlice({name: "auth",

    initialState,

    reducers: {
        login: (state, action) => {

            const {accessToken, refreshToken, roleName} = action.payload;

            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.roleName = roleName;
            state.isAuthenticated = true;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("roleName", roleName);
        },

        logout: (state) => {

            clearProductImageCache();

            state.accessToken = null;
            state.refreshToken = null;
            state.roleName = null;
            state.isAuthenticated = false;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("roleName");
        },
    },
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;