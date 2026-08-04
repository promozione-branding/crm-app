import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
        builder.addCase(userLogin.pending, (state) => {
            state.loading = true; state.error = null;
        }).addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false; state.user = action.payload.data; state.isAuthenticated = true;
        }).addCase(userLogin.rejected, (state, action) => {
            state.loading = false; state.error = action.payload;
        })
    }
});

export const { logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;