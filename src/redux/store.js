import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./admin/adminAuthSlice";
import userAuthReducer from "./user/userAuthSlice";


export const store = configureStore({
    reducer: {
        adminAuth: adminAuthReducer,
        userAuth: userAuthReducer,
    },
});