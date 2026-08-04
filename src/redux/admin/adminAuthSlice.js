import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const adminLogin = createAsyncThunk("admin/login", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post("/api/admin/auth/login", data, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState: {
        admin: null,
        loading: false,
        error: null,
        isAuthenticated: false
    },

    reducers: {
        logout: (state) => { state.admin = null; state.isAuthenticated = false; }
    },

    extraReducers: (builder) => {
        builder.addCase(adminLogin.pending, (state) => {
            state.loading = true; state.error = null;
        }).addCase(adminLogin.fulfilled, (state, action) => {
            state.loading = false; state.admin = action.payload.data; state.isAuthenticated = true;
        }).addCase(adminLogin.rejected, (state, action) => {
            state.loading = false; state.error = action.payload;
        })
    }
});

export const { logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;