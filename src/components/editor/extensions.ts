import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

export const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
  }),

  Underline,

  Highlight.configure({
    multicolor: true,
  }),

  TextStyle,

  Color,

  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      rel: "noopener noreferrer",
      target: "_blank",
      class: "text-primary underline",
    },
  }),

  Image.configure({
    inline: false,
    allowBase64: true,
  }),

  Typography,

  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),

  Placeholder.configure({
    placeholder: "Start typing...",
  }),
];