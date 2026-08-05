import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getMe = createAsyncThunk("user/me", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get("/api/user/auth/me", { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Unauthorized");
    }
});

export const userLogin = createAsyncThunk("user/login", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post("/api/user/auth/login", data, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

const userAuthSlice = createSlice({
    name: "userAuth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
    },

    reducers: {
        logout: (state) => { state.user = null; state.isAuthenticated = false; }
    },

    extraReducers: (builder) => {
        // LOGIN
        builder.addCase(userLogin.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
            state.isAuthenticated = true;
        });

        builder.addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // GET ME
        builder.addCase(getMe.pending, (state) => { state.loading = true; });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
            state.isAuthenticated = true;
        });

        builder.addCase(getMe.rejected, (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        });
    }
});

export const { logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;