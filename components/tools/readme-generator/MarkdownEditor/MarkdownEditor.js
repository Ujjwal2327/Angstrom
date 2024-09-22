"use client";

import { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { Copy, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import "./MarkdownEditor.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  getCommands,
  getExtraCommands,
} from "@uiw/react-md-editor/nohighlight";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import mermaid from "mermaid";
import { mergeSkills } from "@/utils";
import { profiles } from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <Loader />,
});

const defaultMarkdownValue = `# Markdown Editor
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
  - Subitem 2

1. First item
2. Second item

## Links
[OpenAI](https://www.openai.com)

## Images
![Markdown Logo](https://markdown-here.com/img/icon256.png)

## Code
Inline code: \`console.log('Hello, Markdown!');\`

Code block:
\`\`\`javascript
function greet() {
    console.log('Hello, world!');
}
\`\`\`

## Blockquotes
> This is a blockquote.

## Horizontal Rule
---

## Task List
- [x] Task 1
- [ ] Task 2

## Tables
| Header 1 | Header 2 |
|----------|----------|
| Row 1    | Row 2    |
| Row 3    | Row 4    |
`;

function generateGitHubReadme(user) {
  // Destructure user data
  const {
    username,
    email,
    firstname,
    lastname,
    about,
    profiles: userProfiles = {},
    skills = [],
    projects = [],
    education = [],
    experience = [],
  } = user;

  // Start creating the README markdown
  let readme = "";
  const githubUsername = userProfiles.github || "github_username";

  // Generate full name
  const fullname =
    [firstname, lastname].filter(Boolean).join(" ").trim() ||
    githubUsername ||
    username;

  const mergedSkills = mergeSkills();

  readme += `<div align="center">\n\n`;
  readme += `![${fullname}'s Github Profile Counter Card](https://profile-counter.glitch.me/${githubUsername}/count.svg)\n\n`;
  readme += `# 👋 Hey, I'm ${fullname}!\n\n`;
  if (about) readme += `### ${about}\n\n`;
  readme += `### [🔗 Portfolio](https://angstrom.vercel.app/users/${username}) | [📧 Email](mailto:${email})\n\n`;
  readme += `![${fullname}'s Github Stats Graph](https://github-readme-activity-graph-mnex.vercel.app/graph?username=${username}&bg_color=transparent&color=00b8b5&line=eb008b&point=FFFFFF&area=true&hide_border=true&hide_title=true)\n\n`;
  readme += "</div>\n\n";
  readme += "\n---  \n\n\n";

  // Conditionally render "Profiles" if the user has any profiles
  if (Object.keys(userProfiles).length > 0) {
    readme += `## 🧑‍💻 Profiles\n`;
    readme += `<!--  multiple  [<img src="profile_icon" alt="profile_name" width="30" height="30" title="profile_name" />](user_profile_link)&nbsp;&nbsp;  -->\n\n`;
    for (const [profile, profileUsername] of Object.entries(userProfiles)) {
      const profileName = profiles[profile]?.name || profile;
      const profileIcon = profiles[profile]?.icon;
      if (profileIcon)
        readme += `[<img src="${profileIcon}" alt="${profileName}" width="30" height="30" title=${profileName} />](${profiles[profile].base_url}${profileUsername})&nbsp;&nbsp;\n`;
    }
    readme += "\n\n---  \n\n\n";
  }

  // Conditionally render "Skills" if the user has skills
  if (skills && skills.length) {
    readme += `## ✨ Tech Stack\n`;
    readme += `<!--  multiple  [<img src="skill_icon" alt="skill_name" width="30" height="30" title="skill_name" />](skill_link)&nbsp;&nbsp;  -->\n\n`;
    for (const skill of skills) {
      const skillIcon = mergedSkills[skill]?.icon;
      if (skillIcon)
        readme += `<img src="${skillIcon}" alt="${skill}" width="30" height="30" title="${skill}" />&nbsp;&nbsp;\n`;
    }
    for (const skill of skills) {
      const skillIcon = mergedSkills[skill]?.icon;
      if (!skillIcon) readme += `, ${skill}`;
    }
    readme += "\n\n\n---  \n\n\n";
  }

  // Conditionally render "Experience" if the user has experience entries
  if (experience.length) {
    readme += `## 💼 Experience  \n`;
    experience.forEach((exp) => {
      readme += `### 🌟 ${exp.position} @ ${exp.company}\n- [ ${exp.start} - ${
        exp.end || "Present"
      } ]${exp.about ? `\n- ${exp.about}` : ""}\n\n`;
    });
    readme += "\n---  \n\n\n";
  }

  // Conditionally render "Projects" if the user has projects
  if (projects.length) {
    readme += `## 📁 Projects\n`;
    projects.forEach((project) => {
      readme += `### 🌟 ${project.name} | [Live](${
        project.live_url || "#"
      }) | [Code](${project.code_url})\n- ${project.about}\n\n`;
    });
    readme += "\n---  \n\n\n";
  }

  // Conditionally render "Education" if the user has education entries
  if (education.length) {
    readme += `## 🏫 Education\n`;
    education.forEach((edu) => {
      readme += `### 🌟 ${edu.degree}${
        edu.specialization ? ` in ${edu.specialization}` : ""
      }\n- ${edu.score ? `**Score**: ${edu.score} &nbsp;&nbsp;&nbsp; ` : ""}[ ${
        edu.start
      } - ${edu.end || "Present"} ]\n\n`;
    });
    readme += "\n---  \n\n\n";
  }

  // Conditionally render "GitHub Streak" if available
  readme += `## 🔥 GitHub Streak  \n`;
  readme += `<!--  ![${fullname}'s GitHub Streak](img_link)  -->\n\n`;
  readme += `<div align="center">\n\n`;
  readme += `![${fullname}'s GitHub Streak](https://streak-stats.demolab.com?user=${githubUsername}&theme=transparent)\n\n`;
  readme += `</div>\n\n`;
  readme += "\n---  \n\n\n";

  // Conditionally render "GitHub Stats" if available
  const baseStatsUrl = `https://github-readme-stats.vercel.app/api?username=${githubUsername}&theme=transparent&show_icons=true`;
  readme += `## 🚀 GitHub Stats\n`;
  readme += `<!--  Configuration options for GitHub stats card:
 - &theme=transparent / many_others
 - &show_icons=true
 - &rank_icon=github / percentile
 - &hide=contribs,prs,issues (comma seperated)
 - &show=reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage
 -->\n\n`;
  readme += `<div align="center">\n`;
  readme += `<!--  Choose one  ![${fullname}'s GitHub stats](img_link)  -->\n\n`;
  readme += `![${fullname}'s GitHub stats](${baseStatsUrl}&hide=contribs,prs&rank_icon=github)\n\n`;
  readme += `![${fullname}'s GitHub stats](${baseStatsUrl})\n\n`;
  readme += `![${fullname}'s GitHub stats](${baseStatsUrl}&show=reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage&rank_icon=percentile)\n\n`;
  readme += `</div>\n\n`;
  readme += "\n---  \n\n\n";

  // Conditionally render "Most Used Languages" if available
  const topLangsBaseUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&theme=transparent`;
  readme += `## 🧠 Most Used Languages\n`;
  readme += `<!--  Configuration options for Most used languages card:
 - &theme=transparent / many_others
 - &hide_progress=true
 - &layout=compact / donut / donut-vertical / pie 
 - &langs_count=1 to 20
 -->\n\n`;
  readme += `<div align="center">\n`;
  readme += `<!--  Choose one  ![Top Langs](img_link)  -->\n\n`;
  readme += `![Top Langs](${topLangsBaseUrl}&hide_progress=true)\n\n`;
  readme += `![Top Langs](${topLangsBaseUrl}&layout=compact)\n\n`;
  readme += `![Top Langs](${topLangsBaseUrl}&langs_count=7)\n\n`;
  readme += `![Top Langs](${topLangsBaseUrl}&layout=donut-vertical)\n\n`;
  readme += `</div>\n\n`;
  readme += "\n---  \n\n\n";

  // Conditionally render "GitHub Repos" if available
  readme += `## 📦 GitHub Repositories\n`;
  readme += `<!--  Configuration options for GitHub repo card:
 - &theme=transparent / many_others
 - &repo=<repo_name>
 -->\n\n`;
  readme += `<!--  [![Repo Card](img_link)](repo_link)  -->\n\n`;
  readme += `<div align="center">\n\n`;
  readme += `[![Repo Card](https://github-readme-stats.vercel.app/api/pin/?username=${githubUsername}&theme=transparent&repo=${githubUsername})](https://github.com/${githubUsername}/${githubUsername})\n\n`;
  readme += `</div>\n\n`;
  readme += "\n---  \n\n\n";

  // Conditionally render "GitHub Gists" if available
  readme += `## ✏️ GitHub Gists\n`;
  readme += `<!--  [![Gist Card](img_link)](gist_link)  -->\n\n`;
  readme += `<div align="center">\n\n`;
  readme += `[![Gist Card](https://github-readme-stats.vercel.app/api/gist?id=bbfce31e0217a3689c8d961a356cb10d&theme=transparent)](https://gist.github.com/Yizack/bbfce31e0217a3689c8d961a356cb10d/)\n\n`;
  readme += `</div>\n\n`;
  readme += "\n---  \n\n\n";

  readme += `<div align="center">\n\n`;
  readme += `### ⭐️ From ${fullname}\n\n`;
  readme += `</div>\n`;

  // Return the formatted README content
  return readme;
}

