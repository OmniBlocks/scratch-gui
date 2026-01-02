import React from 'react';
import styles from './spinner.css';

const Loading = () => (
    <div className={styles.container}>
        <div className={styles.spinnerWrapper}>
            <div className={styles.spinnerOuter} />
            <div className={styles.spinnerMiddle} />
            <div className={styles.spinnerInner} />
            <div className={styles.spinnerCore} />
        </div>
    </div>
);

export default Loading;
