import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import ExportJustModalComponent from '../components/export-just-modal/export-just-modal.jsx';
import {closeExportJustModal} from '../reducers/modals';
import VM from 'scratch-vm';
import JSZip from 'jszip';
import downloadBlob from '../lib/download-blob';

class ExportJustModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeExportType',
            'handleCancel',
            'handleExport',
            'updateProgress'
        ]);
        this.state = {
            exportType: 'costumes',
            isExporting: false,
            progress: 0,
            error: null
        };
    }

    handleChangeExportType (e) {
        this.setState({
            exportType: e.target.value
        });
    }

    handleCancel () {
        if (!this.state.isExporting) {
            this.props.onClose();
        }
        // If exporting, do nothing (or could show confirmation dialog)
    }

    updateProgress (value) {
        // Throttle to nearest 1% to avoid excessive re-renders
        const roundedValue = Math.floor(value);
        if (roundedValue !== Math.floor(this.state.progress)) {
            this.setState({progress: roundedValue});
        }
    }

    async handleExport () {
        this.setState({
            isExporting: true,
            progress: 0,
            error: null
        });

        try {
            const zip = new JSZip();
            const target = this.props.vm.runtime.getTargetById(this.props.spriteId);
            
            if (!target || !target.sprite) {
                throw new Error('No target or sprite found');
            }

            let items, exportName;
            if (this.state.exportType === 'costumes') {
                items = target.sprite.costumes;
                exportName = 'costumes';
                
                if (!items || items.length === 0) {
                    throw new Error('No costumes found for this sprite');
                }
            } else {
                items = target.sprite.sounds;
                exportName = 'sounds';
                
                if (!items || items.length === 0) {
                    throw new Error('No sounds found for this sprite');
                }
            }

            let addedCount = 0;
            const totalCount = items.length;

            // Process items with progress tracking
            const itemPromises = items.map(async (item, idx) => {
                try {
                    let data;
                    if (this.state.exportType === 'costumes') {
                        data = await this.props.vm.getExportedCostume(item);
                    } else {
                        // For sounds, use item.asset.data directly
                        if (!item.asset || !item.asset.data) {
                            console.warn(`No data for sound ${item.name} at index ${idx}`, item);
                            return;
                        }
                        data = item.asset.data;
                    }

                    if (data) {
                        zip.file(
                            `${item.name}.${item.asset.dataFormat}`,
                            data,
                            {binary: true}
                        );
                        addedCount++;
                    }

                    // Update progress
                    const progress = ((idx + 1) / totalCount) * 100;
                    this.updateProgress(progress);
                } catch (err) {
                    console.error(`Error exporting ${exportName} ${item.name}:`, err);
                }
            });

            await Promise.all(itemPromises);

            if (addedCount === 0 || Object.keys(zip.files).length === 0) {
                throw new Error(`No ${exportName} could be exported for this sprite`);
            }

            // Generate and download the zip
            const content = await zip.generateAsync({type: 'blob'});
            const filename = `${target.getName()}-${exportName}.zip`;
            downloadBlob(filename, content);

            // Close modal on success
            this.props.onClose();
        } catch (err) {
            console.error('Export error:', err);
            const errorMessage = err.message || `Error exporting ${this.state.exportType}`;
            this.setState({
                error: errorMessage,
                isExporting: false,
                progress: 0
            });
            // Keep modal open to show error - could add error display to UI
            alert(errorMessage);
        }
    }

    render () {
        return (
            <ExportJustModalComponent
                exportType={this.state.exportType}
                isExporting={this.state.isExporting}
                progress={this.state.progress}
                onChangeExportType={this.handleChangeExportType}
                onCancel={this.handleCancel}
                onExport={this.handleExport}
            />
        );
    }
}

ExportJustModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    spriteId: PropTypes.string.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    spriteId: state.scratchGui.modals.exportJustSpriteId,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeExportJustModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExportJustModal);