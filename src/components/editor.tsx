import React from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import TemporaryDrawer from "./drawer";
import DrawerScreen from "./drawer";

interface EditorScreenProps {
  // Add any props if needed
}

const EditorScreen: React.FC<EditorScreenProps> = () => {
  const handleEditorChange: OnChange = (value, event) => {
    console.log("code changed:", value);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    console.log("editor mounted:", editor);
    editor.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex items-center p-1 border-b border-blue-200">
        <div className="mr-2">
          <DrawerScreen />
        </div>

        {/* Input Field */}
        <input type="text" placeholder="Untitled document" className="px-2 py-1 text-xl font-medium text-white w-48 border border-transparent hover:border-gray-300 rounded focus:outline-none focus:border-blue-500" defaultValue="Untitled document" />
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 w-full">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          defaultValue="// Start coding here in TypeScript"
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
};

export default EditorScreen;
