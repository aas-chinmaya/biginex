"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Toolbar } from "./Toolbar";
import { editorExtensions } from "./extensions";
import "./editor.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  editable = true,
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: editorExtensions,
    content: value,
    editable,
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[250px] focus:outline-none px-4 py-3",
        "data-placeholder": placeholder,
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, {
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(editable);
  }, [editable, editor]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-gray-200 bg-white",
        className
      )}
    >
      <Toolbar editor={editor} />

      <Separator />

      {editor ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="flex min-h-[250px] items-center justify-center px-4 py-3 text-sm text-muted-foreground">
          Loading editor...
        </div>
      )}
    </div>
  );
}
