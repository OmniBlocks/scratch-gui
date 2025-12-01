import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, intlShape, injectIntl} from 'react-intl';

import Modal from '../components/modal/modal.jsx';
import PaintEditorWrapper from './paint-editor-wrapper.jsx';
import {closePaintEditorFullscreen} from '../reducers/modals';

const messages = defineMessages({
    paintEditorTitle: {
        defaultMessage: 'Paint Editor',
        description: 'Title for the fullscreen paint editor modal',
        id: 'gui.paintEditor.title'
    }
});

const PaintEditorFullscreen = props => {
    const {
        intl,
        isRtl,
        onRequestClose,
        selectedCostumeIndex,
        ...modalProps
    } = props;

    return (
        <Modal
            className="paint-editor-fullscreen-modal"
            contentLabel={intl.formatMessage(messages.paintEditorTitle)}
            fullScreen
            isRtl={isRtl}
            onRequestClose={onRequestClose}
            {...modalProps}
        >
            <PaintEditorWrapper
                selectedCostumeIndex={selectedCostumeIndex}
            />
        </Modal>
    );
};

PaintEditorFullscreen.propTypes = {
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    onRequestClose: PropTypes.func.isRequired,
    selectedCostumeIndex: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl
});

const mapDispatchToProps = dispatch => ({
    onRequestClose: () => dispatch(closePaintEditorFullscreen())
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(PaintEditorFullscreen));