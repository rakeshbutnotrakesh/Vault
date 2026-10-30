# DevVault

> **All-in-One Offline Developer Productivity Workspace**

DevVault is a high-performance, browser-native developer workstation engineered for software architects, backend engineers, and frontend developers. It consolidates code snippet repositories, sandboxed experimentation playgrounds, text transformers, regex analyzers, and task management into a single, cohesive, dark-first dashboard.

---

## ⚡ Zero External APIs / Offline-First Guarantee

DevVault runs **100% locally in your browser**:
- **No external API keys** required.
- **No remote telemetry or AI API calls** (no OpenAI, no Gemini, no Claude).
- **No remote databases or third-party auth** (no Firebase, no Supabase).
- **Persistent Local Storage**: Snippets, tasks, notes, and custom palettes remain safely on your machine using versioned, exportable browser storage.
- Works entirely offline after the initial page load.

---

## 🛠 Included Developer Tools

| Tool | Category | Key Capabilities |
| :--- | :--- | :--- |
| **Dashboard** | Workspace | Real-time summary of recent snippets, pinned architecture notes, pending task board, and fast tool launch cards. |
| **Code Vault** | Management | Searchable repository supporting 16+ languages (TypeScript, Python, Java, C++, Go, Rust, SQL, etc.) with tags, favorites, duplicate, copy, and file download. |
| **JSON Formatter** | Utilities | Native JSON validator, 2/4 space indentation, minifier, interactive tree node inspector, and exact syntax line/column error pointer. |
| **Markdown Editor** | Editors | Side-by-side live preview with safe HTML sanitization, table formatting, task checkboxes, export to `.md`, and word/char/reading time statistics. |
| **HTML Playground** | Playgrounds | Sandboxed DOM environment with responsive device viewports (Desktop, Tablet 768px, Mobile 375px), full-screen mode, and pre-built templates. |
| **CSS Playground** | Playgrounds | Live interactive style lab with instant rendering. Includes presets for Flexbox, CSS Grid, Animated Gradients, and Glassmorphism. |
| **JS Playground** | Playgrounds | Isolated execution iframe sandbox with intercepted console (`log`, `info`, `warn`, `error`), timestamped execution logs, and runtime duration metrics. |
| **Text Toolkit** | Utilities | Live text metrics (words, chars, sentences, reading time). Instant transforms: case converters, deduplicate lines, trim whitespace, sort lines, and regex find & replace. |
| **Base64 Studio** | Utilities | Robust UTF-8 text encoder/decoder using `TextEncoder`/`TextDecoder`, and drag-and-drop file-to-DataURI generator with image preview. |
| **Color Studio** | Utilities | Color picker with HEX, RGB, HSL conversions. Generates harmonic palettes (Complementary, Triadic, Analogous) and computes WCAG AA/AAA contrast ratios against black & white. |
| **Regex Tester** | Utilities | Live regular expression parser with interactive highlight overlays, capture group inspector (`$1`, `$2`), and preset library (email, URL, IPv4, UUID, ISO dates). |
| **Diff Checker** | Utilities | Line-by-line comparison engine using the Longest Common Subsequence (LCS) algorithm with unified/split views and addition/deletion counters. |
| **Dev Notes** | Management | Technical notebook with markdown support, categories, tags, pinned status, search, and `.md` file download. |
| **Task Manager** | Management | Developer Kanban board & List view with status stages (*To Do*, *In Progress*, *Code Review*, *Done*), priority tags, and project filtering. |
| **Settings & Backup** | Workspace | Full JSON export snapshot, import with merge/replace options, storage quota analytics, theme switcher, and emergency reset. |

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `⌘ + K` | Global Command Palette & Fuzzy Search |
| `Ctrl + Enter` | Execute JavaScript in JS Playground |
| `Esc` | Close search palette, drawers, or dialogs |
| `Alt + 1` | Open Dashboard |
| `Alt + 2` | Open Code Vault |
| `Alt + 3` | Open JSON Formatter |
| `Alt + 4` | Open Markdown Editor |
| `Alt + 5` | Open HTML Playground |
| `Alt + 6` | Open CSS Playground |
| `Alt + 7` | Open JS Playground |
| `Alt + 8` | Open Text Toolkit |
| `Alt + 9` | Open Base64 Studio |

---

## 📂 Project Architecture

```
devvault/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated GitHub Actions lint & build
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── common/              # IconRenderer, ToastContainer
│   │   ├── modals/              # GlobalSearchModal, ShortcutsModal
│   │   └── navigation/          # Sidebar, TopNav
│   ├── context/
│   │   └── DevVaultContext.tsx  # Central state management & reactive storage
│   ├── features/
│   │   ├── base64/              # Base64Converter.tsx
│   │   ├── code-vault/          # CodeVault.tsx
│   │   ├── color-studio/        # ColorStudio.tsx
│   │   ├── dashboard/           # Dashboard.tsx
│   │   ├── diff/                # DiffChecker.tsx
│   │   ├── json-tools/          # JsonFormatter.tsx
│   │   ├── markdown/            # MarkdownEditor.tsx
│   │   ├── notes/               # NotesManager.tsx
│   │   ├── playgrounds/         # HtmlPlayground, CssPlayground, JsPlayground
│   │   ├── regex/               # RegexTester.tsx
│   │   ├── settings/            # SettingsView.tsx
│   │   ├── tasks/               # TaskManager.tsx
│   │   └── text-tools/          # TextToolkit.tsx
│   ├── lib/
│   │   ├── constants.ts         # Tool registries, starter code snippets, notes & tasks
│   │   └── storage.ts           # Resilient LocalStorage wrapper with JSON migration
│   ├── types/
│   │   └── index.ts             # Strict TypeScript definitions
│   ├── App.tsx                  # Root layout shell
│   ├── index.css                # Tailwind CSS v4 configuration
│   └── main.tsx                 # React 19 entrypoint
├── index.html
├── LICENSE                      # MIT License
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/devvault.git

# Navigate to project directory
cd devvault

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Typecheck & Lint
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
The optimized static bundle will be generated in the `dist/` directory.

---

## 🌐 Deployment Instructions

### Deploy to Vercel (Static)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `devvault` repository.
4. Keep the default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Since DevVault requires zero environment variables, it will deploy instantly!

### Deploy with GitHub Pages or Cloudflare Pages
Since DevVault produces pure static client files (`dist/`), point your static hosting provider directly to the `dist` build output.

---

## 📄 License

DevVault is licensed under the [MIT License](LICENSE).
