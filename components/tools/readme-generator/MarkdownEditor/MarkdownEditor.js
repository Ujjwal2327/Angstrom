"use client";

import { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { Copy, Moon, Send, Sun, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import "./MarkdownEditor.css";
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
import { useRouter } from "next/navigation";
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

  let readme = "";
  const githubUsername = userProfiles.github || "github_username";
  const fullname =
    [firstname, lastname].filter(Boolean).join(" ").trim() ||
    githubUsername ||
    username;
  const mergedSkills = mergeSkills();

  // intro section
  const introSections = [
    `<div align="center">\n\n`,
    `![${fullname}'s Github Profile Counter Card](https://profile-counter.glitch.me/${githubUsername}/count.svg)\n\n`,
    `<!-- Choose one heading style -->\n`,
    `<!-- Option 1: Fast & simple text -->\n`,
    `# 👋 Hey, I'm ${fullname}!\n\n`,
    `<!-- Option 2: Slower, but with typing animation -->\n`,
    `![Intro](https://readme-typing-svg.herokuapp.com/?font=Righteous&size=35&center=true&vCenter=true&duration=4000&lines=Hi+There!+👋;+I'm+${fullname.replace(
      / /g,
      "+"
    )}!)\n\n`,
    about ? `### ${about}\n\n` : "",
    `### [🔗 Portfolio](https://angstrom.vercel.app/users/${username}) | [📧 Email](mailto:${email})\n\n`,
    `![${fullname}'s Github Stats Graph](https://github-readme-activity-graph-mnex.vercel.app/graph?username=${username}&bg_color=transparent&color=00b8b5&line=eb008b&point=FFFFFF&area=true&hide_border=true&hide_title=true)\n\n`,
    `</div>\n\n`,
    "\n---  \n\n\n",
  ];

  readme += introSections.join("");

  // profiles section
  if (Object.keys(userProfiles).length > 0) {
    readme += `## 🧑‍💻 Profiles\n`;
    readme += `<!-- Multiple profile icons with links\n[<img src="profile_icon" alt="profile_name" width="30" height="30" title="profile_name" />](user_profile_link)&nbsp;\n-->\n\n`;

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

  // skills section
  if (skills.length) {
    readme += `## ✨ Tech Stack\n`;
    readme += `<!-- Multiple skill icons\n<img src="skill_icon" alt="skill_name" width="30" height="30" title="skill_name" />&nbsp;\n-->\n\n`;

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
      .map((skill) => {
        const skillIcon = mergedSkills[skill]?.icon;
        return !skillIcon ? skill : null;
      })
      .filter(Boolean)
      .join(", \n");

    readme += skillIcons + remainingSkills + "\n\n\n---  \n\n\n";
  }

  // experience section
  if (experience.length) {
    readme += `## 💼 Experience  \n`;
    const experienceEntries = experience
      .map((exp) => {
        return `### 🌟 ${exp.position} @ ${exp.company}\n- [ ${exp.start} - ${
          exp.end || "Present"
        } ]${exp.about ? `\n- ${exp.about}` : ""}`;
      })
      .join("\n\n");

    readme += experienceEntries + "\n\n\n---  \n\n\n";
  }

  // projects section
  if (projects.length) {
    readme += `## 📁 Projects\n`;
    const projectEntries = projects
      .map((project) => {
        return `### 🌟 ${project.name} | [Live](${
          project.live_url || "#"
        }) | [Code](${project.code_url})\n- ${project.about}`;
      })
      .join("\n\n");

    readme += projectEntries + "\n\n\n---  \n\n\n";
  }

  // education section
  if (education.length) {
    readme += `## 🏫 Education\n`;
    const educationEntries = education
      .map((edu) => {
        return `### 🌟 ${edu.degree}${
          edu.specialization ? ` in ${edu.specialization}` : ""
        }\n- ${
          edu.score ? `**Score**: ${edu.score} &nbsp;&nbsp;&nbsp; ` : ""
        }[ ${edu.start} - ${edu.end || "Present"} ]`;
      })
      .join("\n\n");

    readme += educationEntries + "\n\n\n---  \n\n\n";
  }

  // github streak card section
  readme += `## 🔥 GitHub Streak  \n`;
  readme += `<!--  ![${fullname}'s GitHub Streak](img_link)  -->\n\n`;
  readme += `<div align="center">\n\n`;
  readme += `![${fullname}'s GitHub Streak](https://streak-stats.demolab.com?user=${githubUsername}&theme=transparent)\n\n`;
  readme += `</div>\n\n`;
  readme += "\n---  \n\n\n";

  // github stats card section
  const baseStatsUrl = `https://github-readme-stats.vercel.app/api?username=${githubUsername}&theme=transparent&show_icons=true`;
  const statOptions = [
    `&hide=contribs,prs&rank_icon=github`,
    ``,
    `&show=reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage&rank_icon=percentile`,
  ];

  readme += `## 🚀 GitHub Stats\n`;
  readme += `<!-- Configuration options for GitHub stats card:
  - &theme=transparent (or other available themes)
  - &show_icons=true (display icons)
  - &rank_icon=github / percentile (choose rank icon style)
  - &hide=contribs,prs,issues (hide specific stats, comma-separated)
  - &show=reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage (show specific stats)
  -->\n\n`;
  readme += `<div align="center">\n\n`;
  statOptions.forEach((option) => {
    readme += `![${fullname}'s GitHub stats](${baseStatsUrl}${option})\n\n`;
  });
  readme += `</div>\n\n`;
  readme += "\n---  \n\n\n";

  // github most used languages card section
  const topLangsBaseUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&theme=transparent`;
  const langOptions = [
    `&hide_progress=true`,
    `&layout=compact`,
    `&langs_count=7`,
    `&layout=donut-vertical`,
  ];

  readme += `## 🧠 Most Used Languages\n`;
  readme += `<!-- Configuration options for Most Used Languages card:
  - &theme=transparent (or other available themes)
  - &hide_progress=true (hide progress bars)
  - &layout=compact / donut / donut-vertical / pie (choose layout style)
  - &langs_count=1 to 20 (number of languages to display)
  -->\n\n`;
  readme += `<div align="center">\n\n`;
  langOptions.forEach((option) => {
    readme += `![Top Langs](${topLangsBaseUrl}${option})\n\n`;
  });
  readme += `</div>\n\n`;
  readme += "\n---  \n\n\n";

  // github repo card section
  readme += `## 📦 GitHub Repositories\n`;
  readme += `<!-- Configuration options for GitHub Repo card:
  - &theme=transparent (or other available themes)
  - &repo=<repo_name> (specify the repository name)
  -->\n\n`;
  readme += `<!--  [![Repo Card](img_link)](repo_link)  -->\n\n`;
  readme += `<div align="center">\n\n`;
  readme += `[![Repo Card](https://github-readme-stats.vercel.app/api/pin/?username=${githubUsername}&theme=transparent&repo=${githubUsername})](https://github.com/${githubUsername}/${githubUsername})\n\n`;
  readme += `</div>\n\n`;
  readme += "\n---  \n\n\n";

  // github gist card section
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
  const router = useRouter();
  const [value, setValue] = useState(defaultMarkdownValue);
  const [theme, setTheme] = useState("dark");
  const [previewMode, setPreviewMode] = useState("edit");

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", theme);
  }, [theme]);

  const handleResize = useCallback(() => {
    setPreviewMode(window.innerWidth >= 768 ? "live" : "edit");
  }, []);

  useEffect(() => {
    handleResize(); // Set initial preview mode
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

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
            aria-label="Add GitHub Username"
            className="mx-auto"
            variant={theme === "light" ? "default" : "secondary"}
          >
            Add GitHub Username
            <Send size={15} className="ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => router.push(`/sign-in`)}
            type="button"
            aria-label="Sign In to Generate GitHub README"
            className="mx-auto"
            variant={theme === "light" ? "default" : "secondary"}
          >
            Sign In to Generate GitHub README
            <Send size={15} className="ml-2" />
          </Button>
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
                    variant="ghost"
                    className="p-2"
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
