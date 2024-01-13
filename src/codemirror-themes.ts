import { createTheme } from "thememirror";
import { tags as t } from "@lezer/highlight";

// Based on Ayu Light and ThemeMirror
export const lightTheme = createTheme({
  variant: "light",
  settings: {
    background: "#FFFFFF", // '#fcfcfc',
    foreground: "#0F172A", //'#5c6166',
    caret: "#ffaa33",
    selection: "#F1F5F9", //'#036dd626',
    gutterBackground: "#FFFFFF", //'#fcfcfc',
    gutterForeground: "#8a919966",
    lineHighlight: "#8a91991a",
  },
  styles: [
    {
      tag: t.comment,
      color: "#787b8099",
    },
    {
      tag: t.string,
      color: "#86b300",
    },
    {
      tag: t.regexp,
      color: "#4cbf99",
    },
    {
      tag: [t.number, t.bool, t.null],
      color: "#ffaa33",
    },
    {
      tag: t.variableName,
      color: "#5c6166",
    },
    {
      tag: [t.definitionKeyword, t.modifier],
      color: "#fa8d3e",
    },
    {
      tag: [t.keyword, t.special(t.brace)],
      color: "#fa8d3e",
    },
    {
      tag: t.operator,
      color: "#ed9366",
    },
    {
      tag: t.separator,
      color: "#5c6166b3",
    },
    {
      tag: t.punctuation,
      color: "#5c6166",
    },
    {
      tag: [t.definition(t.propertyName), t.function(t.variableName)],
      color: "#f2ae49",
    },
    {
      tag: [t.className, t.definition(t.typeName)],
      color: "#22a4e6",
    },
    {
      tag: [t.tagName, t.typeName, t.self, t.labelName],
      color: "#55b4d4",
    },
    {
      tag: t.angleBracket,
      color: "#55b4d480",
    },
    {
      tag: t.attributeName,
      color: "#f2ae49",
    },
  ],
});

// Based on Cool Glow and ThemeMirror
export const darkTheme = createTheme({
  variant: "dark",
  settings: {
    background: "#030711", //'#060521',
    foreground: "#E1E7EF", //'#E0E0E0',
    caret: "#FFFFFFA6",
    selection: "#0F1629", //'#122BBB',
    gutterBackground: "#030711", //'#060521',
    gutterForeground: "#E1E7EF90",
    lineHighlight: "#FFFFFF0F",
  },
  styles: [
    {
      tag: t.comment,
      color: "#AEAEAE",
    },
    {
      tag: [t.string, t.special(t.brace), t.regexp],
      color: "#8DFF8E",
    },
    {
      tag: [
        t.className,
        t.definition(t.propertyName),
        t.function(t.variableName),
        t.function(t.definition(t.variableName)),
        t.definition(t.typeName),
      ],
      color: "#A3EBFF",
    },
    {
      tag: [t.number, t.bool, t.null],
      color: "#62E9BD",
    },
    {
      tag: [t.keyword, t.operator],
      color: "#2BF1DC",
    },
    {
      tag: [t.definitionKeyword, t.modifier],
      color: "#F8FBB1",
    },
    {
      tag: [t.variableName, t.self],
      color: "#B683CA",
    },
    {
      tag: [t.angleBracket, t.tagName, t.typeName, t.propertyName],
      color: "#60A4F1",
    },
    {
      tag: t.derefOperator,
      color: "#E0E0E0",
    },
    {
      tag: t.attributeName,
      color: "#7BACCA",
    },
  ],
});
