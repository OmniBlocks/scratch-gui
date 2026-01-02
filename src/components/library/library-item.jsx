import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './library-item.css';

const LibraryItem = props => (
    <div
        className={classNames(styles.libraryItem, {
            [styles.featured]: props.featured,
            [styles.disabled]: props.disabled
        })}
        onClick={props.disabled ? null : props.onSelect}
    >
        <div className={styles.libraryItemImageContainer}>
            {props.icons ? (
                <img
                    className={styles.libraryItemImage}
                    src={props.icons}
                    alt={props.name}
                />
            ) : (
                <div className={styles.libraryItemImagePlaceholder}>
                    {props.name.charAt(0)}
                </div>
            )}
            {props.featured && (
                <div className={styles.featuredBanner}>
                    Featured
                </div>
            )}
        </div>
        <div className={styles.libraryItemDetails}>
            <div className={styles.libraryItemName}>
                {props.name}
            </div>
            {props.description && (
                <div className={styles.libraryItemDescription}>
                    {props.description}
                </div>
            )}
            {props.collaborator && (
                <div className={styles.libraryItemCollaborator}>
                    by {props.collaborator}
                </div>
            )}
        </div>
    </div>
);

LibraryItem.propTypes = {
    bluetoothRequired: PropTypes.bool,
    collaborator: PropTypes.string,
    description: PropTypes.string,
    disabled: PropTypes.bool,
    extensionId: PropTypes.string,
    featured: PropTypes.bool,
    hidden: PropTypes.bool,
    iconMd5: PropTypes.string,
    iconRawURL: PropTypes.string,
    icons: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    insetIconURL: PropTypes.string,
    internetConnectionRequired: PropTypes.bool,
    isRtl: PropTypes.bool,
    name: PropTypes.string.isRequired,
    showPlayButton: PropTypes.bool,
    onSelect: PropTypes.func.isRequired
};

LibraryItem.defaultProps = {
    bluetoothRequired: false,
    disabled: false,
    featured: false,
    hidden: false,
    internetConnectionRequired: false,
    isRtl: false,
    showPlayButton: false
};

export default LibraryItem;
