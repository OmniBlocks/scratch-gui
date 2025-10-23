import '@testing-library/jest-dom';

// Global test configuration for React Testing Library
global.ResizeObserver = class ResizeObserver {
    constructor(cb) {
        this.cb = cb;
    }
    observe() {
        this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this);
    }
    unobserve() {}
    disconnect() {}
};

// Mock for IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock for matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});