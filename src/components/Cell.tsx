import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCell } from "../hooks/useCell";

const Cell = ({ cellID }: { cellID: string }) => {
  const { content, executeCell, updateCell, cellState, executionCount } = useCell(cellID);

  let actionIcon = "▶";

  switch(cellState) {
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
        className="font-mono mr-2 text-sm group w-14"
        onClick={executeCell}
      >
        [
        <div className="group-hover:block hidden">{actionIcon}</div>
        <span className="group-hover:hidden">{executionCount}</span>
        ]
      </Button>
      <Input
        type="text"
        placeholder="write code..."
        className="mr-2 font-mono text-sm"
        value={content}
        onChange={(e) => updateCell(e.target.value)}
      />
    </div>
  );
};

export default Cell;
