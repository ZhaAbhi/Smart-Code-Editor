import TemporaryDrawer from "./components/drawer";
import EditorScreen from "./components/editor";
import TerminalScreen from "./components/terminal";

function App() {
  return (
    <div>
      <EditorScreen />
      <TerminalScreen />
    </div>
  );
}

export default App;
