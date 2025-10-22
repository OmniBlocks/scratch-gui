import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import ProgressRing from '../progress-ring/progress-ring.jsx';
import classNames from 'classnames';

import styles from './export-just-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Export just...',
        description: 'Title for export just modal',
        id: 'gui.exportJustModal.title'
    },
    description: {
        defaultMessage: 'Choose what to export from this sprite:',
        description: 'Description text in export just modal',
        id: 'gui.exportJustModal.description'
    },
    exportLabel: {
        defaultMessage: 'Export just:',
        description: 'Label for export type dropdown',
        id: 'gui.exportJustModal.exportLabel'
    },
    costumes: {
        defaultMessage: 'Costumes',
        description: 'Option for exporting costumes',
        id: 'gui.exportJustModal.costumes'
    },
    sounds: {
        defaultMessage: 'Sounds',
        description: 'Option for exporting sounds',
        id: 'gui.exportJustModal.sounds'
    },
    exporting: {
        defaultMessage: 'Exporting... {progress}%',
        description: 'Text shown during export with progress percentage',
        id: 'gui.exportJustModal.exporting'
    },
    cancel: {
        defaultMessage: 'Cancel',
        description: 'Button to cancel export',
        id: 'gui.exportJustModal.cancel'
    },
    export: {
        defaultMessage: 'Export',
        description: 'Button to start export',
        id: 'gui.exportJustModal.export'
    }
});

const ExportJustModalComponent = props => (
    <Modal
        className={styles.modalContent}
        onRequestClose={props.onCancel}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="exportJustModal"
    >
        <Box className={styles.body}>
            <h2 className={styles.title}>
                <FormattedMessage {...messages.title} />
            </h2>
            
            <p className={styles.description}>
                <FormattedMessage {...messages.description} />
            </p>

            {props.isExporting ? (
                <div className={styles.progressContainer}>
                    <ProgressRing
                        sizePx={36}
                        value={props.progress}
                        max={100}
                    />
                    <p className={styles.progressText}>
                        <FormattedMessage
                            {...messages.exporting}
                            values={{progress: Math.round(props.progress)}}
                        />
                    </p>
                </div>
            ) : (
                <React.Fragment>
                    <div className={styles.selectRow}>
                        <label className={styles.label} htmlFor="exportTypeSelect">
                            <FormattedMessage {...messages.exportLabel} />
                        </label>
                        <select
                            id="exportTypeSelect"
                            className={styles.select}
                            value={props.exportType}
                            onChange={props.onChangeExportType}
                        >
                            <option value="costumes">
                                {props.intl.formatMessage(messages.costumes)}
                            </option>
                            <option value="sounds">
                                {props.intl.formatMessage(messages.sounds)}
                            </option>
                        </select>
                    </div>

                    <Box className={styles.buttonRow}>
                        <button
                            className={styles.cancelButton}
                            onClick={props.onCancel}
                        >
                            <FormattedMessage {...messages.cancel} />
                        </button>
                        <button
                            className={styles.exportButton}
                            onClick={props.onExport}
                        >
                            <FormattedMessage {...messages.export} />
                        </button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    </Modal>
);

ExportJustModalComponent.propTypes = {
    intl: intlShape.isRequired,
    exportType: PropTypes.oneOf(['costumes', 'sounds']).isRequired,
    isExporting: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    onChangeExportType: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired
};

export default injectIntl(ExportJustModalComponent);