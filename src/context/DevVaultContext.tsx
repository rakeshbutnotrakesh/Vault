import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ToolId,
  CodeSnippet,
  DevNote,
  DevTask,
  TaskStatus,
  ColorPalette,
  UserSettings
} from '../types';
import { StorageManager } from '../lib/storage';
import { DEFAULT_SETTINGS } from '../lib/constants';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface DevVaultContextType {
  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;
  // Snippets
  snippets: CodeSnippet[];
  addSnippet: (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSnippet: (id: string, updates: Partial<CodeSnippet>) => void;
  deleteSnippet: (id: string) => void;
  duplicateSnippet: (id: string) => void;
  toggleFavoriteSnippet: (id: string) => void;
  // Notes
  notes: DevNote[];
  addNote: (note: Omit<DevNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<DevNote>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  toggleFavoriteNote: (id: string) => void;
  // Tasks
  tasks: DevTask[];
  addTask: (task: Omit<DevTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<DevTask>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  // Palettes
  palettes: ColorPalette[];
  addPalette: (name: string, colors: string[]) => void;
  deletePalette: (id: string) => void;
  // Settings
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  toggleTheme: () => void;
  toggleFavoriteTool: (toolId: ToolId) => void;
  // Modals & UI
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  // Data management
  refreshAllData: () => void;
}

const DevVaultContext = createContext<DevVaultContextType | undefined>(undefined);

export const DevVaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTool, setActiveToolState] = useState<ToolId>('dashboard');
  const [settings, setSettings] = useState<UserSettings>(() => StorageManager.getSettings());
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => StorageManager.getSnippets());
  const [notes, setNotes] = useState<DevNote[]>(() => StorageManager.getNotes());
  const [tasks, setTasks] = useState<DevTask[]>(() => StorageManager.getTasks());
  const [palettes, setPalettes] = useState<ColorPalette[]>(() => StorageManager.getPalettes());
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setActiveTool = useCallback((tool: ToolId) => {
    setActiveToolState(tool);
    // Update recent tools in settings
    setSettings((prev) => {
      const filtered = prev.recentTools.filter((t) => t !== tool);
      const updatedRecents = [tool, ...filtered].slice(0, 6);
      const updated = { ...prev, recentTools: updatedRecents };
      StorageManager.saveSettings(updated);
      return updated;
    });
  }, []);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      StorageManager.saveSettings(updated);
      return updated;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      const updated: UserSettings = { ...prev, theme: nextTheme };
      StorageManager.saveSettings(updated);
      showToast(`Switched to ${nextTheme} mode`, 'info');
      return updated;
    });
  }, [showToast]);

  const toggleFavoriteTool = useCallback((toolId: ToolId) => {
    setSettings((prev) => {
      const isFav = prev.favorites.includes(toolId);
      const updatedFavs = isFav
        ? prev.favorites.filter((id) => id !== toolId)
        : [...prev.favorites, toolId];
      const updated = { ...prev, favorites: updatedFavs };
      StorageManager.saveSettings(updated);
      showToast(isFav ? 'Removed tool from favorites' : 'Pinned tool to favorites', 'info');
      return updated;
    });
  }, [showToast]);

  // Snippets handlers
  const addSnippet = useCallback((snippetData: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSnippet: CodeSnippet = {
      ...snippetData,
      id: `snip-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setSnippets((prev) => {
      const next = [newSnippet, ...prev];
      StorageManager.saveSnippets(next);
      return next;
    });
    showToast('Snippet created successfully');
  }, [showToast]);

  const updateSnippet = useCallback((id: string, updates: Partial<CodeSnippet>) => {
    setSnippets((prev) => {
      const next = prev.map((snip) =>
        snip.id === id ? { ...snip, ...updates, updatedAt: new Date().toISOString() } : snip
      );
      StorageManager.saveSnippets(next);
      return next;
    });
    showToast('Snippet updated');
  }, [showToast]);

  const deleteSnippet = useCallback((id: string) => {
    setSnippets((prev) => {
      const next = prev.filter((snip) => snip.id !== id);
      StorageManager.saveSnippets(next);
      return next;
    });
    showToast('Snippet deleted', 'info');
  }, [showToast]);

  const duplicateSnippet = useCallback((id: string) => {
    setSnippets((prev) => {
      const original = prev.find((s) => s.id === id);
      if (!original) return prev;
      const now = new Date().toISOString();
      const duplicate: CodeSnippet = {
        ...original,
        id: `snip-${Date.now()}`,
        title: `${original.title} (Copy)`,
        createdAt: now,
        updatedAt: now
      };
      const next = [duplicate, ...prev];
      StorageManager.saveSnippets(next);
      return next;
    });
    showToast('Snippet duplicated');
  }, [showToast]);

  const toggleFavoriteSnippet = useCallback((id: string) => {
    setSnippets((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
      StorageManager.saveSnippets(next);
      return next;
    });
  }, []);

  // Notes handlers
  const addNote = useCallback((noteData: Omit<DevNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: DevNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setNotes((prev) => {
      const next = [newNote, ...prev];
      StorageManager.saveNotes(next);
      return next;
    });
    showToast('Note created');
  }, [showToast]);

  const updateNote = useCallback((id: string, updates: Partial<DevNote>) => {
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      );
      StorageManager.saveNotes(next);
      return next;
    });
    showToast('Note saved');
  }, [showToast]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      StorageManager.saveNotes(next);
      return next;
    });
    showToast('Note deleted', 'info');
  }, [showToast]);

  const togglePinNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
      StorageManager.saveNotes(next);
      return next;
    });
  }, []);

  const toggleFavoriteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
      StorageManager.saveNotes(next);
      return next;
    });
  }, []);

  // Tasks handlers
  const addTask = useCallback((taskData: Omit<DevTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: DevTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setTasks((prev) => {
      const next = [newTask, ...prev];
      StorageManager.saveTasks(next);
      return next;
    });
    showToast('Task created');
  }, [showToast]);

  const updateTask = useCallback((id: string, updates: Partial<DevTask>) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      );
      StorageManager.saveTasks(next);
      return next;
    });
    showToast('Task updated');
  }, [showToast]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      StorageManager.saveTasks(next);
      return next;
    });
    showToast('Task deleted', 'info');
  }, [showToast]);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
      );
      StorageManager.saveTasks(next);
      return next;
    });
  }, []);

  // Palettes handlers
  const addPalette = useCallback((name: string, colors: string[]) => {
    const newPal: ColorPalette = {
      id: `pal-${Date.now()}`,
      name,
      colors,
      createdAt: new Date().toISOString()
    };
    setPalettes((prev) => {
      const next = [newPal, ...prev];
      StorageManager.savePalettes(next);
      return next;
    });
    showToast('Palette saved to collection');
  }, [showToast]);

  const deletePalette = useCallback((id: string) => {
    setPalettes((prev) => {
      const next = prev.filter((p) => p.id !== id);
      StorageManager.savePalettes(next);
      return next;
    });
    showToast('Palette removed', 'info');
  }, [showToast]);

  const refreshAllData = useCallback(() => {
    setSettings(StorageManager.getSettings());
    setSnippets(StorageManager.getSnippets());
    setNotes(StorageManager.getNotes());
    setTasks(StorageManager.getTasks());
    setPalettes(StorageManager.getPalettes());
  }, []);

  // Global keydown listener for shortcuts: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if inside input unless it's Ctrl+K / Cmd+K or Escape
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DevVaultContext.Provider
      value={{
        activeTool,
        setActiveTool,
        snippets,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        duplicateSnippet,
        toggleFavoriteSnippet,
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        toggleFavoriteNote,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        palettes,
        addPalette,
        deletePalette,
        settings,
        updateSettings,
        toggleTheme,
        toggleFavoriteTool,
        searchOpen,
        setSearchOpen,
        shortcutsOpen,
        setShortcutsOpen,
        toasts,
        showToast,
        removeToast,
        refreshAllData
      }}
    >
      {children}
    </DevVaultContext.Provider>
  );
};

export const useDevVault = () => {
  const context = useContext(DevVaultContext);
  if (!context) {
    throw new Error('useDevVault must be used within a DevVaultProvider');
  }
  return context;
};
