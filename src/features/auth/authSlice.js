import { createSlice } from "@reduxjs/toolkit";

const savedAccessToken = localStorage.getItem("accessToken");
const savedRefreshToken = localStorage.getItem("refreshToken");
const initialState = {
    accessToken: savedAccessToken,
    refreshToken: savedRefreshToken,
    isAuthenticated: !!savedAccessToken,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        login: (state, action) => {
            const { accessToken, refreshToken } = action.payload;

            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
        },

        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;