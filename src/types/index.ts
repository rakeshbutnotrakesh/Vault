export type ToolId =
  | 'dashboard'
  | 'polyglot'
  | 'code-vault'
  | 'json-tools'
  | 'markdown'
  | 'html-playground'
  | 'css-playground'
  | 'js-playground'
  | 'text-tools'
  | 'base64'
  | 'color-studio'
  | 'regex'
  | 'diff'
  | 'notes'
  | 'tasks'
  | 'settings';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  category: 'Workspace' | 'Editors' | 'Utilities' | 'Playgrounds' | 'Management';
  description: string;
  iconName: string;
  badge?: string;
  shortcut?: string;
}

export type SupportedLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'rust'
  | 'go'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'kotlin'
  | 'swift'
  | 'php'
  | 'ruby'
  | 'sql'
  | 'html'
  | 'css'
  | 'json'
  | 'yaml'
  | 'toml'
  | 'xml'
  | 'markdown'
  | 'bash'
  | 'powershell'
  | 'dart'
  | 'scala'
  | 'haskell'
  | 'elixir'
  | 'erlang'
  | 'clojure'
  | 'lua'
  | 'r'
  | 'julia'
  | 'zig'
  | 'nim'
  | 'ocaml'
  | 'fsharp'
  | 'solidity'
  | 'assembly'
  | 'webassembly'
  | 'dockerfile'
  | 'terraform'
  | 'graphql'
  | 'latex'
  | 'cobol'
  | 'fortran'
  | 'perl'
  | (string & {});

export type SnippetCategory =
  | 'Frontend'
  | 'Backend'
  | 'DevOps'
  | 'Database'
  | 'Algorithms'
  | 'Utilities'
  | 'Configuration'
  | 'General';

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: SupportedLanguage;
  category: SnippetCategory;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory =
  | 'Architecture'
  | 'Database'
  | 'Frontend'
  | 'Backend'
  | 'DevOps'
  | 'Cheat Sheet'
  | 'Meeting Notes'
  | 'Ideas'
  | 'General';

export interface DevNote {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface DevTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  favorites: ToolId[];
  recentTools: ToolId[];
  editorFontSize: number;
  sidebarCollapsed: boolean;
}

export interface DevVaultStorageData {
  version: number;
  exportedAt: string;
  snippets: CodeSnippet[];
  notes: DevNote[];
  tasks: DevTask[];
  palettes: ColorPalette[];
  settings: UserSettings;
}
