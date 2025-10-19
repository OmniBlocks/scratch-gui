import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import DragConstants from '../../lib/drag-constants';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import SpriteSelectorItem from '../../containers/sprite-selector-item.jsx';
import styles from './backpack.css';

// TODO make sprite selector item not require onClick
const noop = () => {};

const dragTypeMap = { // Keys correspond with the backpack-server item types
    costume: DragConstants.BACKPACK_COSTUME,
    sound: DragConstants.BACKPACK_SOUND,
    script: DragConstants.BACKPACK_CODE,
    sprite: DragConstants.BACKPACK_SPRITE
};

const labelMap = defineMessages({
    costume: {
        id: 'gui.backpack.costumeLabel',
        defaultMessage: 'costume',
        description: 'Label for costume backpack item'
    },
    sound: {
        id: 'gui.backpack.soundLabel',
        defaultMessage: 'sound',
        description: 'Label for sound backpack item'
    },
    script: {
        id: 'gui.backpack.scriptLabel',
        defaultMessage: 'script',
        description: 'Label for script backpack item'
    },
    sprite: {
        id: 'gui.backpack.spriteLabel',
        defaultMessage: 'sprite',
        description: 'Label for sprite backpack item'
    }
});

const Backpack = ({
    blockDragOver,
    containerRef,
    contents,
    dragOver,
    error,
    expanded,
    intl,
    loading,
    showMore,
    onToggle,
    onDelete,
    onRename,
    onMouseEnter,
    onMouseLeave,
    onMore
}) => {
    // Animation state management
    const [shouldRenderList, setShouldRenderList] = useState(expanded);
    const [animationClass, setAnimationClass] = useState('');
    const listRef = useRef(null);
    const isInitialMount = useRef(true);

    // Handle expand/collapse animation
    useEffect(() => {
        // Skip animation on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (expanded) {
            // Expanding: render DOM first, then trigger animation
            setShouldRenderList(true);
            // Use requestAnimationFrame to ensure DOM is rendered before adding animation class
            requestAnimationFrame(() => {
                setAnimationClass('expanding');
            });
        } else {
            // Collapsing: trigger animation first, then remove from DOM after animation
            setAnimationClass('collapsing');
        }
    }, [expanded]);

    // Handle animation end events
    const handleAnimationEnd = (event) => {
        // Make sure this is the animation we care about, not a child animation
        if (event.target === listRef.current) {
            if (event.animationName === 'collapse-backpack') {
                // Animation finished collapsing, now remove from DOM
                setShouldRenderList(false);
            }
            // Clear animation class after animation completes
            setAnimationClass('');
        }
    };

    return (
        <div className={styles.backpackContainer}>
            <div
                className={styles.backpackHeader}
                onClick={onToggle}
            >
                {onToggle ? (
                    <FormattedMessage
                        defaultMessage="Backpack"
                        description="Button to open the backpack"
                        id="gui.backpack.header"
                    />
                ) : (
                    <ComingSoonTooltip
                        place="top"
                        tooltipId="backpack-tooltip"
                    >
                        <FormattedMessage
                            defaultMessage="Backpack"
                            description="Button to open the backpack"
                            id="gui.backpack.header"
                        />
                    </ComingSoonTooltip>
                )}
            </div>
            {shouldRenderList ? (
                <div
                    ref={(node) => {
                        listRef.current = node;
                        if (containerRef) containerRef(node);
                    }}
                    className={classNames(styles.backpackList, {
                        [styles.dragOver]: dragOver || blockDragOver,
                        [styles.expanding]: animationClass === 'expanding',
                        [styles.collapsing]: animationClass === 'collapsing'
                    })}
                    onAnimationEnd={handleAnimationEnd}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {/* eslint-disable-next-line no-negated-condition */}
                    {error !== false ? (
                        <div className={styles.statusMessage}>
                            <FormattedMessage
                                defaultMessage="Error loading backpack"
                                description="Error backpack message"
                                id="gui.backpack.errorBackpack"
                            />
                            <div className={styles.errorMessage}>{error}</div>
                        </div>
                    ) : (
                        loading ? (
                            <div className={styles.statusMessage}>
                                <FormattedMessage
                                    defaultMessage="Loading..."
                                    description="Loading backpack message"
                                    id="gui.backpack.loadingBackpack"
                                />
                            </div>
                        ) : (
                            contents.length > 0 ? (
                                <div className={styles.backpackListInner}>
                                    {contents.map(item => (
                                        <SpriteSelectorItem
                                            className={styles.backpackItem}
                                            costumeURL={item.thumbnailUrl}
                                            details={item.name}
                                            dragPayload={item}
                                            dragType={dragTypeMap[item.type]}
                                            id={item.id}
                                            key={item.id}
                                            name={intl.formatMessage(labelMap[item.type])}
                                            selected={false}
                                            onClick={noop}
                                            onDeleteButtonClick={onDelete}
                                            // Currently, renaming sprites is not supported.
                                            onRenameButtonClick={item.type === 'sprite' ? null : onRename}
                                        />
                                    ))}
                                    {showMore && (
                                        <button
                                            className={styles.more}
                                            onClick={onMore}
                                        >
                                            <FormattedMessage
                                                defaultMessage="More"
                                                description="Load more from backpack"
                                                id="gui.backpack.more"
                                            />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.statusMessage}>
                                    <FormattedMessage
                                        defaultMessage="Backpack is empty"
                                        description="Empty backpack message"
                                        id="gui.backpack.emptyBackpack"
                                    />
                                </div>
                            )
                        )
                    )}
                </div>
            ) : null}
        </div>
    );
};

Backpack.propTypes = {
    blockDragOver: PropTypes.bool,
    containerRef: PropTypes.func,
    contents: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        thumbnailUrl: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string
    })),
    dragOver: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    expanded: PropTypes.bool,
    intl: intlShape,
    loading: PropTypes.bool,
    onDelete: PropTypes.func,
    onRename: PropTypes.func,
    onMore: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onToggle: PropTypes.func,
    showMore: PropTypes.bool
};

Backpack.defaultProps = {
    blockDragOver: false,
    contents: [],
    dragOver: false,
    expanded: false,
    loading: false,
    showMore: false,
    onMore: null,
    onToggle: null
};

export default injectIntl(Backpack);
