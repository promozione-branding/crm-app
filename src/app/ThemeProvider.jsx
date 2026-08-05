"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/redux/user/themeSlice";

export default function ThemeProvider({ children }) {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.mode);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "dark";
        dispatch(setTheme(savedTheme));
        setMounted(true);
    }, [dispatch]);

    useEffect(() => {
        if (!mounted) return;

        localStorage.setItem("theme", theme);

        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme, mounted]);

    if (!mounted) return null;

    return children;
}