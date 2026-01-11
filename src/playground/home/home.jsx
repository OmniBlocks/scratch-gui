import React from 'react';
import PropTypes from 'prop-types';
import render from '../app-target.js';

import {APP_NAMES} from '../../lib/brand';

const APP_NAME = APP_NAMES.PROJECT;
import {applyGuiColors} from '../../lib/themes/guiHelpers.js';
import {detectTheme} from '../../lib/themes/themePersistance.js';
import styles from '../info.css';
import localStyles from './home.css';
import Header from '../ws-components/header/header.jsx';
/* eslint-disable react/jsx-no-literals */

applyGuiColors(detectTheme());
document.documentElement.lang = 'en';

const IDE_CARDS = [
    {
        title: 'Visual IDE',
        href: 'editor.html',
        desc: 'A Scratch mod with text-based programming support!'
    },
    {
        title: 'PyVisual',
        href: null,
        desc: 'Write Python code in blocks!',
        coming: true
    },
    {
        title: 'OmniPython',
        href: null,
        desc: 'An advanced Python IDE right in your browser.',
        coming: true
    },
    {
        title: 'And more...',
        href: null,
        desc: 'IDEs for C and more!',
        coming: true
    }
];

const Credits = () => (
    <>
        <Header />
        <main className={styles.main}>
            <header className={styles.headerContainer}>
                <h1 className={styles.headerText}>{APP_NAME}</h1>
                <p className={styles.headerText}>{APP_NAME} is a project to develop simple IDEs for programming in the browser.</p>
            </header>

            <section>
                <h2>Current IDEs</h2>

                <div className={localStyles.grid}>
                    {IDE_CARDS.map(ide => (
                        <article
                            className={localStyles.card}
                            key={ide.title}
                        >
                            <h3 className={localStyles.cardTitle}>
                                {ide.title}
                                {ide.coming ? <span className={localStyles.coming}> — Coming soon</span> : null}
                            </h3>
                            <p className={localStyles.cardDesc}>{ide.desc}</p>
                            {ide.href ? (
                                <a
                                    className={localStyles.cardLink}
                                    href={ide.href}
                                >Open</a>
                            ) : null}
                        </article>
                    ))}
                </div>
            </section>

            <section>
                <h2>{APP_NAME} is free software under the AGPL 3.0 license</h2>
                <p>
                    You can view the source code on <a href="https://github.com/OmniBlocks/scratch-gui">GitHub</a>.
                </p>
            </section>
        </main>
    </>
);

render(<Credits />);
