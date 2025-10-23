import React from 'react';
import {ContextMenu as ReactContextMenu, MenuItem as ReactMenuItem} from '@szhsin/react-menu';
import classNames from 'classnames';

import styles from './context-menu.css';

const StyledContextMenu = props => (
    <ReactContextMenu
        {...props}
        className={styles.contextMenu}
    />
);

const StyledMenuItem = props => (
    <ReactMenuItem
        {...props}
        className={styles.menuItem}
    />
);

const BorderedMenuItem = props => (
    <ReactMenuItem
        {...props}
        className={classNames(styles.menuItem, styles.menuItemBordered)}
    />
);

const DangerousMenuItem = props => (
    <ReactMenuItem
        {...props}
        className={classNames(styles.menuItem, styles.menuItemBordered, styles.menuItemDanger)}
    />
);


export {
    BorderedMenuItem,
    DangerousMenuItem,
    StyledContextMenu as ContextMenu,
    StyledMenuItem as MenuItem
};
