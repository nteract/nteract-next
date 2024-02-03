import { useState, useCallback } from 'react';
import { invoke } from "@tauri-apps/api/tauri";

type CellInfo = {
  id: string,
  cellType: "code" | "markdown"
}

export function useNotebook() {
  const [cells, setCells] = useState<CellInfo[]>([]);

  const createCell = useCallback(async (cellType: "code" | "markdown") => {
    const id = (await invoke("create_cell", { cellType })) as string;
    setCells(oldCells => [...oldCells, { id, cellType }]);
  }, []);

  const createCodeCell = useCallback(() => createCell("code"), [createCell]);
  const createMarkdownCell = useCallback(() => createCell("markdown"), [createCell]);

  return { cells, createCell, createCodeCell, createMarkdownCell};
}