import { useState } from 'react';
import { invoke } from "@tauri-apps/api/tauri";

export function useNotebook() {
  const [cells, setCells] = useState<string[]>([]);

  async function createCell() {
    const id = (await invoke("create_cell")) as string;
    setCells(oldCells => [...oldCells, id]);
  }

  // TODO(kyle): Listen to events from the backend to update the cell list

  return { cells, createCell };
}