import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import LibraryComponent from '../components/library/library.jsx';
import spriteLibrary from '../lib/libraries/sprites/index.js';

const messages = defineMessages({
    libraryTitle: {
        defaultMessage: 'Choose a Sprite',
        description: 'Heading for the sprite library',
        id: 'gui.spriteLibrary.chooseASprite'
    }
});

class SpriteLibrary extends React.Component {
    constructor(props) {
        super(props);
        this.handleItemSelect = this.handleItemSelect.bind(this);
    }

    handleItemSelect(item) {
        // Handle sprite selection
        if (this.props.onRequestClose) {
            this.props.onRequestClose();
        }
        
        // Add the sprite to the project
        if (this.props.vm && item.json) {
            this.props.vm.addSprite(JSON.stringify(item.json));
        }
    }

    render() {
        return (
            <LibraryComponent
                data={spriteLibrary}
                filterable={true}
                id="spriteLibrary"
                title={this.props.intl.formatMessage(messages.libraryTitle)}
                visible={this.props.visible}
                onItemSelect={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

SpriteLibrary.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.shape({
        addSprite: PropTypes.func
    })
};

SpriteLibrary.defaultProps = {
    visible: true
};

const mapStateToProps = state => ({
    // Map any needed state here
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    // Map any needed dispatch actions here
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(SpriteLibrary));
