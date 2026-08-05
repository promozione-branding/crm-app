"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import ThemeProvider from "./ThemeProvider";
import { getMe } from "@/redux/user/userAuthSlice";
import { useEffect } from "react";

export default function Providers({ children }) {
    return (
        <Provider store={store}>

            <AuthLoader />

            <ThemeProvider>
                {children}
            </ThemeProvider>
        </Provider>
    );
}

function AuthLoader() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    return null;
}