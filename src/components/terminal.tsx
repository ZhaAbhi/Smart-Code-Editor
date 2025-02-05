import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

const TerminalScreen = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const terminalRef = useRef(null);

  const initializeTerminal = () => {
    // If terminal div exists and terminal instance hasn't been created yet
    if (terminalRef.current && !terminalRef.current.terminal) {
      const terminal = new Terminal({
        cursorBlink: true,
        theme: {
          background: "#1e1e1e",
          foreground: "#ffffff",
        },
        fontSize: 14,
        fontFamily: "monospace",
        rows: 24,
        cols: 80,
      });

      terminal.open(terminalRef.current);
      // Store terminal instance directly on the DOM ref
      terminalRef.current.terminal = terminal;

      terminal.writeln("Welcome to the terminal!");
      terminal.writeln("Type your commands below.");
      terminal.write("\r\n$ ");

      terminal.onData((data) => {
        // Echo input
        terminal.write(data);

        // Handle Enter key
        if (data === "\r") {
          terminal.write("\n\r$ ");
        }
      });
    }
  };

  useEffect(() => {
    if (isTerminalOpen) {
      initializeTerminal();
    }

    return () => {
      // Clean up using the terminal instance stored on the ref
      if (terminalRef.current?.terminal) {
        terminalRef.current.terminal.dispose();
        terminalRef.current.terminal = null;
      }
    };
  }, [isTerminalOpen]);

  const toggleTerminal = () => {
    setIsTerminalOpen(!isTerminalOpen);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <button onClick={toggleTerminal} className="mb-4 rounded-lg bg-gray-800 px-6 py-3 text-white hover:bg-gray-700 transition-colors">
        {isTerminalOpen ? "Close Terminal" : "Open Terminal"}
      </button>

      {isTerminalOpen && (
        <div className="w-full max-w-4xl rounded-lg border border-gray-700 bg-gray-800 p-2" style={{ height: "500px" }}>
          <div ref={terminalRef} className="h-full w-full overflow-auto" />
        </div>
      )}
    </div>
  );
};

export default TerminalScreen;
