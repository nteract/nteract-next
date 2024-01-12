import { useState } from 'react';
import { invoke } from "@tauri-apps/api/tauri";

export function useCell(cellId: string) {
  const [content, setContent] = useState<string>('');

  async function executeCell() {
    await invoke("execute_cell", { cellId });
  }

  async function updateCell(newContent: string) {
    await invoke("update_cell", { cellId, newContent });
    setContent(newContent);
  }

  // TODO(kyle): Listen for events from the backend to update the cell content

  return { content, executeCell, updateCell };
}