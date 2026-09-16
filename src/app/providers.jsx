"use client";

import { useEffect, useState } from "react";

import {
    Provider,
    useDispatch,
} from "react-redux";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { store } from "@/redux/store";

import ThemeProvider from "./ThemeProvider";

import {
    getMe,
} from "@/redux/user/userAuthSlice";

export default function Providers({
    children,
}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data remains fresh for 30 seconds
                        staleTime: 30 * 1000,

                        // Keep unused cached data for 5 minutes
                        gcTime: 5 * 60 * 1000,

                        // Refetch when user comes back to the tab
                        refetchOnWindowFocus: true,
                    },
                },
            })
    );

    return (
        <Provider store={store}>
            <QueryClientProvider
                client={queryClient}
            >
                <AuthLoader />

                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
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