import React from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { TOOLS } from '../../lib/constants';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Keyboard,
  Settings
} from 'lucide-react';

interface TopNavProps {
  onOpenMobileSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenMobileSidebar }) => {
  const {
    activeTool,
    setActiveTool,
    settings,
    toggleTheme,
    setSearchOpen,
    setShortcutsOpen
  } = useDevVault();

  const currentTool = TOOLS.find((t) => t.id === activeTool) || TOOLS[0];

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/85 dark:bg-[#141519]/85 backdrop-blur-md border-b border-[#e2e5eb] dark:border-[#22252d] px-4 flex items-center justify-between gap-4 transition-colors">
      {/* Zone 1: Breadcrumb and Mobile trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            Vault
          </span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {currentTool.name}
          </span>
          <span className="text-slate-400 dark:text-slate-400 hidden md:inline font-mono">
            · {currentTool.category}
          </span>
        </div>
      </div>

      {/* Zone 2: NotebookLM-style Centered Pill Search Trigger */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex-1 max-w-md hidden sm:flex items-center justify-between px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-[#1b1d24] hover:bg-slate-200/70 dark:hover:bg-[#22242d] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 text-xs transition-colors cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          <span className="truncate">Search tools, snippets, notes, tasks...</span>
        </div>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-full text-slate-600 dark:text-slate-300 shadow-2xs">
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </button>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => setSearchOpen(true)}
          className="sm:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Search"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShortcutsOpen(true)}
          title="Keyboard Shortcuts"
          aria-label="Keyboard Shortcuts"
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* NotebookLM Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTool('settings')}
          title="Settings & Storage"
          aria-label="Settings"
          className={`p-2 rounded-lg transition-colors ${
            activeTool === 'settings'
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
