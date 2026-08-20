"use client";

import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface ToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  onClick: () => void;
  disabled: boolean;
  isActive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

/**
 * Vertical separator
 *
 * Your custom Separator component does not support
 * the `orientation` prop, so we use a simple div.
 */
function ToolbarSeparator() {
  return (
    <div
      aria-hidden="true"
      className="mx-1 h-6 w-px shrink-0 bg-border"
    />
  );
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const renderButton = ({
    onClick,
    disabled,
    isActive = false,
    icon: Icon,
    label,
  }: ToolbarButtonProps) => (
    <Tooltip>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>

      <Button
        type="button"
        variant={isActive ? "primary" : "ghost"}
        size="icon"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="h-8 w-8 shrink-0"
      >
        <Icon className="h-4 w-4" />
      </Button>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-[#f8fafc] p-2">
        {/* Undo / Redo */}

        {renderButton({
          onClick: () => editor.chain().focus().undo().run(),
          disabled: !editor.can().chain().focus().undo().run(),
          icon: Undo2,
          label: "Undo",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().redo().run(),
          disabled: !editor.can().chain().focus().redo().run(),
          icon: Redo2,
          label: "Redo",
        })}

        <ToolbarSeparator />

        {/* Text Formatting */}

        {renderButton({
          onClick: () => editor.chain().focus().toggleBold().run(),
          disabled: !editor.can().chain().focus().toggleBold().run(),
          isActive: editor.isActive("bold"),
          icon: Bold,
          label: "Bold",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().toggleItalic().run(),
          disabled: !editor.can().chain().focus().toggleItalic().run(),
          isActive: editor.isActive("italic"),
          icon: Italic,
          label: "Italic",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          disabled: !editor.can().chain().focus().toggleUnderline().run(),
          isActive: editor.isActive("underline"),
          icon: Underline,
          label: "Underline",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().toggleStrike().run(),
          disabled: !editor.can().chain().focus().toggleStrike().run(),
          isActive: editor.isActive("strike"),
          icon: Strikethrough,
          label: "Strikethrough",
        })}

        <ToolbarSeparator />

        {/* Headings */}

        {renderButton({
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run(),
          isActive: editor.isActive("heading", { level: 1 }),
          icon: Heading1,
          label: "Heading 1",
        })}

        {renderButton({
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run(),
          isActive: editor.isActive("heading", { level: 2 }),
          icon: Heading2,
          label: "Heading 2",
        })}

        {renderButton({
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run(),
          isActive: editor.isActive("heading", { level: 3 }),
          icon: Heading3,
          label: "Heading 3",
        })}

        <ToolbarSeparator />

        {/* Lists */}

        {renderButton({
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          disabled: !editor.can().chain().focus().toggleBulletList().run(),
          isActive: editor.isActive("bulletList"),
          icon: List,
          label: "Bullet List",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          disabled: !editor.can().chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive("orderedList"),
          icon: ListOrdered,
          label: "Ordered List",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          disabled: !editor.can().chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive("blockquote"),
          icon: Quote,
          label: "Blockquote",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          disabled: !editor.can().chain().focus().toggleCodeBlock().run(),
          isActive: editor.isActive("codeBlock"),
          icon: Code2,
          label: "Code Block",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().setHorizontalRule().run(),
          disabled: !editor.can().chain().focus().setHorizontalRule().run(),
          icon: Minus,
          label: "Horizontal Rule",
        })}

        <ToolbarSeparator />

        {/* Alignment */}

        {renderButton({
          onClick: () => editor.chain().focus().setTextAlign("left").run(),
          disabled: !editor.can().chain().focus().setTextAlign("left").run(),
          isActive: editor.isActive({ textAlign: "left" }),
          icon: AlignLeft,
          label: "Align Left",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().setTextAlign("center").run(),
          disabled: !editor.can().chain().focus().setTextAlign("center").run(),
          isActive: editor.isActive({ textAlign: "center" }),
          icon: AlignCenter,
          label: "Align Center",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().setTextAlign("right").run(),
          disabled: !editor.can().chain().focus().setTextAlign("right").run(),
          isActive: editor.isActive({ textAlign: "right" }),
          icon: AlignRight,
          label: "Align Right",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().setTextAlign("justify").run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .setTextAlign("justify")
            .run(),
          isActive: editor.isActive({ textAlign: "justify" }),
          icon: AlignJustify,
          label: "Align Justify",
        })}

        <ToolbarSeparator />

        {/* Highlight */}

        {renderButton({
          onClick: () => editor.chain().focus().toggleHighlight().run(),
          disabled: !editor.can().chain().focus().toggleHighlight().run(),
          isActive: editor.isActive("highlight"),
          icon: Highlighter,
          label: "Highlight",
        })}

        <ToolbarSeparator />

        {/* Link */}

        {renderButton({
          onClick: () => {
            const previousUrl = editor.getAttributes("link").href;

            const url = window.prompt("Enter URL", previousUrl || "");

            if (url === null) return;

            if (url.trim() === "") {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .unsetLink()
                .run();

              return;
            }

            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({
                href: url.trim(),
              })
              .run();
          },
          disabled: !editor
            .can()
            .chain()
            .focus()
            .setLink({ href: "" })
            .run(),
          isActive: editor.isActive("link"),
          icon: Link2,
          label: "Insert Link",
        })}

        {renderButton({
          onClick: () => editor.chain().focus().unsetLink().run(),
          disabled: !editor.can().chain().focus().unsetLink().run(),
          icon: Unlink,
          label: "Remove Link",
        })}

        <ToolbarSeparator />

        {/* Image */}

        {renderButton({
          onClick: () => {
            const url = window.prompt("Enter image URL");

            if (!url || !url.trim()) return;

            editor
              .chain()
              .focus()
              .setImage({
                src: url.trim(),
              })
              .run();
          },
          disabled: !editor
            .can()
            .chain()
            .focus()
            .setImage({ src: "" })
            .run(),
          icon: ImagePlus,
          label: "Insert Image",
        })}
      </div>
    </TooltipProvider>
  );
}
