import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

type Cell = {
  id: string
  content: string
}

function App() {
  // Bad, not synced implementation, just to prototype on
  const [cells, setCells] = useState<Cell[]>([]);

  async function create_cell() {
    const id = await invoke("create_cell") as string;
    console.log(id);
    setCells((oldCells: Cell[] ) => [...oldCells, { id, content: "" }]);
  }

  function update_cell(cellId: string, newContent: string) {
    invoke("update_cell", { cellId, newContent });
    setCells(oldCells => oldCells.map(cell => cell.id === cellId ? { ...cell, content: newContent } : cell));
  }

  function execute_cell(cellId: string) {
    invoke("execute_cell", { cellId });
  }

  return (
    <div className="App">
      {cells.map(cell => (
        <div key={cell.id}>
          <textarea
            value={cell.content}
            onChange={e => update_cell(cell.id, e.target.value)}
          />
          <button onClick={() => execute_cell(cell.id)}>Execute</button>
        </div>
      ))}
      <button onClick={create_cell}>New Cell</button>
    </div>
  );

}

export default App