export default function MarkdownEditor({ user }) {
  const [value, setValue] = useState(defaultMarkdownValue);
  const [theme, setTheme] = useState("dark");
  const [previewMode, setPreviewMode] = useState("edit");

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", theme);
  }, [theme]);

  const handleResize = () => {
    setPreviewMode(window.innerWidth >= 768 ? "live" : "edit");
  };

  useEffect(() => {
    handleResize(); // Set initial preview mode
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const themeToggleCommand = {
    name: "theme-toggle",
    keyCommand: "themeToggle",
    buttonProps: { "aria-label": "Toggle theme", title: "Toggle theme" },
    icon: <span>{theme === "light" ? <Sun /> : <Moon />}</span>,
    execute: () =>
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light")),
  };

  const copyCommand = {
    name: "copy",
    keyCommand: "copyMarkdown",
    buttonProps: {
      "aria-label": "Copy Markdown",
      title: "Copy Markdown (ctrl + a + c)",
    },
    icon: <Copy className="w-4 h-4" />,
    execute: () => {
      navigator.clipboard.writeText(value).then(() => {
        toast.success("Markdown copied to clipboard!");
      });
    },
  };

  const randomid = () =>
    parseInt(String(Math.random() * 1e15), 10).toString(36);

  const Code = ({ inline, children = [], className, ...props }) => {
    const demoid = useRef(`dome${randomid()}`);
    const [container, setContainer] = useState(null);
    const isMermaid =
      className && /^language-mermaid/.test(className.toLocaleLowerCase());
    const code = children
      ? getCodeString(props.node.children)
      : children[0] || "";

    useEffect(() => {
      if (container && isMermaid && demoid.current && code) {
        mermaid
          .render(demoid.current, code)
          .then(({ svg, bindFunctions }) => {
            container.innerHTML = svg;
            if (bindFunctions) bindFunctions(container);
          })
          .catch((error) => {
            console.log("error:", error);
          });
      }
    }, [container, isMermaid, code, demoid]);

    const refElement = useCallback((node) => {
      if (node !== null) setContainer(node);
    }, []);

    return isMermaid ? (
      <Fragment>
        <code id={demoid.current} style={{ display: "none" }} />
        <code className={className} ref={refElement} data-name="mermaid" />
      </Fragment>
    ) : (
      <code className={className}>{children}</code>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-2">
        {user?.profiles?.github ? (
          <Button
            onClick={() => setValue(generateGitHubReadme(user))}
            type="button"
            aria-label="Generate your GitHub README profile"
            className="mx-auto"
            variant={theme === "light" ? "default" : "secondary"}
          >
            Generate GitHub README
          </Button>
        ) : (
          <div className="h-10"></div>
        )}
      </div>

      <MDEditor
        className="MDEditor"
        value={value}
        onChange={setValue}
        textareaProps={{ placeholder: "Please enter Markdown text" }}
        preview={previewMode}
        commands={[...getCommands(), copyCommand]}
        extraCommands={[...getExtraCommands(), themeToggleCommand]}
        components={{
          toolbar: (command, disabled, executeCommand) => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={(evn) => {
                      evn.stopPropagation();
                      executeCommand(command, command.groupName);
                    }}
                    aria-label={command.buttonProps["aria-label"]}
                    disabled={disabled}
                    type="button"
                    variant={theme === "light" ? "default" : "secondary"}
                    className="p-1"
                  >
                    {command.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{command.buttonProps.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ),
          code: ({ children = [], className, ...props }) => {
            if (
              typeof children === "string" &&
              /^\$\$(.*)\$\$/.test(children)
            ) {
              const html = katex.renderToString(
                children.replace(/^\$\$(.*)\$\$/, "$1"),
                {
                  throwOnError: false,
                }
              );
              return (
                <code
                  dangerouslySetInnerHTML={{ __html: html }}
                  style={{ background: "transparent" }}
                />
              );
            }
            const code = props.node?.children
              ? getCodeString(props.node.children)
              : children;
            if (
              typeof code === "string" &&
              typeof className === "string" &&
              /^language-katex/.test(className.toLowerCase())
            ) {
              const html = katex.renderToString(code, { throwOnError: false });
              return (
                <code
                  dangerouslySetInnerHTML={{ __html: html }}
                  style={{ fontSize: "150%" }}
                />
              );
            }
            return <code className={String(className)}>{children}</code>;
          },
        }}
        visibleDragbar={false}
        previewOptions={{ components: { code: Code } }}
        enableScroll={false}
      />
    </div>
  );
}
