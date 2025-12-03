import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AmpHeroModalComponent from '../components/tw-amp-hero-modal/amp-hero-modal.jsx';
import {closeAmpHeroModal} from '../reducers/modals';

const AmpHeroModal = props => (
    props.isOpen ? <AmpHeroModalComponent {...props} /> : null
);

AmpHeroModal.propTypes = {
    isOpen: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    isOpen: state.scratchGui.modals.ampHeroModal
});

const mapDispatchToProps = dispatch => ({
    onRequestClose: () => dispatch(closeAmpHeroModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AmpHeroModal);
