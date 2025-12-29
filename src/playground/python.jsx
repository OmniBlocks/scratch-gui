import React, { useEffect, useRef, useState } from "react";
import pyodideURL from "pyodide/pyodide.js?pyodide";
import render from "./app-target.js";
import { XTerminal } from "xterminal";

const PythonIDE = () => {
  const [pyodide, setPyodide] = useState(null);
  const [code, setCode] = useState('print("Hello World!")');
  const terminalRef = useRef(null);

  // Load Pyodide
  useEffect(() => {
    const script = document.createElement("script");
    script.src = pyodideURL;

    script.onload = async () => {
      const py = await loadPyodide({
        indexURL: pyodideURL.replace(/pyodide\.js$/, "")
      });

      setPyodide(py);

      await py.runPythonAsync(`
import sys
class JsOutput:
    def write(self, s):
        if s.strip():
            js_append_output(s)
    def flush(self):
        pass

sys.stdout = JsOutput()
sys.stderr = JsOutput()
      `);

      window.js_append_output = (s) => {
        terminalRef.current?.writeln(s);
      };
    };

    document.head.appendChild(script);
  }, []);

  const runCode = async () => {
    if (!pyodide || !terminalRef.current) return;

    terminalRef.current.clear();

    try {
      await pyodide.runPythonAsync(code);
    } catch (err) {
      terminalRef.current.writeln(err.toString());
    }
  };

  if (!pyodide) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontFamily: "sans-serif"
        }}
      >
        <div>Loading Python runtime…</div>
        <div style={{ fontSize: 14, color: "#666" }}>
          Pyodide is stretching its legs.
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Text editor */}
      <div style={{ flex: 1 }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          style={{
            width: "100%",
            height: "100%",
            resize: "none",
            fontFamily: "monospace",
            fontSize: 14,
            padding: 10,
            border: "none",
            outline: "none",
            background: "#1e1e1e",
            color: "#d4d4d4"
          }}
        />
      </div>

      {/* Run bar */}
      <div
        style={{
          padding: 6,
          background: "#2a2a2a",
          borderTop: "2px solid #333",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <button onClick={runCode}>Run</button>
      </div>

      {/* Terminal */}
      <div style={{ flex: 1 }}>
        <XTerminal
          ref={terminalRef}
          options={{
            theme: {
              background: "#1e1e1e",
              foreground: "#d4d4d4"
            },
            cursorBlink: true,
            fontSize: 14
          }}
        />
      </div>
    </div>
  );
};

render(<PythonIDE />);
