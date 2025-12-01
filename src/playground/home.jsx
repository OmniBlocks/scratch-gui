import React from 'react';
import PropTypes from 'prop-types';
import render from './app-target';

import {APP_NAME} from '../lib/brand';
import {applyGuiColors} from '../lib/themes/guiHelpers';
import {detectTheme} from '../lib/themes/themePersistance';
import styles from './credits/credits.css';
/* eslint-disable react/jsx-no-literals */

applyGuiColors(detectTheme());
document.documentElement.lang = 'en';

const Credits = () => (
    <main className={styles.main}>
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                {APP_NAME}
            </h1>
        </header>
        <section>
            <p>OmniBlocks is a group of IDEs for easy programming online.</p>
<ul>
    <li><a href="editor.html">S-Program</a> - A Scratch-style environment that also includes NanoScript, a text language that maps to Scratch blocks, as well as an advanced music composer!</li>
    <li>PyS (Coming soon) - Python in Blocks!</li>
    <li>Python (Coming soon) - Run Python in the browser.</li>
    
</ul>
</section>
    </main>
);

render(<Credits />);
