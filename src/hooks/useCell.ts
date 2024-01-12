import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/tauri";

type CellStates = "idle" | "queued" | "busy" | "errored" | "submitted";

export function useCell(cellId: string) {
  const [content, setContent] = useState<string>("");

  // We also find out the execution count, whether the cell is queued, busy, or
  // errored, and the output of the cell. We can use this to display the
  // execution count, a spinner, or an error message.

  // Execution count is only set by the backend.

  const executionCount = 0; // TODO: get from backend

  // Queued, busy, and errored are set by the backend. However, we have to
  // have our own state for queued for before the backend has acknowledged the
  // execution request.

  const [executionSubmitted, setExecutionSubmitted] = useState<boolean>(false);

  let cellState: CellStates = "idle";

  if (executionSubmitted) {
    cellState = "submitted";
  }

  const executeCell = useCallback(async () => {
    setExecutionSubmitted(true);
    await invoke("execute_cell", { cellId });
    setExecutionSubmitted(false);
  }, [cellId]);

  const updateCell = useCallback(
    async (newContent: string) => {
      await invoke("update_cell", { cellId, newContent });
      setContent(newContent);
    },
    [cellId]
  );

  // TODO(kyle): Listen for events from the backend to update the cell content

  return { content, executeCell, updateCell, cellState: cellState as CellStates, executionCount };
}
