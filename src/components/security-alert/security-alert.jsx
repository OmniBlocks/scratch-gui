import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import styles from './security-alert.css';

/**
 * Security Alert Component
 * Shows security warnings and notifications to users
 */
class SecurityAlert extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isVisible: true
        };
        
        this.handleClose = this.handleClose.bind(this);
        this.handleAction = this.handleAction.bind(this);
    }
    
    componentDidMount () {
        // Auto-hide after specified duration
        if (this.props.autoHide && this.props.duration) {
            this.hideTimer = setTimeout(() => {
                this.handleClose();
            }, this.props.duration);
        }
    }
    
    componentWillUnmount () {
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
        }
    }
    
    handleClose () {
        this.setState({isVisible: false});
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    
    handleAction () {
        if (this.props.onAction) {
            this.props.onAction();
        }
        this.handleClose();
    }
    
    render () {
        if (!this.state.isVisible) {
            return null;
        }
        
        const {type, title, message, actionText} = this.props;
        
        return (
            <div className={`${styles.securityAlert} ${styles[type]}`}>
                <div className={styles.content}>
                    <div className={styles.icon}>⚠️</div>
                    <div className={styles.text}>
                        <div className={styles.title}>{title}</div>
                        <div className={styles.message}>{message}</div>
                    </div>
                    <div className={styles.actions}>
                        {actionText && (
                            <button
                                className={styles.actionButton}
                                onClick={this.handleAction}
                            >
                                {actionText}
                            </button>
                        )}
                        <button
                            className={styles.closeButton}
                            onClick={this.handleClose}
                        >
                            ×
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

SecurityAlert.propTypes = {
    type: PropTypes.oneOf(['warning', 'error', 'info']),
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    actionText: PropTypes.string,
    autoHide: PropTypes.bool,
    duration: PropTypes.number,
    onClose: PropTypes.func,
    onAction: PropTypes.func
};

SecurityAlert.defaultProps = {
    type: 'warning',
    autoHide: false,
    duration: 5000
};

export default SecurityAlert;
