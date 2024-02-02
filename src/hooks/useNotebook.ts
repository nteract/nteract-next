import { useState, useCallback } from 'react';
import { invoke } from "@tauri-apps/api/tauri";

export function useNotebook() {
  const [cells, setCells] = useState<string[]>([]);

  async function createCell(cellType: "code" | "markdown") {
    const id = (await invoke("create_cell", { cellType })) as string;
    setCells(oldCells => [...oldCells, id]);
  }

  const createCodeCell = useCallback(() => createCell("code"), [createCell]);
  const createMarkdownCell = useCallback(() => createCell("markdown"), [createCell]);

  return { cells, createCell, createCodeCell, createMarkdownCell};
}