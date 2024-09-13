"use client";
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
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";

const lowlight = createLowlight(all);
export default function Tiptap({ desc, onChange }) {
  const editor = useEditor({
    extensions: [
      Placeholder.configure({
        placeholder: "Write your achievements here …",
      }),
      Document,
      Paragraph,
      Text,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      BulletList,
      ListItem,
      Blockquote,
      Heading.configure({
        levels: [2],
      }),
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
        class: `w-full rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          onChange
            ? "p-4 pb-2 my-4 min-h-32 border border-input bg-background"
            : "-mb-4"
        }`,
      },
    },
    editable: onChange ? true : false,
    onUpdate({ editor }) {
      if (onChange) onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="pt-3">
      {onChange && <Toolbar editor={editor} desc={desc} onChange={onChange} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, desc, onChange }) {
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null || url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    let normalizedUrl = url.trim();

    // Regex to match supported protocols with their `:`
    const protocolRegex =
      /^(https?|mailto|ftp|tel|sms|data|file|geo|news|irc|telnet|ssh|javascript|magnet):/i;

    // If URL does not start with a recognized protocol, add "https://"
    if (!protocolRegex.test(normalizedUrl))
      normalizedUrl = `https://${normalizedUrl}`;

    // Validate URL and ensure it doesn't start with the current window's URL
    try {
      new URL(normalizedUrl); // Check if it's a valid URL
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: normalizedUrl })
        .run();
    } catch (error) {
      window.alert("Invalid URL:", normalizedUrl);
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  };

  return (
    <div className="control-group">
      <div className="button-group flex flex-wrap items-center gap-1">
        {/* heading */}
        <Toggle
          pressed={editor.isActive("heading", { level: 2 })}
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <HeadingIcon />
        </Toggle>

        {/* bold */}
        <Toggle
          pressed={editor.isActive("bold")}
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </Toggle>

        {/* italic */}
        <Toggle
          pressed={editor.isActive("italic")}
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </Toggle>

        {/* link */}
        <Toggle
          pressed={editor.isActive("link")}
          variant="outline"
          size="sm"
          onClick={setLink}
        >
          <LinkIcon />
        </Toggle>

        {/* code */}
        <Toggle
          pressed={editor.isActive("codeBlock")}
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code />
        </Toggle>

        {/* unordered list */}
        <Toggle
          pressed={editor.isActive("bulletList")}
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </Toggle>

        {/* blockquote */}
        <Toggle
          pressed={editor.isActive("blockquote")}
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <TextQuote />
        </Toggle>

        {/* undo */}
        <Button
          disabled={!editor.can().undo()}
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo />
        </Button>

        {/* blockquote */}
        <Button
          disabled={!editor.can().redo()}
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo />
        </Button>
      </div>
    </div>
  );
}
