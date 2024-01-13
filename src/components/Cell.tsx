import { Button } from "@/components/ui/button";

import { useCell } from "@/hooks/useCell";
import { Editor } from "@/components//Editor";

const Cell = ({ cellId }: { cellId: string }) => {
  const { executeCell, cellState, executionCount } = useCell(cellId);

  let actionIcon = "▶";

  switch (cellState) {
    case "idle":
    // Let them try again
    case "errored":
      actionIcon = "▶";
      break;
    case "submitted":
    case "busy":
    case "queued":
      actionIcon = "⏹";
      break;
  }

  return (
    <div className="bg-gray-100 p-4 rounded flex items-start">
      <Button
        variant="ghost"
        className="font-mono text-sm group w-14 h-full pt-0 pb-0 m-0"
        onClick={executeCell}
      >
        [<div className="group-hover:block hidden">{actionIcon}</div>
        <span className="group-hover:hidden">{executionCount}</span>]
      </Button>
      <Editor cellId={cellId} className="mr-2 pt-0 pb-0 text-sm" language="python"/>
    </div>
  );
};

export default Cell;
