import React from 'react';
import pyodideURL from "pyodide/pyodide.js?pyodide";
import render from './app-target.js';

const Python = () => {
    const script = document.createElement("script");
    script.src = pyodideURL;
    script.onload = async () => {
    const pyodide = await window.loadPyodide({
        indexURL: pyodideURL.replace(/pyodide\.js$/, "")
    });
    };
    document.head.appendChild(script);
    const [code, setCode] = React.useState('print("Hello World!")');
    return (
        <textarea onChange={e => setCode(e.target.value)} />
    )
}

render(<Python />);