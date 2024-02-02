import { useEffect } from "react";
import { useRemark } from "react-remark";

import { useMarkdownCell } from "@/hooks/useCell";

export const MarkdownCell = ({ cellId }: { cellId: string }) => {
  const { content } = useMarkdownCell(cellId);

  const [reactContent, setMarkdownSource] = useRemark();

  useEffect(() => {
    setMarkdownSource(content);
  }, [content]);


  return (
    <div className="flex items-start">
      <div className="w-14 h-full pt-1 pb-1 m-0">
      {/* placeholder */}
      </div>

      <div className="prose">{reactContent}</div>
    </div>
  );
};

export default MarkdownCell;
