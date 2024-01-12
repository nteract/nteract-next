import Cell from "@/components/Cell";
import { useNotebook } from '@/hooks/useNotebook';

function App() {
  const { cells, createCell } = useNotebook();
  return (
    <div>
      {cells.map((cellID: string) => (
          <Cell cellID={cellID}/>
      ))}
      <button onClick={createCell}>New Cell</button>
    </div>
  );
}

export default App;
