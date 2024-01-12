import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"


const Cell = () => {
  return (
    <div className="bg-gray-100 p-4 rounded flex items-start">
      <Button variant="ghost" className="font-mono mr-2 text-sm">[2]</Button>
      <Input
        type="text"
        placeholder="write code..."
        className="mr-2 font-mono text-sm"
      />
    </div>
  );
};

export default Cell;
