import React, { useEffect, useRef } from 'react';

const SongEditor = () => {
    const iframeRef = useRef(null);

    useEffect(() => {

        const handleMessage = (event) => {

            // Only proceed if the message origin matches the iframe origin
            if (event.origin !== window.location.origin) {
                console.warn(`❌ Message origin mismatch: expected ${window.location.origin}, received ${event.origin}`);
                return;
            }

            const { type, payload } = event.data;
            if (type === 'SONG_DATA') {
            } else {
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <div
            style={{
                width: '100vh',
                height: '100%',
                top: 0,
                left: 0
            }}
        >
            <iframe
                ref={iframeRef}
                id="beepboxEditorIframe"
                src="songeditor.html" 
                style={{
                    width: '100vh',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    
                                }}
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
};

export default SongEditor;