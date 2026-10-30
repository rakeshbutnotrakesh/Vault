import {
  CodeSnippet,
  DevNote,
  DevTask,
  ColorPalette,
  UserSettings,
  DevVaultStorageData
} from '../types';
import {
  DEFAULT_SETTINGS,
  INITIAL_SNIPPETS,
  INITIAL_NOTES,
  INITIAL_TASKS,
  INITIAL_PALETTES
} from './constants';
import { getLanguageExtension } from './languages';

const STORAGE_KEYS = {
  VERSION: 'devvault_version',
  SETTINGS: 'devvault_settings',
  SNIPPETS: 'devvault_snippets',
  NOTES: 'devvault_notes',
  TASKS: 'devvault_tasks',
  PALETTES: 'devvault_palettes'
};

const CURRENT_VERSION = 1;

export class StorageManager {
  private static isAvailable(): boolean {
    try {
      const test = '__devvault_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static getSettings(): UserSettings {
    if (!this.isAvailable()) return DEFAULT_SETTINGS;
    try {
      const item = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!item) {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(item) };
    } catch (e) {
      console.warn('Failed to parse settings from storage, resetting', e);
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: UserSettings): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Storage quota exceeded or error saving settings', e);
    }
  }

  static getSnippets(): CodeSnippet[] {
    if (!this.isAvailable()) return INITIAL_SNIPPETS;
    try {
      const item = localStorage.getItem(STORAGE_KEYS.SNIPPETS);
      if (!item) {
        this.saveSnippets(INITIAL_SNIPPETS);
        return INITIAL_SNIPPETS;
      }
      return JSON.parse(item);
    } catch (e) {
      console.warn('Corrupted snippets in storage, restoring defaults', e);
      return INITIAL_SNIPPETS;
    }
  }

  static saveSnippets(snippets: CodeSnippet[]): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(snippets));
    } catch (e) {
      console.error('Error saving snippets to storage', e);
    }
  }

  static getNotes(): DevNote[] {
    if (!this.isAvailable()) return INITIAL_NOTES;
    try {
      const item = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (!item) {
        this.saveNotes(INITIAL_NOTES);
        return INITIAL_NOTES;
      }
      return JSON.parse(item);
    } catch (e) {
      console.warn('Corrupted notes in storage, restoring defaults', e);
      return INITIAL_NOTES;
    }
  }

  static saveNotes(notes: DevNote[]): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving notes to storage', e);
    }
  }

  static getTasks(): DevTask[] {
    if (!this.isAvailable()) return INITIAL_TASKS;
    try {
      const item = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!item) {
        this.saveTasks(INITIAL_TASKS);
        return INITIAL_TASKS;
      }
      return JSON.parse(item);
    } catch (e) {
      console.warn('Corrupted tasks in storage, restoring defaults', e);
      return INITIAL_TASKS;
    }
  }

  static saveTasks(tasks: DevTask[]): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to storage', e);
    }
  }

  static getPalettes(): ColorPalette[] {
    if (!this.isAvailable()) return INITIAL_PALETTES;
    try {
      const item = localStorage.getItem(STORAGE_KEYS.PALETTES);
      if (!item) {
        this.savePalettes(INITIAL_PALETTES);
        return INITIAL_PALETTES;
      }
      return JSON.parse(item);
    } catch (e) {
      console.warn('Corrupted palettes in storage, restoring defaults', e);
      return INITIAL_PALETTES;
    }
  }

  static savePalettes(palettes: ColorPalette[]): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PALETTES, JSON.stringify(palettes));
    } catch (e) {
      console.error('Error saving palettes to storage', e);
    }
  }

  static exportAllData(): string {
    const data: DevVaultStorageData = {
      version: CURRENT_VERSION,
      exportedAt: new Date().toISOString(),
      snippets: this.getSnippets(),
      notes: this.getNotes(),
      tasks: this.getTasks(),
      palettes: this.getPalettes(),
      settings: this.getSettings()
    };
    return JSON.stringify(data, null, 2);
  }

  static exportGitHubGistJson(): string {
    const snippets = this.getSnippets();
    const notes = this.getNotes();

    const files: Record<string, { content: string }> = {};

    // README file
    files['README.md'] = {
      content: `# Vault Developer Workspace - Exported Code & Knowledge Base

Exported on ${new Date().toISOString()} from **Vault**.

## Summary
* **Code Snippets:** ${snippets.length} files across multi-language projects
* **Technical Notes:** ${notes.length} markdown guides
* **Tasks:** ${this.getTasks().length} items

---
Generated by Vault (https://vault.internal)`
    };

    // Add each snippet as a distinct file
    snippets.forEach((snip) => {
      const ext = getLanguageExtension(snip.language) || 'txt';
      const safeTitle = snip.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'snippet';
      const filename = `${safeTitle}.${ext}`;
      files[filename] = {
        content: `// Title: ${snip.title}\n// Category: ${snip.category} | Language: ${snip.language}\n// Description: ${snip.description}\n// Tags: ${snip.tags.join(', ')}\n\n${snip.code}`
      };
    });

    // Add notes as markdown documents
    notes.forEach((note) => {
      const safeTitle = note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'note';
      const filename = `note-${safeTitle}.md`;
      files[filename] = {
        content: note.content
      };
    });

    const gistPayload = {
      description: 'Vault Developer Workspace Export (Snippets, Notes & Technical Knowledge Base)',
      public: false,
      files
    };

    return JSON.stringify(gistPayload, null, 2);
  }

  static exportGitHubRepoTreeJson(): string {
    const snippets = this.getSnippets();
    const notes = this.getNotes();
    const tasks = this.getTasks();

    const tree: Array<{ path: string; mode: string; type: string; content: string }> = [];

    tree.push({
      path: 'README.md',
      mode: '100644',
      type: 'blob',
      content: `# Vault Developer Workspace Repository

Exported from **Vault** at ${new Date().toISOString()}.

## Structure
* \`snippets/\`: Code snippets organized by language.
* \`notes/\`: Developer documentation and markdown notes.
* \`tasks.json\`: Development sprint tasks and Kanban statuses.
`
    });

    snippets.forEach((snip) => {
      const ext = getLanguageExtension(snip.language) || 'txt';
      const safeTitle = snip.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'snippet';
      tree.push({
        path: `snippets/${snip.language}/${safeTitle}.${ext}`,
        mode: '100644',
        type: 'blob',
        content: snip.code
      });
    });

    notes.forEach((note) => {
      const safeTitle = note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'note';
      tree.push({
        path: `notes/${safeTitle}.md`,
        mode: '100644',
        type: 'blob',
        content: note.content
      });
    });

    tree.push({
      path: 'tasks.json',
      mode: '100644',
      type: 'blob',
      content: JSON.stringify(tasks, null, 2)
    });

    return JSON.stringify({ tree }, null, 2);
  }

  static importData(jsonString: string, mode: 'merge' | 'replace' = 'replace'): { success: boolean; message: string } {
    try {
      const parsed: DevVaultStorageData = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON payload.' };
      }

      if (mode === 'replace') {
        if (Array.isArray(parsed.snippets)) this.saveSnippets(parsed.snippets);
        if (Array.isArray(parsed.notes)) this.saveNotes(parsed.notes);
        if (Array.isArray(parsed.tasks)) this.saveTasks(parsed.tasks);
        if (Array.isArray(parsed.palettes)) this.savePalettes(parsed.palettes);
        if (parsed.settings) this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      } else {
        // Merge mode
        if (Array.isArray(parsed.snippets)) {
          const current = this.getSnippets();
          const existingIds = new Set(current.map(s => s.id));
          const merged = [...current, ...parsed.snippets.filter(s => !existingIds.has(s.id))];
          this.saveSnippets(merged);
        }
        if (Array.isArray(parsed.notes)) {
          const current = this.getNotes();
          const existingIds = new Set(current.map(n => n.id));
          const merged = [...current, ...parsed.notes.filter(n => !existingIds.has(n.id))];
          this.saveNotes(merged);
        }
        if (Array.isArray(parsed.tasks)) {
          const current = this.getTasks();
          const existingIds = new Set(current.map(t => t.id));
          const merged = [...current, ...parsed.tasks.filter(t => !existingIds.has(t.id))];
          this.saveTasks(merged);
        }
        if (Array.isArray(parsed.palettes)) {
          const current = this.getPalettes();
          const existingIds = new Set(current.map(p => p.id));
          const merged = [...current, ...parsed.palettes.filter(p => !existingIds.has(p.id))];
          this.savePalettes(merged);
        }
      }

      return { success: true, message: `Successfully imported backup (${mode} mode).` };
    } catch (e: any) {
      return { success: false, message: `Failed to parse backup JSON: ${e?.message || 'Unknown error'}` };
    }
  }

  static clearAllData(): void {
    if (!this.isAvailable()) return;
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveSnippets(INITIAL_SNIPPETS);
    this.saveNotes(INITIAL_NOTES);
    this.saveTasks(INITIAL_TASKS);
    this.savePalettes(INITIAL_PALETTES);
  }

  static getStorageStats(): { bytesUsed: number; formattedSize: string; itemCount: number } {
    let bytes = 0;
    let items = 0;
    if (this.isAvailable()) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('devvault_')) {
          const value = localStorage.getItem(key) || '';
          bytes += (key.length + value.length) * 2; // UTF-16 bytes approx
          items++;
        }
      }
    }
    const formatted = bytes < 1024 
      ? `${bytes} B` 
      : bytes < 1024 * 1024 
        ? `${(bytes / 1024).toFixed(1)} KB` 
        : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

    return { bytesUsed: bytes, formattedSize: formatted, itemCount: items };
  }
}
