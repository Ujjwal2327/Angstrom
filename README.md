this is my final readme, is this alright?

# Angstrom

**The Ultimate Developer Toolbox**  
A developer toolbox designed to simplify workflows by providing essential tools like Portfolio Builder, Markdown Editor, JSON Slicer, Code Differ, and Code Snapshot.

---

## 🚀 Overview

**Angstrom** is a career-focused application designed to help developers create and share professional profiles that highlight their coding skills, achievements, projects, and education. It offers a suite of tools tailored for developers to enhance their personal branding and productivity.

---

## 🛠️ Features

- **Portfolio Builder**: Enables users to create and manage professional portfolios with structured validation, seamless reordering, and secure authentication.
- **Markdown Editor**:  Provides a seamless Markdown editing experience with live preview and one-click GitHub README generation, supporting both light and dark modes.
- **JSON Slicer**:  Helps developers efficiently filter and debug complex JSON with bulk selection, collapsible nodes, and precise field-level control to quickly isolate relevant data.
- **Code Differ**: Allows easy comparison of code snippets with syntax-highlighted differences and customizable editor settings.
- **Code Snapshot**: Enables developers to create and share code snippets with customizable themes, language auto-detection, and export options (PNG, SVG, shareable links).

---

## 🧰 Tech Stack

- **Fullstack Framework**: Next.js  
- **Database**: PostgreSQL  
- **ORM**: Prisma  
- **Database Hosting**: Neon  
- **Caching**: Upstash Redis  
- **Authentication**: Auth.js  
- **UI Libraries**: shadcn/ui, Aceternity UI  
- **Icons**: lucide-react, react-icons  
- **Frontend State Management**: Zustand  
- **Deployment**: Vercel  
- **WYSIWYG Editor**: Tiptap  
- **Code Highlighter**: highlight.js

---

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ujjwal2327/Angstrom.git
   cd Angstrom
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the necessary environment variables.

    ```env
    NODE_ENV=development       # Environment mode ("development" | "production")
    NEXT_PUBLIC_BASE_URL=      # Base URL of site ("http://localhost:3000" for local env)
    
    DATABASE_URL=              # PostgreSQL connection string (Neon)
    REDIS_URL=                 # Upstash Redis connection string
    REDIS_EXPIRE=              # Redis key expiration time (in seconds)
    
    AUTH_SECRET=               # Secret for signing Auth.js tokens
    AUTH_GOOGLE_ID=            # Google OAuth client ID
    AUTH_GOOGLE_SECRET=        # Google OAuth client secret
    
    MY_USERNAME=               # Username for showing "Creator of Angstrom" badge in my portfolio
    ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

---

## ⏰ Time Spent on This Project

[![wakatime](https://wakatime.com/badge/user/df6917f7-6186-4bb8-8288-531f1bfab139/project/647ddb24-c7bd-4468-b48d-01d2575e3db3.svg)](https://wakatime.com/@ujjwal2327/projects/opvlyxrshl)
