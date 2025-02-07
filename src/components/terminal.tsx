import { useState, useRef, useEffect } from "react";
import { Terminal as XTerminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

interface TerminalScreenProps {
  initialOpen?: boolean;
}

interface TerminalTheme {
  background: string;
  foreground: string;
}

interface TerminalOptions {
  cursorBlink: boolean;
  rows: number;
  cols: number;
  theme: TerminalTheme;
}

const TerminalScreen: React.FC<TerminalScreenProps> = ({ initialOpen = false }) => {
  const [open, setOpen] = useState<boolean>(initialOpen);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<XTerminal | null>(null);
  const currentLineBuffer = useRef<string>("");

  const commands = {
    help: () => {
      terminalInstance.current?.writeln("\r\nAvailable commands:");
      terminalInstance.current?.writeln("  help     - Show this help message");
      terminalInstance.current?.writeln("  clear    - Clear the terminal");
      terminalInstance.current?.writeln("  echo     - Echo the provided text");
      terminalInstance.current?.writeln("  date     - Show current date and time");
      terminalInstance.current?.writeln("  whoami   - Show current user");
      terminalInstance.current?.writeln("");
    },
    clear: () => {
      terminalInstance.current?.clear();
    },
    echo: (args: string) => {
      terminalInstance.current?.writeln(`\r\n${args}`);
    },
    date: () => {
      terminalInstance.current?.writeln(`\r\n${new Date().toLocaleString()}`);
    },
    whoami: () => {
      terminalInstance.current?.writeln("\r\nGuest User");
    },
  };

  const writePrompt = () => {
    terminalInstance.current?.write("\r\n$ ");
  };

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim();
    const [cmd, ...args] = trimmedCommand.split(" ");

    if (trimmedCommand === "") {
      writePrompt();
      return;
    }

    if (cmd in commands) {
      commands[cmd as keyof typeof commands](args.join(" "));
    } else {
      terminalInstance.current?.writeln(`\r\nCommand not found: ${cmd}`);
    }

    writePrompt();
    currentLineBuffer.current = "";
  };

  useEffect(() => {
    if (open && terminalRef.current) {
      if (!terminalInstance.current) {
        const options: TerminalOptions = {
          cursorBlink: true,
          rows: 22, // Reduced from 24 to leave space at bottom
          cols: 80,
          theme: {
            background: "#000000",
            foreground: "#ffffff",
          },
        };

        terminalInstance.current = new XTerminal(options);
        terminalInstance.current.open(terminalRef.current);

        // Initial welcome message
        terminalInstance.current.writeln("Welcome to Smart Code Editor");
        terminalInstance.current.writeln("Type 'help' to see available commands");
        writePrompt();

        // Handle user input
        terminalInstance.current.onKey(({ key, domEvent }) => {
          const ev = domEvent;
          const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

          if (ev.keyCode === 13) {
            // Enter
            handleCommand(currentLineBuffer.current);
          } else if (ev.keyCode === 8) {
            // Backspace
            if (currentLineBuffer.current.length > 0) {
              currentLineBuffer.current = currentLineBuffer.current.slice(0, -1);
              if (terminalInstance.current) {
                terminalInstance.current.write("\b \b");
              }
            }
          } else if (printable) {
            currentLineBuffer.current += key;
            terminalInstance.current?.write(key);
          }
        });

        terminalInstance.current.focus();
      }
    }

    return () => {
      if (terminalInstance.current) {
        terminalInstance.current.dispose();
        terminalInstance.current = null;
      }
    };
  }, [open]);

  const handleTerminal = (): void => {
    setOpen(!open);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <button onClick={handleTerminal} className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-t hover:bg-blue-700 focus:outline-none">
        {open ? "Close Terminal" : "Open Terminal"}
      </button>
      {open && (
        <div className="relative w-full h-[400px] bg-black rounded-t overflow-hidden">
          <div ref={terminalRef} className="absolute inset-0 pb-4" /> {/* Added padding bottom */}
        </div>
      )}
    </div>
  );
};

export default TerminalScreen;
