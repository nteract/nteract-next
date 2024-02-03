import { useState, useEffect, useCallback, useReducer } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from '@tauri-apps/api/event'

enum ExecutionState {
  Idle = "idle",
  Queued = "queued",
  Busy = "busy",
  Errored = "errored",
  Submitted = "submitted"
}

type Action = { type: 'setSubmitted' } | { type: 'reset' } | {type: "setOutputs", outputs: []}

type CellState = {
  executionState: ExecutionState;
  outputs: [];
}

const initialState: CellState = {
  executionState: ExecutionState.Idle,
  outputs: []
};

function cellReducer(state: CellState, action: Action) {
  switch (action.type) {
    case 'setSubmitted':
      return { ...state, executionState: ExecutionState.Submitted };
    case 'reset':
      return { ...state, executionState: ExecutionState.Idle };
    case 'setOutputs':
      return {...state, outputs: action.outputs }
    default:
      return state;
  }
}

export function useCell(cellId: string) {
  const [content, setContent] = useState<string>("");

  const updateCell = useCallback(async (newContent: string) => {
    try {
      setContent(newContent);
      await invoke("update_cell", { cellId, newContent });
    } catch (error) {
      console.error(error);
      // Handle error
    }
  }, [cellId]);


  useEffect(() => {
    const setupListener = async () => {
      const unlisten = await listen(`cell-${cellId}`, (event) => {
        const cellUpdate = event.payload as any;

        setContent(cellUpdate.source)
      });

      return () => {
        unlisten();
      };
    };

    setupListener();
  }, [cellId]);



  return { content, setContent, updateCell }
}

export function useMarkdownCell(cellId: string) {
  const { content, updateCell } = useCell(cellId);

  // TODO: Push/pull this from cell metadata
  const metadata = { };

  return { content, updateCell, metadata };
}

export function useCodeCell(cellId: string) {
  const { content, updateCell } = useCell(cellId);

  const [state, dispatch] = useReducer(cellReducer, initialState);
  
  const executeCell = useCallback(async () => {
    dispatch({ type: 'setSubmitted' });
    try {
      await invoke("execute_cell", { cellId });
    } catch (error) {
      console.error(error);
      // Handle error
    }
    dispatch({ type: 'reset' });
  }, [cellId]);

  useEffect(() => {
    const setupListener = async () => {
      const unlisten = await listen(`cell-outputs-${cellId}`, (event) => {
        // Q(Kyle): Do we need to check if the event.windowLabel matches ours
        const outputs = event.payload as [];

        dispatch({type: "setOutputs", outputs})

      });

      return () => {
        unlisten();
      };
    };

    setupListener();
  }, [cellId]);

  return { ...state, content, executeCell, updateCell, executionCount: null};
}
