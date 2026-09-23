
import './loading.css';
import { Sparkles } from 'lucide-react';

export default function Loading() {
    return (
        <main className="app-loading">
            {/* Animated background */}
            <div className="loading-orb loading-orb-1"></div>
            <div className="loading-orb loading-orb-2"></div>

            <div className="loading-content">

                {/* Logo / Loader */}
                <div className="loader-container">

                    <div className="loader-circle loader-circle-1"></div>
                    <div className="loader-circle loader-circle-2"></div>
                    <div className="loader-circle loader-circle-3"></div>

                    <div className="loader-logo">
                        <Sparkles size={32} strokeWidth={1.8} />
                    </div>

                </div>

                {/* Text */}
                <div className="loading-text">
                    <h2>
                        Loading
                        <span className="loading-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </span>
                    </h2>

                    <p>
                        Please wait while we prepare everything for you.
                    </p>
                </div>

                {/* Progress */}
                <div className="loading-progress">
                    <div className="loading-progress-bar"></div>
                </div>

            </div>
        </main>
    );
}

