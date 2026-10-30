import React from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { shortcutsOpen, setShortcutsOpen } = useDevVault();

  if (!shortcutsOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K / ⌘ + K', desc: 'Open global search & command palette' },
    { key: 'Ctrl + Enter', desc: 'Execute code in JavaScript playground' },
    { key: 'Esc', desc: 'Close open dialogs, drawers, and search modals' },
    { key: 'Alt + 1', desc: 'Navigate to Dashboard' },
    { key: 'Alt + 2', desc: 'Navigate to Code Vault' },
    { key: 'Alt + 3', desc: 'Navigate to JSON Formatter' },
    { key: 'Alt + 4', desc: 'Navigate to Markdown Editor' },
    { key: 'Alt + 5', desc: 'Navigate to HTML Playground' },
    { key: 'Alt + 6', desc: 'Navigate to CSS Playground' },
    { key: 'Alt + 7', desc: 'Navigate to JS Playground' },
    { key: 'Alt + 8', desc: 'Navigate to Text Toolkit' },
    { key: 'Alt + 9', desc: 'Navigate to Base64 Studio' }
  ];

  return (
    <div
      onClick={() => setShortcutsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 transition-colors"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-sm">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setShortcutsOpen(false)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-1.5 max-h-96 overflow-y-auto">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-[#20222a] text-xs transition-colors"
            >
              <span className="text-slate-600 dark:text-slate-300">{sc.desc}</span>
              <kbd className="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-indigo-600 dark:text-indigo-300">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-[#141519] border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 font-mono">Esc</kbd> anytime to dismiss
        </div>
      </div>
    </div>
  );
};
