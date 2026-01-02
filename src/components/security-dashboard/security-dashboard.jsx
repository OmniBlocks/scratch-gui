import React from 'react';
import PropTypes from 'prop-types';
import {getSecurityStats} from '../../lib/security-monitor';

import styles from './security-dashboard.css';

/**
 * Security Dashboard Component
 * Displays security statistics and recent events for administrators
 */
class SecurityDashboard extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            stats: null,
            isVisible: false
        };
        
        this.updateStats = this.updateStats.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }
    
    componentDidMount () {
        this.updateStats();
        // Update stats every 30 seconds
        this.statsInterval = setInterval(this.updateStats, 30000);
        
        // Listen for keyboard shortcut to show dashboard (Ctrl+Shift+S)
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    componentWillUnmount () {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    handleKeyDown (event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            event.preventDefault();
            this.toggleVisibility();
        }
    }
    
    updateStats () {
        const stats = getSecurityStats();
        this.setState({stats});
    }
    
    toggleVisibility () {
        this.setState(prevState => ({
            isVisible: !prevState.isVisible
        }));
    }
    
    render () {
        const {stats, isVisible} = this.state;
        
        if (!isVisible || !stats) {
            return null;
        }
        
        return (
            <div className={styles.securityDashboard}>
                <div className={styles.header}>
                    <h3>Security Dashboard</h3>
                    <button
                        className={styles.closeButton}
                        onClick={this.toggleVisibility}
                    >
                        ×
                    </button>
                </div>
                
                <div className={styles.content}>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{stats.totalEvents}</div>
                            <div className={styles.statLabel}>Total Events</div>
                        </div>
                        
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{stats.recentEvents}</div>
                            <div className={styles.statLabel}>Recent Events (1h)</div>
                        </div>
                        
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{stats.suspiciousUsers}</div>
                            <div className={styles.statLabel}>Suspicious Users</div>
                        </div>
                        
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{stats.highRiskUsers}</div>
                            <div className={styles.statLabel}>High Risk Users</div>
                        </div>
                    </div>
                    
                    <div className={styles.eventBreakdown}>
                        <h4>Event Breakdown (Last Hour)</h4>
                        {Object.entries(stats.eventCounts).map(([eventType, count]) => (
                            <div key={eventType} className={styles.eventRow}>
                                <span className={styles.eventType}>{eventType}</span>
                                <span className={styles.eventCount}>{count}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.instructions}>
                        <p><strong>Keyboard Shortcut:</strong> Ctrl+Shift+S to toggle this dashboard</p>
                        <p><em>This dashboard is only visible in development mode or for administrators.</em></p>
                    </div>
                </div>
            </div>
        );
    }
}

SecurityDashboard.propTypes = {};

export default SecurityDashboard;
