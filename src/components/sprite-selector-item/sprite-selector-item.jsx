import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import DeleteButton from '../delete-button/delete-button.jsx';
import styles from './sprite-selector-item.css';
import {MenuButton, Menu} from '@szhsin/react-menu';
import {DangerousMenuItem, MenuItem} from '../context-menu/context-menu.jsx';
import {FormattedMessage} from 'react-intl';

const SpriteSelectorItem = props => {
    const hasContextMenu = props.onDuplicateButtonClick || props.onDeleteButtonClick || 
                          props.onExportButtonClick || props.onExportCostumesButtonClick || 
                          props.onRenameButtonClick;

    const itemContent = (
        <>
            {typeof props.number === 'undefined' ? null : (
                <div className={styles.number}>{props.number}</div>
            )}
            {props.costumeURL ? (
                <div className={styles.spriteImageOuter}>
                    <div className={styles.spriteImageInner}>
                        <img
                            className={styles.spriteImage}
                            draggable={false}
                            loading="lazy"
                            src={props.costumeURL}
                        />
                    </div>
                </div>
            ) : null}
            <div className={styles.spriteInfo}>
                <div className={styles.spriteName}>{props.name}</div>
                {props.details ? (
                    <div className={styles.spriteDetails}>{props.details}</div>
                ) : null}
            </div>
            {(props.selected && props.onDeleteButtonClick) ? (
                <DeleteButton
                    className={styles.deleteButton}
                    onClick={props.onDeleteButtonClick}
                />
            ) : null }
        </>
    );

    if (hasContextMenu && !props.preventContextMenu) {
        return (
            <MenuButton
                className={classNames(props.className, styles.spriteSelectorItem, {
                    [styles.isSelected]: props.selected
                })}
                onClick={props.onClick}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onMouseDown}
                ref={props.componentRef}
            >
                {itemContent}
                <Menu className={styles.contextMenu}>
                    {props.onDuplicateButtonClick ? (
                        <MenuItem onClick={props.onDuplicateButtonClick}>
                            <FormattedMessage
                                defaultMessage="duplicate"
                                description="Menu item to duplicate in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDuplicate"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onExportButtonClick ? (
                        <MenuItem onClick={props.onExportButtonClick}>
                            <FormattedMessage
                                defaultMessage="export"
                                description="Menu item to export the selected item"
                                id="gui.spriteSelectorItem.contextMenuExport"
                            />
                        </MenuItem>
                    ) : null }
                    {props.onRenameButtonClick ? (
                        <MenuItem onClick={props.onRenameButtonClick}>
                            <FormattedMessage
                                defaultMessage="rename"
                                description="Menu item to rename an item"
                                id="tw.spriteSelectorItem.rename"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onExportCostumesButtonClick ? (
                        <MenuItem onClick={props.onExportCostumesButtonClick}>
                            <FormattedMessage
                                defaultMessage="export costumes"
                                description="Menu item to export the costumes of the selected item"
                                id="ob.SpriteSelectorItem.exportCostumes"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onDeleteButtonClick ? (
                        <DangerousMenuItem onClick={props.onDeleteButtonClick}>
                            <FormattedMessage
                                defaultMessage="delete"
                                description="Menu item to delete in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDelete"
                            />
                        </DangerousMenuItem>
                    ) : null }
                </Menu>
            </MenuButton>
        );
    }

    return (
        <div
            className={classNames(props.className, styles.spriteSelectorItem, {
                [styles.isSelected]: props.selected
            })}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onMouseDown}
            ref={props.componentRef}
        >
            {itemContent}
        </div>
    );
};

SpriteSelectorItem.propTypes = {
    className: PropTypes.string,
    componentRef: PropTypes.func,
    costumeURL: PropTypes.string,
    details: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    name: PropTypes.any,
    number: PropTypes.number,
    onClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
    onDuplicateButtonClick: PropTypes.func,
    onExportButtonClick: PropTypes.func,
    onExportCostumesButtonClick: PropTypes.func,
    onRenameButtonClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    preventContextMenu: PropTypes.bool,
    selected: PropTypes.bool.isRequired
};

export default SpriteSelectorItem;
