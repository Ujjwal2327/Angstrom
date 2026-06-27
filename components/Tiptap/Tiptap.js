"use client";
// components/Tiptap/Tiptap.js
//
// ProseMirror and the useEditor hook both require the DOM and browser APIs.
// "use client" is required here in Next.js 16 — the component is imported
// both directly (profile viewer AchievementsSection) and transitively
// (edit form AchievementsSection → ProfileForm). Marking it explicitly here
// ensures the client boundary is set at the right level regardless of which
// parent imports it.

import "./Tiptap.scss";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import Blockquote from "@tiptap/extension-blockquote";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import History from "@tiptap/extension-history";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  Link as LinkIcon,
  Code,
  TextQuote,
  Heading as HeadingIcon,
  Undo,
  Redo,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const lowlight = createLowlight(all);

export default function Tiptap({ desc, onChange }) {
  const editor = useEditor({
    extensions: [
      Placeholder.configure({ placeholder: "Write your achievements here…" }),
      Document,
      Paragraph,
      Text,
      CodeBlockLowlight.configure({ lowlight }),
      BulletList,
      ListItem,
      Blockquote,
      Heading.configure({ levels: [2] }),
      Bold,
      Italic,
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["ftp", "mailto", "http", "https"],
      }),
      History,
    ],
    content: desc,
    editorProps: {
      attributes: {
        class: `w-full rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          onChange
            ? "p-4 pb-2 my-4 min-h-32 border border-input bg-background"
            : "-mb-5"
        }`,
      },
    },
    editable: Boolean(onChange),
    onUpdate({ editor }) {
      if (onChange) onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="pt-3">
      {onChange && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({ label, pressed, onClick, children, disabled }) {
  return (
    <Tooltip>
      {/* asChild prevents nested <button> — TooltipTrigger renders its own
          button element; asChild merges those props onto the child instead. */}
      <TooltipTrigger asChild>
        {pressed !== undefined ? (
          <Toggle
            type="button"
            pressed={pressed}
            variant="outline"
            size="sm"
            onClick={onClick}
            aria-label={label}
          >
            {children}
          </Toggle>
        ) : (
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            size="sm"
            onClick={onClick}
            aria-label={label}
          >
            {children}
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function Toolbar({ editor }) {
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null || url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    let normalized = url.trim();
    const protocolRegex =
      /^(https?|mailto|ftp|tel|sms|data|file|geo|news|irc|telnet|ssh|javascript|magnet):/i;
    if (!protocolRegex.test(normalized)) normalized = `https://${normalized}`;
    try {
      new URL(normalized);
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: normalized })
        .run();
    } catch {
      window.alert("Invalid URL");
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  };

  return (
    <div className="control-group">
      <TooltipProvider>
        <div className="button-group flex flex-wrap items-center gap-1">
          <ToolbarButton
            label="Heading"
            pressed={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <HeadingIcon />
          </ToolbarButton>

          <ToolbarButton
            label="Bold"
            pressed={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <BoldIcon />
          </ToolbarButton>

          <ToolbarButton
            label="Italic"
            pressed={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <ItalicIcon />
          </ToolbarButton>

          <ToolbarButton
            label="Link"
            pressed={editor.isActive("link")}
            onClick={setLink}
          >
            <LinkIcon />
          </ToolbarButton>

          <ToolbarButton
            label="Code"
            pressed={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code />
          </ToolbarButton>

          <ToolbarButton
            label="Bullet List"
            pressed={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List />
          </ToolbarButton>

          <ToolbarButton
            label="Blockquote"
            pressed={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <TextQuote />
          </ToolbarButton>

          <ToolbarButton
            label="Undo"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo />
          </ToolbarButton>

          <ToolbarButton
            label="Redo"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo />
          </ToolbarButton>
        </div>
      </TooltipProvider>
    </div>
  );
}
