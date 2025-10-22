/**
 * Sample Projects Page Component
 */

import React, {useState} from 'react';
import {APP_NAME} from '../lib/brand.js';
import ObFooter from './ob-footer.jsx';
import styles from './landing-page.css';

const SampleProjectsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const sampleProjects = [
        {
            id: 1,
            title: "3D Platformer Engine",
            description: "Advanced 3D platformer with physics, collision detection, and dynamic lighting systems",
            category: "game",
            difficulty: "Advanced",
            thumbnail: "🎮",
            projectUrl: "./editor.html?project=3d-platformer"
        },
        {
            id: 2,
            title: "Neural Network Visualizer",
            description: "Interactive machine learning visualization with real-time training and backpropagation",
            category: "simulation",
            difficulty: "Expert",
            thumbnail: "🧠",
            projectUrl: "./editor.html?project=neural-network"
        },
        {
            id: 3,
            title: "Procedural Music Generator",
            description: "AI-powered music composition with multiple instruments and dynamic arrangement",
            category: "music",
            difficulty: "Advanced",
            thumbnail: "🎵",
            projectUrl: "./editor.html?project=music-generator"
        },
        {
            id: 4,
            title: "Physics Sandbox",
            description: "Real-time physics simulation with fluid dynamics, particle systems, and soft body physics",
            category: "simulation",
            difficulty: "Expert",
            thumbnail: "⚛️",
            projectUrl: "./editor.html?project=physics-sandbox"
        },
        {
            id: 5,
            title: "Multiplayer Battle Arena",
            description: "Real-time multiplayer game with networking, matchmaking, and competitive ranking",
            category: "game",
            difficulty: "Expert",
            thumbnail: "⚔️",
            projectUrl: "./editor.html?project=battle-arena"
        },
        {
            id: 6,
            title: "Ray Tracer Renderer",
            description: "Advanced 3D rendering engine with ray tracing, global illumination, and material shaders",
            category: "graphics",
            difficulty: "Expert",
            thumbnail: "🌟",
            projectUrl: "./editor.html?project=ray-tracer"
        },
        {
            id: 7,
            title: "Blockchain Simulator",
            description: "Cryptocurrency and blockchain technology demonstration with mining and transactions",
            category: "simulation",
            difficulty: "Advanced",
            thumbnail: "⛓️",
            projectUrl: "./editor.html?project=blockchain-sim"
        },
        {
            id: 8,
            title: "Advanced Animation Studio",
            description: "Professional-grade animation tools with keyframes, tweening, and bone rigging",
            category: "animation",
            difficulty: "Advanced",
            thumbnail: "🎬",
            projectUrl: "./editor.html?project=animation-studio"
        },
        {
            id: 9,
            title: "Compiler & Interpreter",
            description: "Build your own programming language with lexer, parser, and runtime execution",
            category: "programming",
            difficulty: "Expert",
            thumbnail: "🔧",
            projectUrl: "./editor.html?project=compiler"
        },
        {
            id: 10,
            title: "Virtual Reality Experience",
            description: "Immersive VR environment with spatial audio, hand tracking, and haptic feedback",
            category: "vr",
            difficulty: "Expert",
            thumbnail: "🥽",
            projectUrl: "./editor.html?project=vr-experience"
        }
    ];

    const categories = [
        { id: 'all', name: 'All Projects' },
        { id: 'game', name: 'Games' },
        { id: 'simulation', name: 'Simulations' },
        { id: 'music', name: 'Music' },
        { id: 'graphics', name: 'Graphics' },
        { id: 'animation', name: 'Animations' },
        { id: 'programming', name: 'Programming' },
        { id: 'vr', name: 'Virtual Reality' }
    ];

    const filteredProjects = selectedCategory === 'all' 
        ? sampleProjects 
        : sampleProjects.filter(project => project.category === selectedCategory);

    const handleBackToHome = () => {
        window.location.href = './index.html';
    };

    const handleOpenProject = (projectUrl) => {
        window.location.href = projectUrl;
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return '#4CAF50';
            case 'Intermediate': return '#FF9800';
            case 'Advanced': return '#F44336';
            case 'Expert': return '#9C27B0';
            default: return '#757575';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sampleProjectsPage}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <button 
                            className={styles.backButton}
                            onClick={handleBackToHome}
                        >
                            ← Back to Home
                        </button>
                        <h1 className={styles.title}>Sample Projects</h1>
                        <p className={styles.subtitle}>
                            Explore these example projects to get inspired and learn new techniques
                        </p>
                    </div>
                </header>

                <main className={styles.main}>
                    <section className={styles.filters}>
                        <h2>Filter by Category</h2>
                        <div className={styles.categoryButtons}>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`${styles.categoryButton} ${
                                        selectedCategory === category.id ? styles.active : ''
                                    }`}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className={styles.projectGrid}>
                        {filteredProjects.map(project => (
                            <div key={project.id} className={styles.projectCard}>
                                <div className={styles.projectThumbnail}>
                                    <span className={styles.thumbnailEmoji}>
                                        {project.thumbnail}
                                    </span>
                                </div>
                                <div className={styles.projectInfo}>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <p className={styles.projectDescription}>
                                        {project.description}
                                    </p>
                                    <div className={styles.projectMeta}>
                                        <span 
                                            className={styles.difficulty}
                                            style={{ color: getDifficultyColor(project.difficulty) }}
                                        >
                                            {project.difficulty}
                                        </span>
                                        <span className={styles.category}>
                                            {project.category}
                                        </span>
                                    </div>
                                    <button
                                        className={styles.openProjectButton}
                                        onClick={() => handleOpenProject(project.projectUrl)}
                                    >
                                        Open Project
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    {filteredProjects.length === 0 && (
                        <div className={styles.noProjects}>
                            <p>No projects found in this category.</p>
                        </div>
                    )}

                    <section className={styles.createOwn}>
                        <h2>Ready to Create Your Own?</h2>
                        <p>Start building your own amazing project from scratch</p>
                        <button 
                            className={styles.primaryButton}
                            onClick={() => window.location.href = './editor.html'}
                        >
                            Create New Project
                        </button>
                    </section>
                </main>

                <ObFooter message="Empowering creativity through code." />
            </div>
        </div>
    );
};

export default SampleProjectsPage;