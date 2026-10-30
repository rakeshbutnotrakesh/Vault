import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { TOOLS } from '../../lib/constants';
import { ToolId } from '../../types';
import { searchLanguages } from '../../lib/languages';
import { IconRenderer } from '../common/IconRenderer';
import { Search, X, Code2, BookOpen, CheckSquare, Wrench, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    setActiveTool,
    snippets,
    notes,
    tasks
  } = useDevVault();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Unified search results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default: show tools and recent items
      return TOOLS.slice(0, 8).map((tool) => ({
        type: 'tool' as const,
        id: tool.id,
        title: tool.name,
        subtitle: tool.description,
        category: tool.category,
        iconName: tool.iconName,
        targetTool: tool.id
      }));
    }

    const items: Array<{
      type: 'tool' | 'snippet' | 'note' | 'task';
      id: string;
      title: string;
      subtitle: string;
      category?: string;
      iconName?: string;
      targetTool: ToolId;
    }> = [];

    // Search tools
    TOOLS.forEach((tool) => {
      if (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'tool',
          id: tool.id,
          title: tool.name,
          subtitle: tool.description,
          category: tool.category,
          iconName: tool.iconName,
          targetTool: tool.id
        });
      }
    });

    // Search 70+ worldwide languages
    const matchedLangs = searchLanguages(q).slice(0, 4);
    matchedLangs.forEach((lang) => {
      items.push({
        type: 'tool',
        id: `lang-${lang.id}`,
        title: `${lang.name} (.${lang.extension})`,
        subtitle: `${lang.categoryLabel} · ${lang.paradigm}`,
        category: 'Languages',
        iconName: 'Globe',
        targetTool: 'polyglot'
      });
    });

    // Search snippets
    snippets.forEach((snippet) => {
      if (
        snippet.title.toLowerCase().includes(q) ||
        snippet.description.toLowerCase().includes(q) ||
        snippet.tags.some((t) => t.toLowerCase().includes(q)) ||
        snippet.language.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'snippet',
          id: snippet.id,
          title: snippet.title,
          subtitle: `${snippet.language.toUpperCase()} · ${snippet.category}`,
          targetTool: 'code-vault'
        });
      }
    });

    // Search notes
    notes.forEach((note) => {
      if (
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.category.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'note',
          id: note.id,
          title: note.title,
          subtitle: `Note · ${note.category}`,
          targetTool: 'notes'
        });
      }
    });

    // Search tasks
    tasks.forEach((task) => {
      if (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.project.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'task',
          id: task.id,
          title: task.title,
          subtitle: `Task · ${task.project} · ${task.priority.toUpperCase()}`,
          targetTool: 'tasks'
        });
      }
    });

    return items.slice(0, 12);
  }, [query, snippets, notes, tasks]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleSelect = (item: (typeof results)[0]) => {
    setActiveTool(item.targetTool);
    setSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  if (!searchOpen) return null;

  return (
    <div
      onClick={() => setSearchOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 transition-colors"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, tool name, snippet, or note..."
            className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching tools, snippets, notes, or tasks found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-[#20222a] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="shrink-0">
                    {item.type === 'tool' && item.iconName ? (
                      <IconRenderer
                        name={item.iconName}
                        className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}
                      />
                    ) : item.type === 'snippet' ? (
                      <Code2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    ) : item.type === 'note' ? (
                      <BookOpen className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
                    ) : (
                      <CheckSquare className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-sky-600 dark:text-sky-400'}`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                    <div
                      className={`text-[11px] truncate ${
                        isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.type}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-white' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#141519] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Vault Command Palette</span>
        </div>
      </div>
    </div>
  );
};
