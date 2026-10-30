import React, { useState, useMemo } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { CodeSnippet, SupportedLanguage, SnippetCategory } from '../../types';
import {
  Code2,
  Plus,
  Search,
  Star,
  Copy,
  Download,
  Trash2,
  Edit3,
  CopyCheck,
  Tag,
  Filter,
  Check,
  X,
  FileCode,
  FolderOpen,
  Sparkles
} from 'lucide-react';

import {
  WORLD_LANGUAGES,
  getLanguageExtension,
  getLanguageById
} from '../../lib/languages';
import { StorageManager } from '../../lib/storage';

const CATEGORIES: SnippetCategory[] = [
  'Frontend',
  'Backend',
  'DevOps',
  'Database',
  'Algorithms',
  'Utilities',
  'Configuration',
  'General'
];

export const CodeVault: React.FC = () => {
  const {
    snippets,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    duplicateSnippet,
    toggleFavoriteSnippet,
    showToast
  } = useDevVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(
    snippets[0]?.id || null
  );

  // Editor / Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formLanguage, setFormLanguage] = useState<SupportedLanguage>('typescript');
  const [formCategory, setFormCategory] = useState<SnippetCategory>('Utilities');
  const [formTags, setFormTags] = useState('');

  const filteredSnippets = useMemo(() => {
    return snippets.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || s.category === selectedCategory;
      const matchesLanguage =
        selectedLanguage === 'All' || s.language === selectedLanguage;
      const matchesFavorites = !showOnlyFavorites || s.isFavorite;

      return matchesSearch && matchesCategory && matchesLanguage && matchesFavorites;
    });
  }, [snippets, searchQuery, selectedCategory, selectedLanguage, showOnlyFavorites]);

  const activeSnippet = useMemo(() => {
    return (
      snippets.find((s) => s.id === selectedSnippetId) ||
      filteredSnippets[0] ||
      null
    );
  }, [snippets, selectedSnippetId, filteredSnippets]);

  const handleStartCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setFormTitle('');
    setFormDescription('');
    setFormCode('// Enter your snippet code here\n');
    setFormLanguage('typescript');
    setFormCategory('Frontend');
    setFormTags('');
  };

  const handleStartEdit = (snip: CodeSnippet) => {
    setIsEditing(true);
    setIsCreating(false);
    setFormTitle(snip.title);
    setFormDescription(snip.description);
    setFormCode(snip.code);
    setFormLanguage(snip.language);
    setFormCategory(snip.category);
    setFormTags(snip.tags.join(', '));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (isCreating) {
      addSnippet({
        title: formTitle.trim(),
        description: formDescription.trim(),
        code: formCode,
        language: formLanguage,
        category: formCategory,
        tags: tagsArray,
        isFavorite: false
      });
      setIsCreating(false);
    } else if (isEditing && activeSnippet) {
      updateSnippet(activeSnippet.id, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        code: formCode,
        language: formLanguage,
        category: formCategory,
        tags: tagsArray
      });
      setIsEditing(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Code copied to clipboard');
  };

  const handleDownload = (snippet: CodeSnippet) => {
    const ext = getLanguageExtension(snippet.language) || 'txt';
    const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${snippet.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded as .${ext}`);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteSnippet(deleteConfirmId);
      if (selectedSnippetId === deleteConfirmId) {
        setSelectedSnippetId(null);
      }
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Code Vault</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            ({snippets.length} snippets)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const json = StorageManager.exportGitHubGistJson();
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `vault-github-gist-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
              URL.revokeObjectURL(url);
              showToast('Exported GitHub Gist .json file');
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-[#20232a] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            title="Export all snippets in official GitHub Gist JSON format"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Export to GitHub (.json)</span>
          </button>

          <button
            onClick={handleStartCreate}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Snippet</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Side: Search, Filters & List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          {/* Search bar & filter row */}
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] space-y-2.5 shrink-0 bg-slate-50/50 dark:bg-transparent">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search snippets by title, tag, code..."
                className="w-full bg-white dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 bg-white dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="flex-1 bg-white dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="All">All Languages ({WORLD_LANGUAGES.length})</option>
                {WORLD_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} (.{l.extension})
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowOnlyFavorites((prev) => !prev)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  showOnlyFavorites
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-500'
                    : 'bg-white dark:bg-[#121316] border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Filter favorites"
              >
                <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Snippets List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredSnippets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No snippets match your filter.
              </div>
            ) : (
              filteredSnippets.map((snip) => {
                const isSelected = activeSnippet?.id === snip.id;

                return (
                  <div
                    key={snip.id}
                    onClick={() => {
                      setSelectedSnippetId(snip.id);
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-[#20232b] border-indigo-300 dark:border-indigo-500/50 text-slate-900 dark:text-slate-100 shadow-2xs'
                        : 'bg-slate-50/60 dark:bg-[#141519] border-slate-200/60 dark:border-[#22252c] hover:bg-slate-100/80 dark:hover:bg-[#1a1c22] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-xs truncate flex-1 text-slate-900 dark:text-slate-100">
                        {snip.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteSnippet(snip.id);
                        }}
                        className="text-slate-400 hover:text-amber-500 p-0.5"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            snip.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                      {snip.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono uppercase text-indigo-600 dark:text-indigo-400 font-semibold">
                          {snip.language}
                        </span>
                        <span>·</span>
                        <span>{snip.category}</span>
                      </div>
                      <span className="font-mono">
                        {new Date(snip.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: View/Edit Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          {isCreating || isEditing ? (
            /* Creation / Editing Form */
            <form onSubmit={handleSaveForm} className="flex-1 flex flex-col p-5 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#252830] mb-4 shrink-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isCreating ? 'Create New Snippet' : 'Edit Snippet'}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors"
                  >
                    Save Snippet
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 flex-1 flex flex-col">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Robust HTTP Client with Jitter"
                    className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Language ({WORLD_LANGUAGES.length}+)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const langMeta = getLanguageById(formLanguage);
                          if (langMeta && langMeta.boilerplate) {
                            setFormCode(langMeta.boilerplate);
                            showToast(`Loaded ${langMeta.name} boilerplate`);
                          }
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                        title="Load idiomatic starter boilerplate"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Load Boilerplate</span>
                      </button>
                    </div>
                    <select
                      value={formLanguage}
                      onChange={(e) => setFormLanguage(e.target.value as SupportedLanguage)}
                      className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                    >
                      {WORLD_LANGUAGES.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} (.{l.extension}) - {l.categoryLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as SnippetCategory)}
                      className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief explanation of logic, parameters, and return type..."
                    className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tags <span className="text-slate-400 font-normal">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="async, retry, http, util"
                    className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div className="flex-1 flex flex-col min-h-48">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Source Code</label>
                  <textarea
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="flex-1 w-full bg-slate-900 text-slate-100 border border-slate-700/80 rounded-xl p-3.5 font-mono text-xs resize-none focus:outline-hidden focus:border-indigo-500 leading-relaxed"
                    spellCheck={false}
                  />
                </div>
              </div>
            </form>
          ) : activeSnippet ? (
            /* View Snippet Mode */
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header with Title and Actions */}
              <div className="p-5 border-b border-slate-100 dark:border-[#252830] shrink-0 flex items-start justify-between gap-4 bg-slate-50/40 dark:bg-transparent">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {activeSnippet.title}
                    </h2>
                    <button
                      onClick={() => toggleFavoriteSnippet(activeSnippet.id)}
                      className="text-slate-400 hover:text-amber-500"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          activeSnippet.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{activeSnippet.description}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
                      {activeSnippet.language}
                    </span>
                    <span>·</span>
                    <span>{activeSnippet.category}</span>
                    {activeSnippet.tags.length > 0 && (
                      <>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          {activeSnippet.tags.map((t) => (
                            <span key={t} className="text-slate-500 dark:text-slate-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons Toolbar */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopyCode(activeSnippet.code)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>

                  <button
                    onClick={() => handleDownload(activeSnippet)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    title="Download code file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => duplicateSnippet(activeSnippet.id)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    title="Duplicate snippet"
                  >
                    <CopyCheck className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleStartEdit(activeSnippet)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    title="Edit snippet"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(activeSnippet.id)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Delete snippet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code viewer with line numbers */}
              <div className="flex-1 overflow-auto bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-relaxed flex">
                <div className="select-none text-slate-500 pr-4 border-r border-slate-800 text-right shrink-0">
                  {activeSnippet.code.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="pl-4 overflow-x-auto whitespace-pre flex-1 text-slate-200">
                  {activeSnippet.code}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
              <FolderOpen className="w-8 h-8 text-slate-400 mb-2" />
              <p>Select a snippet on the left to preview or create a new one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delete Snippet?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this code snippet? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-medium text-white"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
