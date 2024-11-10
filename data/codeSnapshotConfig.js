export const languages = {
  bash: { name: "Bash", extension: ".sh", codeSnippet: 'echo "Hello, World!"' },
  c: {
    name: "C",
    extension: ".c",
    codeSnippet:
      '#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  },
  "c++": {
    name: "C++",
    extension: ".cpp",
    codeSnippet:
      '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  },
  "c#": {
    name: "C#",
    extension: ".cs",
    codeSnippet:
      'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
  },
  clojure: {
    name: "Clojure",
    extension: ".clj",
    codeSnippet: '(println "Hello, World!")',
  },
  crystal: {
    name: "Crystal",
    extension: ".cr",
    codeSnippet: 'puts "Hello, World!"',
  },
  css: {
    name: "CSS",
    extension: ".css",
    codeSnippet: "body {\n    background-color: #282c34;\n    color: white;\n}",
  },
  diff: {
    name: "Diff",
    extension: ".diff",
    codeSnippet:
      "diff --git a/file1 b/file2\n--- a/file1\n+++ b/file2\n@@ -1,3 +1,3 @@\n-Hello World\n+Hello Universe",
  },
  dockerfile: {
    name: "Docker",
    extension: "Dockerfile",
    codeSnippet:
      'FROM node:14\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["node", "index.js"]',
  },
  elm: {
    name: "Elm",
    extension: ".elm",
    codeSnippet:
      'module Main exposing (..)\n\nmain =\n    text "Hello, World!"',
  },
  elixir: {
    name: "Elixir",
    extension: ".ex",
    codeSnippet: 'IO.puts("Hello, World!")',
  },
  erlang: {
    name: "Erlang",
    extension: ".erl",
    codeSnippet:
      '-module(hello).\n-export([world/0]).\n\nworld() ->\n    io:format("Hello, World!~n").',
  },
  graphql: {
    name: "GraphQL",
    extension: ".gql",
    codeSnippet: '{\n  user(id: "1") {\n    name\n    email\n  }\n}',
  },
  go: {
    name: "Go",
    extension: ".go",
    codeSnippet:
      'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  },
  haskell: {
    name: "Haskell",
    extension: ".hs",
    codeSnippet: 'main = putStrLn "Hello, World!"',
  },
  html: {
    name: "HTML",
    extension: ".html",
    codeSnippet:
      "<!DOCTYPE html>\n<html>\n<head><title>Hello</title></head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>",
  },
  java: {
    name: "Java",
    extension: ".java",
    codeSnippet:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  javascript: {
    name: "JavaScript/JSX",
    extension: ".js",
    codeSnippet: 'console.log("Hello, World!");',
  },
  json: {
    name: "JSON",
    extension: ".json",
    codeSnippet: '{\n    "message": "Hello, World!"\n}',
  },
  kotlin: {
    name: "Kotlin",
    extension: ".kt",
    codeSnippet: 'fun main() {\n    println("Hello, World!")\n}',
  },
  lisp: {
    name: "Lisp",
    extension: ".lisp",
    codeSnippet: '(format t "Hello, World!")',
  },
  lua: {
    name: "Lua",
    extension: ".lua",
    codeSnippet: 'print("Hello, World!")',
  },
  markdown: {
    name: "Markdown",
    extension: ".md",
    codeSnippet: "# Hello, World!\nThis is a sample markdown file.",
  },
  matlab: {
    name: "MATLAB/Octave",
    extension: ".m",
    codeSnippet: 'disp("Hello, World!")',
  },
  pascal: {
    name: "Pascal",
    extension: ".pas",
    codeSnippet:
      'program HelloWorld;\nbegin\n  writeln("Hello, World!");\nend.',
  },
  plaintext: {
    name: "Plaintext",
    extension: ".txt",
    codeSnippet: "Hello, World!",
  },
  powershell: {
    name: "Powershell",
    extension: ".ps1",
    codeSnippet: 'Write-Output "Hello, World!"',
  },
  objectivec: {
    name: "Objective C",
    extension: ".m",
    codeSnippet:
      '#import <Foundation/Foundation.h>\nint main() {\n    NSLog(@"Hello, World!");\n    return 0;\n}',
  },
  php: {
    name: "PHP",
    extension: ".php",
    codeSnippet: '<?php\n  echo "Hello, World!";\n?>',
  },
  python: {
    name: "Python",
    extension: ".py",
    codeSnippet: 'print("Hello, World!")',
  },
  ruby: { name: "Ruby", extension: ".rb", codeSnippet: 'puts "Hello, World!"' },
  rust: {
    name: "Rust",
    extension: ".rs",
    codeSnippet: 'fn main() {\n    println!("Hello, World!");\n}',
  },
  scala: {
    name: "Scala",
    extension: ".scala",
    codeSnippet:
      'object HelloWorld {\n  def main(args: Array[String]): Unit = {\n    println("Hello, World!")\n  }\n}',
  },
  scss: {
    name: "SCSS",
    extension: ".scss",
    codeSnippet: "$text-color: #333;\nbody {\n    color: $text-color;\n}",
  },
  sql: {
    name: "SQL",
    extension: ".sql",
    codeSnippet: 'SELECT "Hello, World!";',
  },
  swift: {
    name: "Swift",
    extension: ".swift",
    codeSnippet: 'print("Hello, World!")',
  },
  toml: {
    name: "TOML",
    extension: ".toml",
    codeSnippet: 'title = "Hello, World!"',
  },
  typescript: {
    name: "TypeScript/TSX",
    extension: ".ts",
    codeSnippet: 'console.log("Hello, World!");',
  },
  xml: {
    name: "XML",
    extension: ".xml",
    codeSnippet: '<?xml version="1.0"?>\n<message>Hello, World!</message>',
  },
  yaml: {
    name: "YAML",
    extension: ".yml",
    codeSnippet: 'message: "Hello, World!"',
  },
};

export const themes = {
  bitmap: {
    background: "bg-gradient-to-br from-gray-200 to-gray-500",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/vs.min.css",
  },
  candy: {
    background: "bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/chalk.min.css",
  },
  coral: {
    background: "bg-gradient-to-br from-blue-400 to-emerald-400",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/tokyo-night-dark.min.css",
  },
  crimson: {
    background: "bg-gradient-to-br from-red-500 via-pink-600 to-purple-700",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/atelier-plateau.min.css",
  },
  flamingo: {
    background: "bg-gradient-to-br from-pink-400 to-pink-600",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/panda-syntax-dark.min.css",
  },
  gotham: {
    background: "bg-gradient-to-br from-gray-700 via-gray-900 to-black",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/black-metal-dark-funeral.min.css",
  },
  horizon: {
    background: "bg-gradient-to-br from-orange-500 to-yellow-300",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/monokai-sublime.min.css",
  },
  hyper: {
    background: "bg-gradient-to-br from-fuchsia-500 via-red-600 to-orange-400",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css",
  },
  ice: {
    background: "bg-gradient-to-br from-rose-100 to-teal-100",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/ashes.min.css",
  },
  midnight: {
    background: "bg-gradient-to-br from-gray-800 to-blue-900",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/dracula.min.css",
  },
  oceanic: {
    background: "bg-gradient-to-br from-green-300 via-blue-500 to-purple-600",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/material-darker.min.css",
  },
  peach: {
    background: "bg-gradient-to-br from-rose-400 to-orange-300",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/zenburn.min.css",
  },
  sand: {
    background: "bg-gradient-to-br from-yellow-400 to-orange-300",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/atelier-cave-light.min.css",
  },
  sublime: {
    background: "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css",
  },
  sunset: {
    background: "bg-gradient-to-br from-red-400 to-orange-500",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/sunset.min.css",
  },
};

export const fonts = {
  jetBrainsMono: {
    name: "JetBrains Mono",
    src: "https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap",
  },
  inconsolata: {
    name: "Inconsolata",
    src: "https://fonts.googleapis.com/css2?family=Inconsolata&display=swap",
  },
  firaCode: {
    name: "Fira Code",
    src: "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
  },
  cascadiaCode: {
    name: "Cascadia Code",
    src: "https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@4.2.1/index.min.css",
  },
  victorMono: {
    name: "Victor Mono",
    src: "https://fonts.googleapis.com/css2?family=Victor+Mono&display=swap",
  },
  sourceCodePro: {
    name: "Source Code Pro",
    src: "https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap",
  },
  ibmPlexMono: {
    name: "IBM Plex Mono",
    src: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap",
  },
  robotoMono: {
    name: "Roboto Mono",
    src: "https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap",
  },
  ubuntuMono: {
    name: "Ubuntu Mono",
    src: "https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap",
  },
  spaceMono: {
    name: "Space Mono",
    src: "https://fonts.googleapis.com/css2?family=Space+Mono&display=swap",
  },
  courierPrime: {
    name: "Courier Prime",
    src: "https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap",
  },
  anonymousPro: {
    name: "Anonymous Pro",
    src: "https://fonts.googleapis.com/css2?family=Anonymous+Pro&display=swap",
  },
  oxygenMono: {
    name: "Oxygen Mono",
    src: "https://fonts.googleapis.com/css2?family=Oxygen+Mono&display=swap",
  },
  redHatMono: {
    name: "Red Hat Mono",
    src: "https://fonts.googleapis.com/css2?family=Red+Hat+Mono&display=swap",
  },
};

export const paddings = [0, 16, 32, 48, 64, 80, 96, 112, 128];
