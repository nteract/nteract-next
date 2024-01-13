import {useCodeMirror} from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { markdown } from "@codemirror/lang-markdown";
import { lightTheme } from "@/codemirror-themes";

import { StateField } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { useCell } from "@/hooks/useCell";

import { invoke } from "@tauri-apps/api/tauri";

import { useRef, useEffect, useMemo } from "react";

import { cn } from "@/lib/utils"

const styleTheme = EditorView.baseTheme({
  "&.cm-editor.cm-focused": {
    // This combo here is Tailwind's focus-visible:ring-1, focus-visible:ring-ring, focus-visible:outline-none
    outline: "2px solid transparent",
    outlineOffset: "2px",
    boxShadow: "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color), var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) hsl(var(--ring)), var(--tw-shadow, 0 0 #0000)",
  },
  "&.cm-editor": {

  },
  ".cm-content": {
    "padding": "0",
    // From Tailwind's text-sm. Not sure if this is actually applying it.
    "font-size": "0.875rem",
    "line-height": "1.25rem",
  }
});

const cellIdState = StateField.define<string>({
  create: () => "",
  update: (cellId) => {
    return cellId;
  },
});

export const executeKeybinding = {
  key: "Ctrl-Enter",
  run: (view: EditorView) => {
    const cellId = view.state.field(cellIdState);
    invoke("execute_cell", { cellId });
    return true;
  },
  preventDefault: true,
};

// TODO(Kyle): This should also change the focused cell
export const executeAndGoDownKeybinding = {
  key: "Shift-Enter",
  run: (view: EditorView) => {
    const cellId = view.state.field(cellIdState);
    invoke("execute_cell", { cellId });
    return true;
  },
  preventDefault: true,
};

const baseExtensions = [
  styleTheme,
  lightTheme,
  keymap.of([executeKeybinding]),
  keymap.of([executeAndGoDownKeybinding])
];

export const Editor = ({ cellId, className, language }: { cellId: string, className?: string, language: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { content, updateCell } = useCell(cellId);

  // We need to compute a derived extensions state based on the language of the editor
  const extensions = useMemo(() => {
    let extensions = [...baseExtensions, cellIdState.init(() => cellId)];

    switch (language) {
      case "javascript":
        extensions.push(javascript());
        break;
      case "python":
        extensions.push(python());
        break;
      case "markdown":
        extensions.push(markdown());
        break;
      default:
        break;
    }
    return extensions;
  }, [language, cellId]);

  // NOTE(Kyle): In the long run I'd like to have the cell update and synchronization rely on CodeMirror collaboration,
  //             transactions and all. For now we can just use the onChange callback to update the cell content. 

  const { setContainer } = useCodeMirror({
    container: ref.current,
    extensions,
    width: "100%",
    value: content,
    onChange: updateCell,
    indentWithTab: false,
  });

  const classes = cn(
    "flex w-full h-full bg-transparent",
    className
  )

  useEffect(() => {
    if (ref.current) {
      setContainer(ref.current);
    }
  }, [ref.current]);

  return <div ref={ref} className={classes} />;

}
