import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const XTerm = ({ output }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal and fit addon
    xtermRef.current = new Terminal({
      cols: 80,
      rows: 24,
      cursorBlink: true,
    });

    fitAddonRef.current = new FitAddon();
    xtermRef.current.loadAddon(fitAddonRef.current);

    xtermRef.current.open(terminalRef.current);
    fitAddonRef.current.fit(); // fit on initial mount
    xtermRef.current.clear();

    // Fit on window resize
    const handleResize = () => fitAddonRef.current.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      xtermRef.current.dispose();
    };
  }, []);

  // Write to terminal when output changes
  useEffect(() => {
    if (!xtermRef.current || !output) return;
    xtermRef.current.writeln(output);
    fitAddonRef.current.fit(); // optional: fit after writing
  }, [output]);

  return <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />;
};

export default XTerm;
