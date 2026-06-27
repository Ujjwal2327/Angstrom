"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Copy, Moon, RotateCcw, Send, Sun, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import "./MarkdownEditor.css";
import {
  getCommands,
  getExtraCommands,
} from "@uiw/react-md-editor/nohighlight";
import { getCodeString } from "rehype-rewrite";
import mermaid from "mermaid";
import { mergeSkills } from "@/utils";
import { profiles } from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loader from "@/components/ui/Loader";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <Loader className="h-[calc(var(--vh,1vh)*100-7.5rem)]" />,
});

const defaultMarkdownValue = `<!-- Project Readme Templates: https://www.readme-templates.com/-->

# Markdown Editor
Welcome to the Markdown Editor! This example showcases various Markdown features.

## Headers
You can create headers using \`#\` for H1, \`##\` for H2, and so on.

### H3 Example

## Formatting
- **Bold text**: \`**This is bold**\`
- _Italic text_: \`_This is italic_\`
- ~~Strikethrough~~: \`~~This is strikethrough~~\`

## Lists
- Item 1
- Item 2
  - Subitem 1

1. First item
2. Second item

## Links
[OpenAI](https://www.openai.com)

## Images
![Markdown Logo](https://markdown-here.com/img/icon256.png)

## Inline Code
Inline code: \`console.log('Hello, Markdown!');\`

## Code block:
\`\`\`javascript
function greet() {
    console.log('Hello, world!');
}
\`\`\`

## Blockquotes
> This is a blockquote.

## Task List
- [x] Task 1
- [ ] Task 2

## Tables
| Header 1 | Header 2 |
|----------|----------|
| Row 1    | Row 2    |

## UML diagrams

\`\`\`mermaid
sequenceDiagram
Alice ->> Bob: Hello Bob, how are you?
Bob-->>John: How about you John?
Bob--x Alice: I am good thanks!
\`\`\`
`;

function generateGitHubReadme(user) {
  const {
    username,
    email,
    firstname,
    lastname,
    about,
    profiles: userProfiles = {},
    skills = [],
    projects = [],
    experience = [],
  } = user;

  const githubUsername = userProfiles.github || "github_username";
  const fullname =
    [firstname, lastname].filter(Boolean).join(" ").trim() ||
    githubUsername ||
    username;
  const mergedSkills = mergeSkills();

  let readme = `<!-- ${githubUsername}/README.md -->\n<!-- Basic Customization Required -->\n\n`;

  const introSections = [
    `<div align="center">\n\n`,
    `<img src="https://komarev.com/ghpvc/?username=${githubUsername}" align="right" />\n<br/>\n\n`,
    `![Intro](https://readme-typing-svg.herokuapp.com/?font=Righteous&size=35&center=true&vCenter=true&duration=4000&lines=Hi+There!+👋;+I'm+${fullname.replace(/ /g, "+")}!)\n\n`,
    about ? `### ${about}\n\n` : "",
    `### [🔗 Portfolio](https://angstrom.vercel.app/users/${username}) | [📧 Email](mailto:${email})\n\n`,
    `![${fullname}'s Github Stats Graph](https://github-readme-activity-graph-mnex.vercel.app/graph?username=${githubUsername}&bg_color=transparent&color=00b8b5&line=eb008b&point=FFFFFF&area=true&hide_border=true&hide_title=true)\n\n`,
    `</div>\n\n\n---  \n\n\n`,
  ];
  readme += introSections.join("");

  if (Object.keys(userProfiles).length > 0) {
    readme += `## 🧑‍💻 Profiles\n`;
    const profileIcons = Object.entries(userProfiles)
      .map(([profile, profileUsername]) => {
        const profileName = profiles[profile]?.name || profile;
        const profileIcon = profiles[profile]?.icon;
        return profileIcon
          ? `[<img src="${profileIcon}" alt="${profileName}" width="30" height="30" title="${profileName}" />](${profiles[profile].base_url}${profileUsername})&nbsp;`
          : null;
      })
      .filter(Boolean)
      .join("\n");
    readme += profileIcons + "\n\n\n---  \n\n\n";
  }

  if (skills.length) {
    readme += `## ✨ Tech Stack\n`;
    const skillIcons = skills
      .map((skill) => {
        const skillIcon = mergedSkills[skill]?.icon;
        return skillIcon
          ? `<img src="${skillIcon}" alt="${skill}" width="30" height="30" title="${skill}" />&nbsp;`
          : null;
      })
      .filter(Boolean)
      .join("\n");
    const remainingSkills = skills
      .filter((skill) => !mergedSkills[skill]?.icon)
      .join(", \n");
    readme += skillIcons + remainingSkills + "\n\n\n---  \n\n\n";
  }

  if (experience.length) {
    readme += `## 💼 Experience  \n`;
    readme +=
      experience
        .map(
          (exp) =>
            `### 🌟 ${exp.position} @ ${exp.company}\n- [ ${exp.start} - ${exp.end || "Present"} ]${exp.about ? `\n- ${exp.about}` : ""}`,
        )
        .join("\n\n") + "\n\n\n---  \n\n\n";
  }

  if (projects.length) {
    readme += `## 📁 Projects\n`;
    readme +=
      projects
        .map(
          (project) =>
            `### 🌟 ${project.name} | [Code](${project.code_url})${
              project.code_url !== project.live_url
                ? ` | [Live](${project.live_url})`
                : ""
            }\n- ${project.about}`,
        )
        .join("\n\n") + "\n\n\n---  \n\n\n";
  }

  readme += `## 🔥 GitHub Streak  \n`;
  readme += `<div align="center">\n\n![${fullname}'s GitHub Streak](https://streak-stats.demolab.com?user=${githubUsername}&theme=transparent)\n\n</div>\n\n\n---  \n\n\n`;

  const baseStatsUrl = `https://github-readme-stats.vercel.app/api?username=${githubUsername}&theme=transparent&show_icons=true`;
  readme += `## 🚀 GitHub Stats\n<div align="center">\n\n`;
  [
    `&hide=contribs,prs&rank_icon=github`,
    ``,
    `&show=reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage&rank_icon=percentile`,
  ].forEach((opt) => {
    readme += `![${fullname}'s GitHub stats](${baseStatsUrl}${opt})\n\n`;
  });
  readme += `</div>\n\n\n---  \n\n\n`;

  readme += `<div align="center">\n\n### ⭐️ Thanks for stopping by!\n\n</div>\n`;
  return readme;
}

