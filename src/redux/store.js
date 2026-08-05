import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./admin/adminAuthSlice";
import userAuthReducer from "./user/userAuthSlice";
import themeReducer from "./user/themeSlice";


export const store = configureStore({
    reducer: {
        adminAuth: adminAuthReducer,
        userAuth: userAuthReducer,
        theme: themeReducer,
    },
});