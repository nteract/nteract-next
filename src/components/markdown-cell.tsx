import { useEffect } from "react";
import { useRemark } from "react-remark";

import { useMarkdownCell } from "@/hooks/useCell";

import { Editor } from "@/components//Editor";

export const MarkdownCell = ({ cellId }: { cellId: string }) => {
  const { content } = useMarkdownCell(cellId);

  const [reactContent, setMarkdownSource] = useRemark();

  useEffect(() => {
    setMarkdownSource(content);
  }, [content]);

  console.log(content)


  return (
    <div className="flex items-start">
      <div className="w-14 h-full pt-1 pb-1 m-0">
      {/* placeholder */}
      </div>

      <Editor
          cellId={cellId}
          className="mr-2 pt-0 pb-0 text-sm"
          language="markdown"
        />

      <div className="prose">{reactContent}</div>
    </div>
  );
};

export default MarkdownCell;
