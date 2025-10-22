/**
 * Landing Page Component
 */

import React from 'react';
import {APP_NAME} from '../lib/brand.js';
import styles from './interface.css';

const LandingPage = () => {
    const handleGetStarted = () => {
        window.location.href = './editor.html';
    };

    const handleViewSamples = () => {
        window.location.href = './sample-projects.html';
    };

    return (
        <div className={styles.container}>
            <div className={styles.landingPage}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{APP_NAME}</h1>
                    <p className={styles.subtitle}>
                        The Ultimate MultiLanguage IDE - Create, Code, and Share Your Projects
                    </p>
                </header>

                <main className={styles.main}>
                    <section className={styles.hero}>
                        <div className={styles.heroContent}>
                            <h2>Build Amazing Projects</h2>
                            <p>
                                {APP_NAME} is a powerful, modern development environment that makes 
                                coding accessible and fun. Whether you're a beginner or an expert, 
                                our intuitive interface helps you bring your ideas to life.
                            </p>
                            <div className={styles.buttonGroup}>
                                <button 
                                    className={styles.primaryButton}
                                    onClick={handleGetStarted}
                                >
                                    Get Started
                                </button>
                                <button 
                                    className={styles.secondaryButton}
                                    onClick={handleViewSamples}
                                >
                                    View Sample Projects
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className={styles.features}>
                        <h2>Features</h2>
                        <div className={styles.featureGrid}>
                            <div className={styles.featureCard}>
                                <h3>🚀 Fast Performance</h3>
                                <p>Optimized compiler for lightning-fast project execution</p>
                            </div>
                            <div className={styles.featureCard}>
                                <h3>🎨 Modern Interface</h3>
                                <p>Clean, intuitive design with dark mode support</p>
                            </div>
                            <div className={styles.featureCard}>
                                <h3>🔧 Powerful Tools</h3>
                                <p>Advanced editing features and debugging capabilities</p>
                            </div>
                            <div className={styles.featureCard}>
                                <h3>🌐 Cross-Platform</h3>
                                <p>Works seamlessly across all devices and browsers</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.getStarted}>
                        <h2>Ready to Start Creating?</h2>
                        <p>Join thousands of creators building amazing projects with {APP_NAME}</p>
                        <button 
                            className={styles.primaryButton}
                            onClick={handleGetStarted}
                        >
                            Launch Editor
                        </button>
                    </section>
                </main>

                <footer className={styles.footer}>
                    <p>&copy; 2024 {APP_NAME}. Built with ❤️ for creators everywhere.</p>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;