import Cell from "@/components/Cell";

import { Button} from "@/components/ui/button";
import { useNotebook } from '@/hooks/useNotebook';

function App() {
  const { cells, createCell } = useNotebook();
  return (
    <div>
      {cells.map((cellId: string) => (
          <Cell cellId={cellId}/>
      ))}
      <Button onClick={createCell}>New Cell</Button>
    </div>
  );
}

export default App;
