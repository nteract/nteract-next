import { Button } from "@/components/ui/button";
import { useNotebook } from '@/hooks/useNotebook';

import { MarkdownCell } from "@/components/markdown-cell"
import { CodeCell } from '@/components/code-cell'

function App() {
  const { cells, createCodeCell, createMarkdownCell } = useNotebook();
  return (
    <div>
      {cells.map((cellInfo) => {
        switch (cellInfo.cellType) {
          case "code":
            return <CodeCell cellId={cellInfo.id} key={cellInfo.id} />
          case "markdown":
            return <MarkdownCell cellId={cellInfo.id} key={cellInfo.id} />
          default:
            return "Unknown cell type"
        }
      })}
      <Button onClick={createCodeCell}>New Code Cell</Button>
      <Button onClick={createMarkdownCell}>New Markdown Cell</Button>
    </div>
  );
}

export default App;
