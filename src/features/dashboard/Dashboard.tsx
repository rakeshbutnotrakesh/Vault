import React from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { TOOLS } from '../../lib/constants';
import { ToolId } from '../../types';
import { IconRenderer } from '../../components/common/IconRenderer';
import { VaultLogo } from '../../components/common/VaultLogo';
import {
  Code2,
  BookOpen,
  CheckSquare,
  ArrowRight,
  Star,
  Copy,
  Clock,
  Plus,
  Terminal,
  CheckCircle2,
  Sparkles,
  Globe
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    setActiveTool,
    settings,
    toggleFavoriteTool,
    snippets,
    notes,
    tasks,
    updateTaskStatus,
    showToast
  } = useDevVault();

  const favoriteTools = TOOLS.filter((t) => settings.favorites.includes(t.id));
  const recentTools = settings.recentTools
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter((t): t is typeof TOOLS[0] => Boolean(t))
    .slice(0, 4);

  const recentSnippets = snippets.slice(0, 3);
  const pinnedNotes = notes.filter((n) => n.isPinned).slice(0, 3);
  const pendingTasks = tasks.filter((t) => t.status !== 'done').slice(0, 4);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    showToast('Code copied to clipboard');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
      case 'high':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'medium':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* NotebookLM-Inspired Welcome & Quick Action Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 dark:from-[#161820] dark:via-[#1c1e27] dark:to-[#161820] border border-indigo-100/80 dark:border-[#272a34] rounded-2xl p-6 md:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <VaultLogo className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                Vault Workspace
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Your Offline Developer Cockpit
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Fast, distraction-free workstation with native tools for code snippets, live playgrounds, JSON validation, regex testing, and notes. No external AI APIs, zero telemetry.
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTool('polyglot')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold rounded-xl transition-all shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>70+ Languages</span>
            </button>
            <button
              onClick={() => setActiveTool('code-vault')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-all shadow-xs hover:shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Snippet</span>
            </button>
            <button
              onClick={() => setActiveTool('tasks')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#20232b] hover:bg-slate-50 dark:hover:bg-[#272a34] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium rounded-xl transition-all shadow-2xs"
            >
              <CheckSquare className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => setActiveTool('js-playground')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#20232b] hover:bg-slate-50 dark:hover:bg-[#272a34] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium rounded-xl transition-all shadow-2xs"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>JS Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Favorite Tools Grid */}
      {favoriteTools.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
              FAVORITE TOOLS ({favoriteTools.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {favoriteTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="group relative p-4 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] hover:border-indigo-400/80 dark:hover:border-indigo-500/60 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconRenderer name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteTool(tool.id);
                      }}
                      className="text-amber-500 hover:text-amber-600 dark:text-amber-400 p-1 transition-colors"
                      title="Unpin favorite"
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#252830] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-500 dark:text-slate-400">{tool.category}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Workspace Split: Left (Recent Snippets & Notes) / Right (Pending Tasks & Recents) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Snippets */}
          <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Recent Code Snippets
                </h2>
              </div>
              <button
                onClick={() => setActiveTool('code-vault')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
              >
                <span>View all ({snippets.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentSnippets.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No snippets saved yet. Jump into Code Vault to create your first snippet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentSnippets.map((snip) => (
                  <div
                    key={snip.id}
                    onClick={() => setActiveTool('code-vault')}
                    className="group p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#141519] border border-slate-200/70 dark:border-[#242730] hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                          {snip.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                          {snip.language}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleCopyCode(snip.code, e)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0"
                        title="Copy code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{snip.description}</p>

                    <pre className="p-2.5 rounded-lg bg-white dark:bg-[#0f1013] border border-slate-200/80 dark:border-[#22252c] text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-hidden max-h-16 truncate">
                      <code>{snip.code.split('\n').slice(0, 2).join('\n')}...</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pinned & Recent Notes */}
          <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Pinned Engineering Notes
                </h2>
              </div>
              <button
                onClick={() => setActiveTool('notes')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
              >
                <span>All notes ({notes.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pinnedNotes.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No pinned notes. Pin key design docs and cheat sheets in Dev Notes for fast recall.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pinnedNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setActiveTool('notes')}
                    className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#141519] border border-slate-200/70 dark:border-[#242730] hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{note.category}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{note.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {note.content.replace(/#|\*|`/g, '')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Priority Tasks */}
          <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Priority Tasks
                </h2>
              </div>
              <button
                onClick={() => setActiveTool('tasks')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Board
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                All development tasks completed!
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-50/80 dark:bg-[#141519] border border-slate-200/70 dark:border-[#242730] flex items-start gap-2.5"
                  >
                    <button
                      onClick={() => updateTaskStatus(task.id, 'done')}
                      className="mt-0.5 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors shrink-0"
                      title="Mark task completed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {task.title}
                        </span>
                        <span
                          className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border shrink-0 ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="truncate">{task.project}</span>
                        {task.dueDate && (
                          <span className="font-mono text-[10px] text-slate-400">
                            Due {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Used Tools */}
          <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-5 shadow-2xs">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Jump Back In</span>
            </h2>

            <div className="space-y-1.5">
              {recentTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#20222a] text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <IconRenderer name={tool.iconName} className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="font-medium truncate">{tool.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {tool.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
