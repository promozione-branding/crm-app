"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function Header({ children, onClose }) {
    return (
        <div className="flex items-center justify-between border-b border-app px-6 py-4 bg-surface">
            <h2 className="text-lg font-semibold text-app">
                {children}
            </h2>

            <button
                onClick={onClose}
                className="rounded-lg p-2 hover-app text-app transition"
            >
                <X size={18} />
            </button>
        </div>
    );
}

function Body({ children }) {
    return (
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto bg-surface text-app">
            {children}
        </div>
    );
}

function Footer({ children }) {
    return (
        <div className="flex justify-end items-center gap-3 border-t border-app bg-surface px-6 py-4">
            {children}
        </div>
    );
}

export default function Modal({
    isOpen,
    onClose,
    children,
    size = "md",
}) {
    const modalRef = useRef(null);

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-6xl",
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKey);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const content = Array.isArray(children) ? children : [children];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    onMouseDown={handleBackdropClick}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        ref={modalRef}
                        className={`w-full ${sizes[size]} rounded-2xl border border-app bg-surface shadow-2xl overflow-hidden`}
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                    >
                        {content.map((child, index) => {
                            if (!child) return null;

                            if (child.type === Header) {
                                return (
                                    <Header
                                        key={index}
                                        onClose={onClose}
                                    >
                                        {child.props.children}
                                    </Header>
                                );
                            }

                            return child;
                        })}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;