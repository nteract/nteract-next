import {CodeCell} from "@/components/code-cell"

const Cell = ({ cellId }: { cellId: string }) => {
  // Until we have cell types coming in from the backend, we'll assume this is a code cell
  return <CodeCell cellId={cellId} />

};

export default Cell;
