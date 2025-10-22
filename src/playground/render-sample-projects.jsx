/**
 * Sample Projects Page Component
 */

import React, {useState} from 'react';
import {APP_NAME} from '../lib/brand.js';
import styles from './interface.css';

const SampleProjectsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const sampleProjects = [
        {
            id: 1,
            title: "Animated Cat",
            description: "A simple animation featuring a walking cat sprite",
            category: "animation",
            difficulty: "Beginner",
            thumbnail: "🐱",
            projectUrl: "./editor.html?project=cat-animation"
        },
        {
            id: 2,
            title: "Pong Game",
            description: "Classic Pong game with paddle controls and scoring",
            category: "game",
            difficulty: "Intermediate",
            thumbnail: "🏓",
            projectUrl: "./editor.html?project=pong-game"
        },
        {
            id: 3,
            title: "Music Maker",
            description: "Create your own music with interactive instruments",
            category: "music",
            difficulty: "Beginner",
            thumbnail: "🎵",
            projectUrl: "./editor.html?project=music-maker"
        },
        {
            id: 4,
            title: "Maze Runner",
            description: "Navigate through a challenging maze puzzle",
            category: "game",
            difficulty: "Advanced",
            thumbnail: "🌀",
            projectUrl: "./editor.html?project=maze-runner"
        },
        {
            id: 5,
            title: "Digital Art Canvas",
            description: "Draw and create digital artwork with various tools",
            category: "art",
            difficulty: "Intermediate",
            thumbnail: "🎨",
            projectUrl: "./editor.html?project=art-canvas"
        },
        {
            id: 6,
            title: "Story Adventure",
            description: "Interactive storytelling with multiple choice paths",
            category: "story",
            difficulty: "Beginner",
            thumbnail: "📚",
            projectUrl: "./editor.html?project=story-adventure"
        }
    ];

    const categories = [
        { id: 'all', name: 'All Projects' },
        { id: 'game', name: 'Games' },
        { id: 'animation', name: 'Animations' },
        { id: 'music', name: 'Music' },
        { id: 'art', name: 'Art' },
        { id: 'story', name: 'Stories' }
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

                <footer className={styles.footer}>
                    <p>&copy; 2024 {APP_NAME}. Empowering creativity through code.</p>
                </footer>
            </div>
        </div>
    );
};

export default SampleProjectsPage;