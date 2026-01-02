import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Modal from '../modal/modal.jsx';
import LibraryItem from './library-item.jsx';

import styles from './library.css';

class Library extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterQuery: '',
            selectedTag: ''
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this);
    }

    handleFilterChange(event) {
        this.setState({filterQuery: event.target.value});
    }

    handleTagClick(tag) {
        this.setState({selectedTag: tag === this.state.selectedTag ? '' : tag});
    }

    render() {
        const {
            data,
            filterable,
            id,
            title,
            visible,
            onItemSelect,
            onRequestClose
        } = this.props;

        const {filterQuery, selectedTag} = this.state;

        // Filter data based on search query and selected tag
        const filteredData = data.filter(item => {
            const matchesQuery = !filterQuery || 
                item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(filterQuery.toLowerCase()));
            
            const matchesTag = !selectedTag || 
                (item.tags && item.tags.includes(selectedTag));
            
            return matchesQuery && matchesTag;
        });

        // Get all unique tags
        const allTags = [...new Set(data.flatMap(item => item.tags || []))];

        return (
            <Modal
                fullScreen
                id={id}
                onRequestClose={onRequestClose}
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <div className={styles.headerContent}>
                            <div className={styles.libraryScrollGrid}>
                                <h2 className={styles.libraryTitle}>{title}</h2>
                                {filterable && (
                                    <div className={styles.filterBar}>
                                        <input
                                            className={styles.filterInput}
                                            placeholder="Search..."
                                            type="text"
                                            value={filterQuery}
                                            onChange={this.handleFilterChange}
                                        />
                                        <div className={styles.tagButtons}>
                                            {allTags.map(tag => (
                                                <button
                                                    key={tag}
                                                    className={classNames(styles.tagButton, {
                                                        [styles.tagButtonSelected]: selectedTag === tag
                                                    })}
                                                    onClick={() => this.handleTagClick(tag)}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.libraryScrollGrid}>
                        {filteredData.map((dataItem, index) => (
                            <LibraryItem
                                bluetoothRequired={dataItem.bluetoothRequired}
                                collaborator={dataItem.collaborator}
                                description={dataItem.description}
                                disabled={dataItem.disabled}
                                extensionId={dataItem.extensionId}
                                featured={dataItem.featured}
                                hidden={dataItem.hidden}
                                iconMd5={dataItem.md5}
                                iconRawURL={dataItem.rawURL}
                                icons={dataItem.icon}
                                id={index}
                                insetIconURL={dataItem.insetIconURL}
                                internetConnectionRequired={dataItem.internetConnectionRequired}
                                isRtl={false}
                                key={`library-item-${index}`}
                                name={dataItem.name}
                                showPlayButton={false}
                                onSelect={() => onItemSelect(dataItem)}
                            />
                        ))}
                    </div>
                </div>
            </Modal>
        );
    }
}

Library.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onItemSelect: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func
};

Library.defaultProps = {
    filterable: true,
    visible: true
};

export default Library;
