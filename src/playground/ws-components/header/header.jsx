import React from 'react';
import styles from './header.css';
import logo from './costume1.svg';

const Header = () => {
    return (
        <><header className={styles.header}>
            <a href="/" className={styles.headerLogo}>
                <img src={logo} alt="OmniBlocks Logo" width="35" height="35" />OmniBlocks
            </a>
            <a href="/credits.html" className={styles.headerLink}>
                Credits
            </a>
        </header><div className={styles.headerSpacingHack} /></>
    );
};

export default Header;