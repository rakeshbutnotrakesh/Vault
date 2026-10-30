import React, { useState, useEffect } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { StorageManager } from '../../lib/storage';
import {
  Settings,
  HardDrive,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  ShieldCheck,
  Keyboard,
  RefreshCw,
  AlertTriangle,
  Copy,
  Code2,
  FileCode,
  Check,
  Globe
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    toggleTheme,
    refreshAllData,
    showToast,
    setShortcutsOpen
  } = useDevVault();

  const [stats, setStats] = useState(() => StorageManager.getStorageStats());
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showGistPreview, setShowGistPreview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const refreshStats = () => {
    setStats(StorageManager.getStorageStats());
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleExport = () => {
    const json = StorageManager.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported Vault backup JSON');
  };

  const handleExportGitHubGist = () => {
    const json = StorageManager.exportGitHubGistJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vault-github-gist-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded GitHub Gist .json file');
  };

  const handleExportGitHubTree = () => {
    const json = StorageManager.exportGitHubRepoTreeJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vault-github-tree-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded GitHub Tree API .json file');
  };

  const handleCopyGitHubJson = () => {
    const json = StorageManager.exportGitHubGistJson();
    navigator.clipboard.writeText(json);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showToast('Copied GitHub Gist JSON to clipboard');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = StorageManager.importData(content, importMode);
      if (result.success) {
        refreshAllData();
        refreshStats();
        showToast(result.message);
      } else {
        showToast(result.message, 'error');
      }
    };
    reader.onerror = () => {
      showToast('Failed to read file', 'error');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    StorageManager.clearAllData();
    refreshAllData();
    refreshStats();
    setShowClearConfirm(false);
    showToast('All Vault data has been reset to defaults', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Application Settings</h1>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Workspace Configuration & Storage</span>
      </div>

      {/* Local Data & Privacy Assurance Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] flex items-start gap-3.5 text-xs shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">100% Client-Side & Offline Independent</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Vault executes completely inside your browser. No external AI APIs, no telemetry servers, and no third-party database connections are ever initiated. Your code snippets, passwords, and tokens remain strictly in browser storage.
          </p>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-6 space-y-4 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Appearance & Themes
        </h2>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-[#252830] text-xs">
          <div>
            <span className="font-medium text-slate-800 dark:text-slate-200 block">Workspace Theme</span>
            <span className="text-slate-500 dark:text-slate-400">Toggle between NotebookLM-inspired Light and Dark modes</span>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {settings.theme === 'dark' ? (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between py-2 text-xs">
          <div>
            <span className="font-medium text-slate-800 dark:text-slate-200 block">Keyboard Shortcuts Reference</span>
            <span className="text-slate-500 dark:text-slate-400">View all hotkeys for rapid workspace navigation</span>
          </div>

          <button
            onClick={() => setShortcutsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>View Hotkeys</span>
          </button>
        </div>
      </div>

      {/* Local Storage & Backup Management */}
      <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Browser Storage & Backup Management</span>
          </h2>
          <button
            onClick={refreshStats}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            title="Refresh storage size"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Storage stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Storage Used</span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono">{stats.formattedSize}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Vault Records</span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono">{stats.itemCount} keys</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Storage Quota</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">&lt; 1% (5MB max)</span>
          </div>
        </div>

        {/* Export / Import Actions */}
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-[#252830]">
          {/* GitHub Direct Import Section */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold text-xs text-indigo-950 dark:text-indigo-200">
                  Export for GitHub Direct Import (.json)
                </span>
                <span className="text-[10px] bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-mono px-2 py-0.5 rounded-full">
                  Gist & Repo Ready
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyGitHubJson}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#181a20] border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
                  title="Copy GitHub Gist JSON"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={() => setShowGistPreview(!showGistPreview)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#181a20] border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors font-medium"
                >
                  {showGistPreview ? 'Hide Preview' : 'Preview JSON'}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Downloads a formatted <code>.json</code> manifest compatible with the official <strong>GitHub Gist API</strong> and <strong>Git Database Tree API</strong>. You can directly import this JSON into GitHub via the GitHub CLI or REST API.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleExportGitHubGist}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download GitHub Gist (.json)</span>
              </button>

              <button
                onClick={handleExportGitHubTree}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-[#22252c] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-colors shadow-2xs cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Download Git Tree (.json)</span>
              </button>
            </div>

            {/* Quick CLI Import Command */}
            <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-200 flex items-center justify-between border border-slate-800">
              <div className="truncate">
                <span className="text-indigo-400">$</span> gh gist create --input vault-github-gist.json
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('gh gist create --input vault-github-gist.json');
                  showToast('Copied CLI command');
                }}
                className="text-slate-400 hover:text-white p-1 shrink-0 ml-2"
                title="Copy command"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* JSON Viewer */}
            {showGistPreview && (
              <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-300 max-h-56 overflow-auto border border-slate-800 leading-relaxed select-text">
                <code>{StorageManager.exportGitHubGistJson()}</code>
              </pre>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs pt-2">
            <div>
              <span className="font-medium text-slate-800 dark:text-slate-200 block">Export Full Snapshot</span>
              <span className="text-slate-500 dark:text-slate-400">
                Download all snippets, notes, tasks, and palettes in a portable JSON file.
              </span>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-colors shadow-2xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full Vault JSON</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs pt-3 border-t border-slate-100 dark:border-slate-800/60">
            <div>
              <span className="font-medium text-slate-800 dark:text-slate-200 block">Import Backup</span>
              <span className="text-slate-500 dark:text-slate-400">
                Restore previously exported Vault JSON file.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={importMode}
                onChange={(e) => setImportMode(e.target.value as 'replace' | 'merge')}
                className="bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 text-xs"
              >
                <option value="replace">Replace All</option>
                <option value="merge">Merge New Items</option>
              </select>

              <label className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer transition-colors font-medium">
                <Upload className="w-3.5 h-3.5" />
                <span>Select File</span>
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone: Clear Data */}
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5 space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              Permanently wipe all locally stored snippets, tasks, and notes, resetting to the initial starter kit.
            </p>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors shrink-0 font-medium shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reset Vault Storage?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will erase all custom snippets, notes, and task progress from your browser&rsquo;s local storage.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-medium text-white"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
