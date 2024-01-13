import Cell from "@/components/Cell";

import { Button} from "@/components/ui/button";
import { useNotebook } from '@/hooks/useNotebook';

function App() {
  const { cells, createCell } = useNotebook();
  return (
    <div>
      {cells.map((cellID: string) => (
          <Cell cellID={cellID}/>
      ))}
      <Button onClick={createCell}>New Cell</Button>
    </div>
  );
}

export default App;
