import React from 'react';
import {shallow, mount} from 'enzyme';
import AudioSelector from '../../../src/containers/audio-selector.jsx';

describe('AudioSelector', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            onSetTrim: jest.fn(),
            playhead: 0.5,
            trimStart: 0.2,
            trimEnd: 0.8
        };
    });

    test('renders without crashing', () => {
        const wrapper = shallow(<AudioSelector {...defaultProps} />);
        expect(wrapper).toBeDefined();
    });

    test('initializes state with trimStart and trimEnd from props', () => {
        const wrapper = shallow(<AudioSelector {...defaultProps} />);
        expect(wrapper.state('trimStart')).toBe(0.2);
        expect(wrapper.state('trimEnd')).toBe(0.8);
    });

    // Tests for componentDidUpdate lifecycle behavior (React 19 compatibility)
    describe('componentDidUpdate', () => {
        test('updates state when trimStart prop changes', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            
            expect(wrapper.state('trimStart')).toBe(0.2);
            expect(wrapper.state('trimEnd')).toBe(0.8);
            
            wrapper.setProps({ trimStart: 0.3 });
            
            expect(wrapper.state('trimStart')).toBe(0.3);
            expect(wrapper.state('trimEnd')).toBe(0.8);
        });

        test('updates state when trimEnd prop changes', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            
            expect(wrapper.state('trimStart')).toBe(0.2);
            expect(wrapper.state('trimEnd')).toBe(0.8);
            
            wrapper.setProps({ trimEnd: 0.9 });
            
            expect(wrapper.state('trimStart')).toBe(0.2);
            expect(wrapper.state('trimEnd')).toBe(0.9);
        });

        test('updates state when both trimStart and trimEnd props change', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            
            expect(wrapper.state('trimStart')).toBe(0.2);
            expect(wrapper.state('trimEnd')).toBe(0.8);
            
            wrapper.setProps({ trimStart: 0.1, trimEnd: 0.95 });
            
            expect(wrapper.state('trimStart')).toBe(0.1);
            expect(wrapper.state('trimEnd')).toBe(0.95);
        });

        test('does not update state when trim props remain unchanged', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const stateBefore = wrapper.state();
            
            // Update a different prop
            wrapper.setProps({ playhead: 0.6 });
            
            // State should remain the same
            expect(wrapper.state()).toEqual(stateBefore);
        });

        test('does not update state when trim props are the same value', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const setState = jest.spyOn(wrapper.instance(), 'setState');
            
            // Set props to same values
            wrapper.setProps({ trimStart: 0.2, trimEnd: 0.8 });
            
            // setState should not be called
            expect(setState).not.toHaveBeenCalled();
        });

        test('handles rapid successive prop changes correctly', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            
            wrapper.setProps({ trimStart: 0.3 });
            expect(wrapper.state('trimStart')).toBe(0.3);
            
            wrapper.setProps({ trimStart: 0.4 });
            expect(wrapper.state('trimStart')).toBe(0.4);
            
            wrapper.setProps({ trimStart: 0.5, trimEnd: 0.85 });
            expect(wrapper.state('trimStart')).toBe(0.5);
            expect(wrapper.state('trimEnd')).toBe(0.85);
        });

        test('handles null trim values', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            
            wrapper.setProps({ trimStart: null, trimEnd: null });
            
            expect(wrapper.state('trimStart')).toBe(null);
            expect(wrapper.state('trimEnd')).toBe(null);
        });

        test('updates from null to defined values', () => {
            const props = {
                ...defaultProps,
                trimStart: null,
                trimEnd: null
            };
            const wrapper = shallow(<AudioSelector {...props} />);
            
            expect(wrapper.state('trimStart')).toBe(null);
            expect(wrapper.state('trimEnd')).toBe(null);
            
            wrapper.setProps({ trimStart: 0.2, trimEnd: 0.8 });
            
            expect(wrapper.state('trimStart')).toBe(0.2);
            expect(wrapper.state('trimEnd')).toBe(0.8);
        });

        test('updates from defined to null values', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            
            expect(wrapper.state('trimStart')).toBe(0.2);
            expect(wrapper.state('trimEnd')).toBe(0.8);
            
            wrapper.setProps({ trimStart: null, trimEnd: null });
            
            expect(wrapper.state('trimStart')).toBe(null);
            expect(wrapper.state('trimEnd')).toBe(null);
        });

        test('handles edge case values (0 and 1)', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            
            wrapper.setProps({ trimStart: 0, trimEnd: 1 });
            
            expect(wrapper.state('trimStart')).toBe(0);
            expect(wrapper.state('trimEnd')).toBe(1);
        });

        test('handles very small differences in trim values', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            
            wrapper.setProps({ trimStart: 0.5, trimEnd: 0.51 });
            
            expect(wrapper.state('trimStart')).toBe(0.5);
            expect(wrapper.state('trimEnd')).toBe(0.51);
        });
    });

    describe('clearSelection', () => {
        test('calls onSetTrim with null values', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            wrapper.instance().clearSelection();
            
            expect(defaultProps.onSetTrim).toHaveBeenCalledWith(null, null);
        });
    });

    describe('DragRecognizer initialization', () => {
        test('initializes trimStartDragRecognizer', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            
            expect(instance.trimStartDragRecognizer).toBeDefined();
            expect(instance.trimStartDragRecognizer.touchDragAngle).toBe(90);
            expect(instance.trimStartDragRecognizer.distanceThreshold).toBe(0);
        });

        test('initializes trimEndDragRecognizer', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            
            expect(instance.trimEndDragRecognizer).toBeDefined();
            expect(instance.trimEndDragRecognizer.touchDragAngle).toBe(90);
            expect(instance.trimEndDragRecognizer.distanceThreshold).toBe(0);
        });
    });

    describe('handleTrimStartMouseMove', () => {
        test('updates trimStart when dragging within bounds', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.containerSize = 1000;
            instance.initialTrimStart = 0.5;
            instance.initialTrimEnd = 0.8;
            
            instance.handleTrimStartMouseMove({ x: 600 }, { x: 500 });
            
            expect(wrapper.state('trimStart')).toBe(0.6);
            expect(wrapper.state('trimEnd')).toBe(0.8);
        });

        test('clamps trimStart to minimum of 0', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.containerSize = 1000;
            instance.initialTrimStart = 0.1;
            instance.initialTrimEnd = 0.8;
            
            instance.handleTrimStartMouseMove({ x: 0 }, { x: 200 });
            
            expect(wrapper.state('trimStart')).toBe(0);
        });

        test('clamps trimStart to maximum of 1', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.containerSize = 1000;
            instance.initialTrimStart = 0.9;
            instance.initialTrimEnd = 0.95;
            
            instance.handleTrimStartMouseMove({ x: 1100 }, { x: 900 });
            
            expect(wrapper.state('trimStart')).toBe(0.95);
            expect(wrapper.state('trimEnd')).toBe(1);
        });

        test('swaps trim values when dragging past trimEnd', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.containerSize = 1000;
            instance.initialTrimStart = 0.5;
            instance.initialTrimEnd = 0.7;
            
            instance.handleTrimStartMouseMove({ x: 800 }, { x: 500 });
            
            expect(wrapper.state('trimStart')).toBe(0.7);
            expect(wrapper.state('trimEnd')).toBe(0.8);
        });
    });

    describe('handleTrimEndMouseMove', () => {
        test('updates trimEnd when dragging within bounds', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.containerSize = 1000;
            instance.initialTrimStart = 0.2;
            instance.initialTrimEnd = 0.7;
            
            instance.handleTrimEndMouseMove({ x: 800 }, { x: 700 });
            
            expect(wrapper.state('trimStart')).toBe(0.2);
            expect(wrapper.state('trimEnd')).toBe(0.8);
        });

        test('clamps trimEnd to maximum of 1', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.containerSize = 1000;
            instance.initialTrimStart = 0.2;
            instance.initialTrimEnd = 0.9;
            
            instance.handleTrimEndMouseMove({ x: 1100 }, { x: 900 });
            
            expect(wrapper.state('trimEnd')).toBe(1);
        });

        test('clamps trimEnd to minimum of 0', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.containerSize = 1000;
            instance.initialTrimStart = 0.2;
            instance.initialTrimEnd = 0.1;
            
            instance.handleTrimEndMouseMove({ x: 0 }, { x: 100 });
            
            expect(wrapper.state('trimEnd')).toBe(0);
        });

        test('swaps trim values when dragging before trimStart', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.containerSize = 1000;
            instance.initialTrimStart = 0.5;
            instance.initialTrimEnd = 0.7;
            
            instance.handleTrimEndMouseMove({ x: 400 }, { x: 700 });
            
            expect(wrapper.state('trimStart')).toBe(0.4);
            expect(wrapper.state('trimEnd')).toBe(0.5);
        });
    });

    describe('handleTrimStartMouseUp', () => {
        test('calls onSetTrim with current state values', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            
            wrapper.setState({ trimStart: 0.3, trimEnd: 0.7 });
            instance.handleTrimStartMouseUp();
            
            expect(defaultProps.onSetTrim).toHaveBeenCalledWith(0.3, 0.7);
        });
    });

    describe('handleTrimEndMouseUp', () => {
        test('calls onSetTrim when selection is long enough', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.clickStartTime = Date.now() - 1000; // 1 second ago
            
            wrapper.setState({ trimStart: 0.3, trimEnd: 0.7 });
            instance.handleTrimEndMouseUp();
            
            expect(defaultProps.onSetTrim).toHaveBeenCalledWith(0.3, 0.7);
        });

        test('clears selection when too fast and too short', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.clickStartTime = Date.now(); // Just now
            
            wrapper.setState({ trimStart: 0.5, trimEnd: 0.505 }); // Very small selection
            instance.handleTrimEndMouseUp();
            
            expect(defaultProps.onSetTrim).toHaveBeenCalledWith(null, null);
        });

        test('keeps selection when fast but long enough', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.clickStartTime = Date.now(); // Just now
            
            wrapper.setState({ trimStart: 0.2, trimEnd: 0.8 }); // Long selection
            instance.handleTrimEndMouseUp();
            
            expect(defaultProps.onSetTrim).toHaveBeenCalledWith(0.2, 0.8);
        });

        test('keeps selection when short but slow enough', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            instance.clickStartTime = Date.now() - 600; // 600ms ago
            
            wrapper.setState({ trimStart: 0.5, trimEnd: 0.505 }); // Small selection
            instance.handleTrimEndMouseUp();
            
            expect(defaultProps.onSetTrim).toHaveBeenCalledWith(0.5, 0.505);
        });
    });

    describe('handleNewSelectionMouseDown', () => {
        test('sets initial trim values and starts drag recognizer', () => {
            const wrapper = mount(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            
            // Mock the container element and getBoundingClientRect
            instance.containerElement = {
                getBoundingClientRect: jest.fn(() => ({
                    width: 1000,
                    left: 100
                }))
            };
            
            const mockEvent = {
                preventDefault: jest.fn(),
                touches: undefined,
                clientX: 600 // 500 pixels from left edge
            };
            
            instance.trimEndDragRecognizer.start = jest.fn();
            
            instance.handleNewSelectionMouseDown(mockEvent);
            
            expect(defaultProps.onSetTrim).toHaveBeenCalledWith(0.5, 0.5);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(instance.trimEndDragRecognizer.start).toHaveBeenCalledWith(mockEvent);
            expect(instance.clickStartTime).toBeLessThanOrEqual(Date.now());
        });
    });

    describe('handleTrimStartMouseDown', () => {
        test('initializes drag and prevents event propagation', () => {
            const wrapper = mount(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            
            instance.containerElement = {
                getBoundingClientRect: jest.fn(() => ({
                    width: 1000
                }))
            };
            
            const mockEvent = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            };
            
            instance.trimStartDragRecognizer.start = jest.fn();
            
            instance.handleTrimStartMouseDown(mockEvent);
            
            expect(instance.containerSize).toBe(1000);
            expect(instance.initialTrimStart).toBe(0.2);
            expect(instance.initialTrimEnd).toBe(0.8);
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(instance.trimStartDragRecognizer.start).toHaveBeenCalledWith(mockEvent);
        });
    });

    describe('handleTrimEndMouseDown', () => {
        test('initializes drag and prevents event propagation', () => {
            const wrapper = mount(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            
            instance.containerElement = {
                getBoundingClientRect: jest.fn(() => ({
                    width: 1000
                }))
            };
            
            const mockEvent = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            };
            
            instance.trimEndDragRecognizer.start = jest.fn();
            
            instance.handleTrimEndMouseDown(mockEvent);
            
            expect(instance.containerSize).toBe(1000);
            expect(instance.initialTrimStart).toBe(0.2);
            expect(instance.initialTrimEnd).toBe(0.8);
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(instance.trimEndDragRecognizer.start).toHaveBeenCalledWith(mockEvent);
        });
    });

    describe('storeRef', () => {
        test('stores container element reference', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const instance = wrapper.instance();
            const mockElement = document.createElement('div');
            
            instance.storeRef(mockElement);
            
            expect(instance.containerElement).toBe(mockElement);
        });
    });

    describe('render', () => {
        test('passes correct props to AudioSelectorComponent', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            const component = wrapper.find('AudioSelectorComponent');
            
            expect(component.prop('playhead')).toBe(0.5);
            expect(component.prop('trimStart')).toBe(0.2);
            expect(component.prop('trimEnd')).toBe(0.8);
            expect(component.prop('containerRef')).toBeDefined();
            expect(component.prop('onNewSelectionMouseDown')).toBeDefined();
            expect(component.prop('onTrimStartMouseDown')).toBeDefined();
            expect(component.prop('onTrimEndMouseDown')).toBeDefined();
        });

        test('uses state values for trim, not props directly', () => {
            const wrapper = shallow(<AudioSelector {...defaultProps} />);
            
            // Change state without changing props
            wrapper.setState({ trimStart: 0.4, trimEnd: 0.6 });
            
            const component = wrapper.find('AudioSelectorComponent');
            expect(component.prop('trimStart')).toBe(0.4);
            expect(component.prop('trimEnd')).toBe(0.6);
        });
    });

    describe('PropTypes validation', () => {
        test('accepts valid props', () => {
            const validProps = {
                onSetTrim: jest.fn(),
                playhead: 0.5,
                trimStart: 0.2,
                trimEnd: 0.8
            };
            
            expect(() => {
                shallow(<AudioSelector {...validProps} />);
            }).not.toThrow();
        });

        test('accepts null trim values', () => {
            const validProps = {
                onSetTrim: jest.fn(),
                playhead: 0.5,
                trimStart: null,
                trimEnd: null
            };
            
            expect(() => {
                shallow(<AudioSelector {...validProps} />);
            }).not.toThrow();
        });

        test('accepts undefined playhead', () => {
            const validProps = {
                onSetTrim: jest.fn(),
                trimStart: 0.2,
                trimEnd: 0.8
            };
            
            expect(() => {
                shallow(<AudioSelector {...validProps} />);
            }).not.toThrow();
        });
    });
});