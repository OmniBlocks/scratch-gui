import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import VM from 'scratch-vm';

import {connect} from 'react-redux';

import {activateTab, NANOSCRIPT_TAB_INDEX} from '../reducers/editor-tab';

import NanoScriptEditor from '../components/nanoscript-editor/nanoscript-editor.jsx';

class NanoScriptTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'onActivateNanoScriptTab'
        ]);
    }

    onActivateNanoScriptTab() {
        this.props.onActivateNanoScriptTab();
    }

    render () {
        const {
            intl,
            vm
        } = this.props;

        if (!vm.editingTarget) {
            return null;
        }

        return (
            <div>
                <NanoScriptEditor vm={vm} />
            </div>
        );
    }
}

NanoScriptTab.propTypes = {
    intl: intlShape.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    onActivateNanoScriptTab: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onActivateNanoScriptTab: () => dispatch(activateTab(NANOSCRIPT_TAB_INDEX))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(NanoScriptTab));