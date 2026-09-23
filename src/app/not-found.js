
'use client';

import Link from 'next/link';
import { ArrowLeft, LogIn, Search } from 'lucide-react';
import './not-found.css';

export default function NotFound() {
    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/login';
        }
    };

    return (
        <main className="not-found-page">

            {/* Background decorations */}
            <div className="nf-bg nf-bg-one"></div>
            <div className="nf-bg nf-bg-two"></div>

            <div className="nf-grid"></div>

            <div className="not-found-content">

                {/* Illustration */}
                <div className="nf-illustration">

                    <div className="nf-circle nf-circle-outer"></div>
                    <div className="nf-circle nf-circle-middle"></div>

                    <div className="nf-circle nf-circle-inner">
                        <Search
                            size={48}
                            strokeWidth={1.5}
                        />
                    </div>

                    {/* Floating dots */}
                    <span className="nf-dot nf-dot-one"></span>
                    <span className="nf-dot nf-dot-two"></span>
                    <span className="nf-dot nf-dot-three"></span>

                </div>

                {/* 404 */}
                <div className="nf-number">
                    404
                </div>

                {/* Heading */}
                <h1 className="nf-title">
                    Page not found
                </h1>

                {/* Description */}
                <p className="nf-description">
                    The page you're looking for doesn't exist, has been
                    moved, or the URL may be incorrect.
                </p>

                {/* Actions */}
                <div className="nf-actions">

                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="nf-btn nf-btn-secondary"
                    >
                        <ArrowLeft size={18} />
                        <span>Go Back</span>
                    </button>

                    <Link
                        href="/login"
                        className="nf-btn nf-btn-primary"
                    >
                        <LogIn size={18} />
                        <span>Go to Login</span>
                    </Link>

                </div>

                {/* Bottom message */}
                <div className="nf-error-code">
                    <span className="nf-error-dot"></span>
                    Error 404 · Page unavailable
                </div>

            </div>
        </main>
    );
}

