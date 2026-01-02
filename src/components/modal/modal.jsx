import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './modal.css';

const Modal = props => {
    const {
        className,
        fullScreen,
        id,
        onRequestClose,
        children,
        ...componentProps
    } = props;

    return (
        <div
            className={classNames(styles.modalOverlay, {
                [styles.fullScreen]: fullScreen
            })}
            onClick={onRequestClose}
        >
            <div
                className={classNames(styles.modal, className, {
                    [styles.fullScreenModal]: fullScreen
                })}
                id={id}
                onClick={e => e.stopPropagation()}
                {...componentProps}
            >
                {onRequestClose && (
                    <button
                        className={styles.closeButton}
                        onClick={onRequestClose}
                    >
                        ×
                    </button>
                )}
                {children}
            </div>
        </div>
    );
};

Modal.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    fullScreen: PropTypes.bool,
    id: PropTypes.string,
    onRequestClose: PropTypes.func
};

Modal.defaultProps = {
    fullScreen: false
};

export default Modal;
