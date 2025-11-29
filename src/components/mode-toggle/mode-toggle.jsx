import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

import styles from './mode-toggle.css';
import nanoscriptIcon from '../gui/icon--nanoscript.svg';
import codeIcon from '!../../lib/tw-recolor/build!../gui/icon--code.svg';

const ModeToggle = ({
    isOmniScriptMode,
    onToggleMode
}) => (
    <div className={styles.toggleContainer}>
        <button
            className={classNames(styles.toggleButton, {
                [styles.active]: !isOmniScriptMode
            })}
            onClick={() => onToggleMode(false)}
        >
            <img
                className={styles.toggleIcon}
                draggable={false}
                src={codeIcon()}
            />
            <FormattedMessage
                defaultMessage="Classic"
                description="Button to switch to classic blocks mode"
                id="gui.modeToggle.classic"
            />
        </button>
        <button
            className={classNames(styles.toggleButton, {
                [styles.active]: isOmniScriptMode
            })}
            onClick={() => onToggleMode(true)}
        >
            <img
                className={styles.toggleIcon}
                draggable={false}
                src={nanoscriptIcon}
            />
            <FormattedMessage
                defaultMessage="OmniScript"
                description="Button to switch to OmniScript text mode"
                id="gui.modeToggle.omniscript"
            />
        </button>
    </div>
);

ModeToggle.propTypes = {
    isOmniScriptMode: PropTypes.bool.isRequired,
    onToggleMode: PropTypes.func.isRequired
};

export default ModeToggle;
