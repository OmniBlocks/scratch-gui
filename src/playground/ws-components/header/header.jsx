import React from 'react';
import styles from './header.css';
import logo from './costume1.svg';
import { APP_NAMES } from '../../../lib/brand';

const APP_NAME = APP_NAMES.PROJECT;
const Header = () => {
    return (
        <><header className={styles.header}>
            <a href="/" className={styles.headerLogo}>
                <img src={logo} alt="OmniBlocks Logo" width="35" height="35" />{APP_NAME}
            </a>
            <a href="/credits.html" className={styles.headerLink}>
                Credits
            </a>
        </header><div className={styles.headerSpacingHack} /></>
    );
};

export default Header;