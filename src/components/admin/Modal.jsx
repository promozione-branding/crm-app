"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function Header({ children, onClose }) {
    return (
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-3">
            <h2 className="text-lg font-semibold">{children}</h2>

            <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-100"
            >
                <X size={20} />
            </button>
        </div>
    );
}

function Body({ children }) {
    return (
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
            {children}
        </div>
    );
}

function Footer({ children }) {
    return (
        <div className="flex justify-end gap-3 border-t border-gray-300 bg-gray-50 px-6 py-3">
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
    };

    useEffect(() => {
        function handleClick(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClick);
        }

        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen, onClose]);

    useEffect(() => {
        function handleKey(e) {
            if (e.key === "Escape") onClose();
        }

        if (isOpen) {
            document.addEventListener("keydown", handleKey);
        }

        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    const content = Array.isArray(children) ? children : [children];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        ref={modalRef}
                        className={`w-full ${sizes[size]} overflow-hidden rounded-2xl bg-white shadow-2xl text-gray-800 `}
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    >
                        {content.map((child, index) => {
                            if (!child) return null;

                            if (child.type === Header) {
                                return (
                                    <Header key={index} onClose={onClose}>
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