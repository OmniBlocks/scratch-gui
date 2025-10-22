/**
 * Reusable Footer Component
 */

import React from 'react';
import {APP_NAME} from '../lib/brand.js';
import styles from './landing-page.css';

const ObFooter = ({message}) => {
    const defaultMessage = `Built with ❤️ for creators everywhere.`;
    
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} {APP_NAME}. {message || defaultMessage}</p>
        </footer>
    );
};

export default ObFooter;