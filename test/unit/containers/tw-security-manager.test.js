/**
 * Tests for the runJavaScript security manager functionality
 */

import SecurityModals from '../../../src/lib/tw-security-manager-constants';

describe('Security Manager - runJavaScript', () => {
    test('SecurityModals should include RunJavaScript', () => {
        expect(SecurityModals.RunJavaScript).toBe('RunJavaScript');
    });

    test('SecurityModals should have all expected constants', () => {
        const expectedConstants = [
            'LoadExtension',
            'Fetch',
            'OpenWindow',
            'Redirect',
            'RecordAudio',
            'RecordVideo',
            'ReadClipboard',
            'Notify',
            'Geolocate',
            'Embed',
            'Download',
            'RunJavaScript'
        ];

        expectedConstants.forEach(constant => {
            expect(SecurityModals[constant]).toBe(constant);
        });
    });
});