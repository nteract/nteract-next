import { Button } from "@/components/ui/button";

import { useCodeCell } from "@/hooks/useCell";
import { Editor } from "@/components//Editor";

export const CodeCell = ({ cellId }: { cellId: string }) => {
  const { executeCell, executionState, executionCount, outputs } =
    useCodeCell(cellId);

  let actionIcon = "▶";
  let showExecutionCountAs = executionCount === null ? " " : executionCount;

  switch (executionState) {
    case "idle":
    // Let them try again
    case "errored":
      actionIcon = "▶";
      break;
    case "submitted":
    case "busy":
    case "queued":
      actionIcon = "⏹";
      showExecutionCountAs = "*";
      break;
  }

  return (
    <div>
      <div className="bg-gray-100 p-4 rounded flex items-start">
        <Button
          variant="ghost"
          className="font-mono text-sm group w-14 h-full pt-0 pb-0 m-0"
          onClick={executeCell}
        >
          [<div className="group-hover:block hidden">{actionIcon}</div>
          <span className="group-hover:hidden">{showExecutionCountAs}</span>]
        </Button>
        <Editor
          cellId={cellId}
          className="mr-2 pt-0 pb-0 text-sm"
          language="python"
        />
      </div>
      {outputs && outputs.length > 0 ? (
        <pre>{JSON.stringify(outputs, null, 2)}</pre>
      ) : null}
    </div>
  );
};

export default CodeCell;