export default function MarkdownEditor({ user }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultMarkdownValue);
  const [theme, setTheme] = useState("dark");
  const [previewMode, setPreviewMode] = useState("edit");
  const mermaidCounterRef = useRef(0);
  const mermaidIdRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", theme);
  }, [theme]);

  const handleResize = useCallback(() => {
    setPreviewMode(window.innerWidth >= 768 ? "live" : "edit");
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleReset = useCallback(() => {
    setValue((v) => (v === defaultMarkdownValue ? "" : defaultMarkdownValue));
  }, []);

  const themeToggleCommand = useMemo(
    () => ({
      name: "theme-toggle",
      keyCommand: "themeToggle",
      buttonProps: { "aria-label": "Toggle theme", title: "Toggle theme" },
      icon: <span>{theme === "light" ? <Sun /> : <Moon />}</span>,
      execute: () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [theme],
  );

  const copyCommand = useMemo(
    () => ({
      name: "copy",
      keyCommand: "copyMarkdown",
      buttonProps: {
        "aria-label": "Copy markdown",
        title: "Copy markdown (ctrl + a + c)",
      },
      icon: <Copy className="w-4 h-4" />,
      execute: () => {
        navigator.clipboard.writeText(value).then(() => {
          toast.success("Markdown copied to clipboard!");
        });
      },
    }),
    [value],
  );

  const resetCommand = useMemo(
    () => ({
      name: "reset",
      keyCommand: "reset",
      buttonProps: {
        "aria-label": "Reset editor content",
        title: "Reset editor content",
      },
      icon: <RotateCcw className="w-4 h-4" />,
      execute: handleReset,
    }),
    [handleReset],
  );

  const divider = useMemo(
    () => ({
      name: "divider",
      keyCommand: "divider",
      buttonProps: { "aria-label": "divider", title: "divider" },
      icon: <div className="w-[1pc] h-[14px] bg-[rgb(2,8,23)]" />,
      execute: () => {},
    }),
    [],
  );

  const MermaidRenderer = useCallback(({ code, id }) => {
    const [svg, setSvg] = useState("");
    const [error, setError] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
      let mounted = true;
      const render = async () => {
        try {
          mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
          const { svg: rendered } = await mermaid.render(`mermaid-${id}`, code);
          if (mounted) {
            setSvg(rendered);
            setError(null);
          }
        } catch (err) {
          if (mounted) setError(err.message);
        }
      };
      render();
      return () => {
        mounted = false;
      };
    }, [code, id]);

    useEffect(() => {
      if (svg && containerRef.current) containerRef.current.innerHTML = svg;
    }, [svg]);

    if (error)
      return (
        <div className="mermaid-error">Error rendering diagram: {error}</div>
      );
    return <div ref={containerRef} className="mermaid-container" />;
  }, []);

  const Code = useCallback(
    ({ inline, children = [], className, ...props }) => {
      const isMermaid =
        className && /^language-mermaid/.test(className.toLowerCase());
      const code = children
        ? getCodeString(props.node.children)
        : children[0] || "";

      if (isMermaid) {
        mermaidIdRef.current = mermaidCounterRef.current++;
        return (
          <MermaidRenderer
            code={code}
            id={mermaidIdRef.current}
            key={mermaidIdRef.current}
          />
        );
      }
      return <code className={className}>{children}</code>;
    },
    [MermaidRenderer],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // FIX: Nested <button> hydration error.
  //
  // @uiw/react-md-editor renders each toolbar command through the `toolbar`
  // render prop. Previously we wrapped <Button> in <TooltipTrigger> which
  // rendered its own <button> element, creating a <button>→<button> nesting.
  //
  // Fix: `asChild` on <TooltipTrigger> merges tooltip event handlers directly
  // onto the child <Button> instead of wrapping it in a second button element.
  // ─────────────────────────────────────────────────────────────────────────
  const memoizedComponents = useMemo(
    () => ({
      toolbar: (command, disabled, executeCommand) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* asChild → no extra <button> wrapper, tooltip props go here */}
              <Button
                onClick={(evn) => {
                  evn.stopPropagation();
                  executeCommand(command, command.groupName);
                }}
                aria-label={command.buttonProps?.["aria-label"]}
                disabled={disabled}
                type="button"
                variant="ghost"
                className="p-2"
              >
                {command.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{command.buttonProps?.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      code: Code,
    }),
    [Code],
  );

  const memoizedCommands = useMemo(
    () => [...getCommands(), resetCommand],
    [resetCommand],
  );

  const memoizedExtraCommands = useMemo(
    () => [
      copyCommand,
      divider,
      ...getExtraCommands(),
      divider,
      themeToggleCommand,
    ],
    [copyCommand, divider, themeToggleCommand],
  );

  return (
    <div className="flex flex-col">
      <MDEditor
        className="MDEditor"
        value={value}
        onChange={setValue}
        textareaProps={{ placeholder: "Please enter Markdown text…" }}
        preview={previewMode}
        commands={memoizedCommands}
        extraCommands={memoizedExtraCommands}
        components={memoizedComponents}
        visibleDragbar={false}
        previewOptions={{ components: { code: Code } }}
        enableScroll={false}
      />

      <div className="flex items-center justify-center gap-2 mt-3">
        {user?.profiles?.github ? (
          <Button
            onClick={() => {
              setValue(generateGitHubReadme(user));
              if (previewMode === "edit") setPreviewMode("preview");
            }}
            type="button"
            aria-label="Generate GitHub README"
            className="mx-auto"
            variant={theme === "light" ? "default" : "secondary"}
          >
            Generate GitHub README
            <WandSparkles size={15} className="ml-2" />
          </Button>
        ) : user?.username ? (
          <Button
            onClick={() => router.push(`/users/${user.username}/edit`)}
            type="button"
            aria-label="Add GitHub Username to generate README"
            className="mx-auto"
            variant={theme === "light" ? "default" : "secondary"}
          >
            Add GitHub Username
            <Send size={15} className="ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/sign-in")}
            type="button"
            aria-label="Sign in to generate GitHub README"
            className="mx-auto"
            variant={theme === "light" ? "default" : "secondary"}
          >
            Sign in to Generate README
            <Send size={15} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
