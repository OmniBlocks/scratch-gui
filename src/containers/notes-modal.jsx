import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import {closeNotesModal} from '../reducers/modals';
import {setProjectNotes} from '../reducers/project-notes';
import NotesModalComponent from '../components/notes-modal/notes-modal.jsx';

const messages = defineMessages({
    title: {
        defaultMessage: 'Notes and Credits',
        description: 'Title for the notes and credits modal',
        id: 'gui.notesModal.title'
    }
});

class NotesModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleNotesChange',
            'handleSave',
            'handleCancel'
        ]);
        this.state = {
            tempNotes: props.projectNotes || ''
        };
    }

    componentDidUpdate (prevProps) {
        if (this.props.projectNotes !== prevProps.projectNotes) {
            this.setState({
                tempNotes: this.props.projectNotes || ''
            });
        }
    }

    handleNotesChange (content) {
        this.setState({
            tempNotes: content
        });
    }

    handleSave () {
        this.props.onSetProjectNotes(this.state.tempNotes);
        this.props.onClose();
    }

    handleCancel () {
        this.setState({
            tempNotes: this.props.projectNotes || ''
        });
        this.props.onClose();
    }

    render () {
        return (
            <NotesModalComponent
                title={this.props.intl.formatMessage(messages.title)}
                notes={this.state.tempNotes}
                onNotesChange={this.handleNotesChange}
                onSave={this.handleSave}
                onCancel={this.handleCancel}
                {...this.props}
            />
        );
    }
}

NotesModal.propTypes = {
    intl: intlShape.isRequired,
    onClose: PropTypes.func.isRequired,
    onSetProjectNotes: PropTypes.func.isRequired,
    projectNotes: PropTypes.string
};

const mapStateToProps = state => ({
    projectNotes: state.scratchGui.projectNotes.content
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeNotesModal()),
    onSetProjectNotes: content => dispatch(setProjectNotes(content))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(NotesModal));