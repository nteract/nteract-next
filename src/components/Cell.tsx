import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCell } from '../hooks/useCell';

const Cell = ({cellID}: { cellID: string }) => {
    const { content, executeCell, updateCell } = useCell(cellID);

  return (
    <div className="bg-gray-100 p-4 rounded flex items-start">
      <Button variant="ghost" className="font-mono mr-2 text-sm" onClick={executeCell}>
        [2]
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
