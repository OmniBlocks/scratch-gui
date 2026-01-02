import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SpriteLibrary from '../../containers/sprite-library.jsx';

import styles from './sprite-selector.css';

class SpriteSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            libraryVisible: false
        };
        this.handleNewSpriteClick = this.handleNewSpriteClick.bind(this);
        this.handleLibraryClose = this.handleLibraryClose.bind(this);
    }

    handleNewSpriteClick() {
        this.setState({libraryVisible: true});
    }

    handleLibraryClose() {
        this.setState({libraryVisible: false});
    }

    render() {
        const {
            sprites,
            selectedSpriteId,
            onSelectSprite,
            onDeleteSprite
        } = this.props;

        return (
            <div className={styles.spriteSelector}>
                <div className={styles.spriteSelectorHeader}>
                    <div className={styles.spriteSelectorTitle}>Sprites</div>
                    <button
                        className={styles.addSpriteButton}
                        onClick={this.handleNewSpriteClick}
                    >
                        + Add Sprite
                    </button>
                </div>
                <div className={styles.spriteList}>
                    {sprites && sprites.map(sprite => (
                        <div
                            key={sprite.id}
                            className={classNames(styles.spriteItem, {
                                [styles.selected]: sprite.id === selectedSpriteId
                            })}
                            onClick={() => onSelectSprite(sprite.id)}
                        >
                            <div className={styles.spriteName}>{sprite.name}</div>
                        </div>
                    ))}
                </div>
                {this.state.libraryVisible && (
                    <SpriteLibrary
                        visible={this.state.libraryVisible}
                        onRequestClose={this.handleLibraryClose}
                    />
                )}
            </div>
        );
    }
}

SpriteSelector.propTypes = {
    sprites: PropTypes.arrayOf(PropTypes.object),
    selectedSpriteId: PropTypes.string,
    onSelectSprite: PropTypes.func,
    onDeleteSprite: PropTypes.func
};

export default SpriteSelector;
