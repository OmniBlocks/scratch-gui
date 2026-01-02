import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import SpriteSelector from '../sprite-selector/sprite-selector.jsx';

import styles from './gui.css';

class GUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sprites: [
                {
                    id: 'sprite1',
                    name: 'Sprite1'
                }
            ],
            selectedSpriteId: 'sprite1'
        };
        this.handleSelectSprite = this.handleSelectSprite.bind(this);
        this.handleDeleteSprite = this.handleDeleteSprite.bind(this);
    }

    handleSelectSprite(spriteId) {
        this.setState({selectedSpriteId: spriteId});
    }

    handleDeleteSprite(spriteId) {
        const newSprites = this.state.sprites.filter(sprite => sprite.id !== spriteId);
        this.setState({
            sprites: newSprites,
            selectedSpriteId: newSprites.length > 0 ? newSprites[0].id : null
        });
    }

    render() {
        return (
            <div className={styles.gui}>
                <div className={styles.header}>
                    <h1 className={styles.title}>OmniBlocks</h1>
                    <div className={styles.subtitle}>Block-based Programming IDE</div>
                </div>
                <div className={styles.mainContent}>
                    <SpriteSelector
                        sprites={this.state.sprites}
                        selectedSpriteId={this.state.selectedSpriteId}
                        onSelectSprite={this.handleSelectSprite}
                        onDeleteSprite={this.handleDeleteSprite}
                    />
                    <div className={styles.workspace}>
                        <div className={styles.stage}>
                            <div className={styles.stageHeader}>Stage</div>
                            <div className={styles.stageArea}>
                                {/* Stage content will go here */}
                                <div className={styles.stagePlaceholder}>
                                    Stage Area - Projects will run here
                                </div>
                            </div>
                        </div>
                        <div className={styles.blocks}>
                            <div className={styles.blocksHeader}>Blocks</div>
                            <div className={styles.blocksArea}>
                                {/* Block palette will go here */}
                                <div className={styles.blocksPlaceholder}>
                                    Block Palette - Drag blocks here to code
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GUI.propTypes = {
    // Add props as needed
};

const mapStateToProps = state => ({
    // Map state as needed
});

const mapDispatchToProps = dispatch => ({
    // Map dispatch as needed
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GUI);
