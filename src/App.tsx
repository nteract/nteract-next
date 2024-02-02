import Cell from "@/components/Cell";

import { Button} from "@/components/ui/button";
import { useNotebook } from '@/hooks/useNotebook';

function App() {
  const { cells, createCodeCell, createMarkdownCell } = useNotebook();
  return (
    <div>
      {cells.map((cellId: string) => (
          <Cell cellId={cellId} key={cellId}/>
      ))}
      <Button onClick={createCodeCell}>New Code Cell</Button>
      <Button onClick={createMarkdownCell}>New Markdown Cell</Button>
    </div>
  );
}

export default App;
