import React, { useState, useMemo } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { DevNote, NoteCategory } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Star,
  Pin,
  Trash2,
  Edit3,
  Download,
  Copy,
  Tag,
  FolderOpen
} from 'lucide-react';

const CATEGORIES: NoteCategory[] = [
  'Architecture',
  'Database',
  'Frontend',
  'Backend',
  'DevOps',
  'Cheat Sheet',
  'Meeting Notes',
  'Ideas',
  'General'
];

export const NotesManager: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    toggleFavoriteNote,
    showToast
  } = useDevVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);

  // Form / Editor states
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<NoteCategory>('Architecture');
  const [formTags, setFormTags] = useState('');

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        const matchesSearch =
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, searchQuery, selectedCategory]);

  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || filteredNotes[0] || null;
  }, [notes, selectedNoteId, filteredNotes]);

  const handleStartCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setFormTitle('');
    setFormContent('# Note Title\n\nDocument your system requirements, architecture blueprints, or CLI snippets here.');
    setFormCategory('Architecture');
    setFormTags('');
  };

  const handleStartEdit = (note: DevNote) => {
    setIsEditing(true);
    setIsCreating(false);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category);
    setFormTags(note.tags.join(', '));
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
      addNote({
        title: formTitle.trim(),
        content: formContent,
        category: formCategory,
        tags: tagsArray,
        isPinned: false,
        isFavorite: false
      });
      setIsCreating(false);
    } else if (isEditing && activeNote) {
      updateNote(activeNote.id, {
        title: formTitle.trim(),
        content: formContent,
        category: formCategory,
        tags: tagsArray
      });
      setIsEditing(false);
    }
  };

  const handleDownload = (note: DevNote) => {
    const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Note downloaded as .md');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast('Note copied to clipboard');
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Dev Notes</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">({notes.length} notes)</span>
        </div>

        <button
          onClick={handleStartCreate}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Side: Filter & Notes List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] space-y-2.5 shrink-0 bg-slate-50/50 dark:bg-transparent">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, tag, or content..."
                className="w-full bg-white dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notes found matching your criteria.
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-[#20232b] border-indigo-300 dark:border-indigo-500/50 text-slate-900 dark:text-slate-100 shadow-2xs'
                        : 'bg-slate-50/60 dark:bg-[#141519] border-slate-200/60 dark:border-[#22252c] hover:bg-slate-100/80 dark:hover:bg-[#1a1c22] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 truncate flex-1">
                        {note.isPinned && (
                          <Pin className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0 fill-indigo-500" />
                        )}
                        <span className="font-semibold text-xs truncate text-slate-900 dark:text-slate-100">{note.title}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteNote(note.id);
                        }}
                        className="text-slate-400 hover:text-amber-500 p-0.5"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            note.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                      {note.content.replace(/#|\*|`|>|\[|\]/g, '')}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{note.category}</span>
                      <span className="font-mono">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: View / Edit Note Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          {isCreating || isEditing ? (
            /* Note Edit Form */
            <form onSubmit={handleSaveForm} className="flex-1 flex flex-col p-5 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#252830] mb-4 shrink-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isCreating ? 'Create Note' : 'Edit Note'}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow-xs"
                  >
                    Save Note
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
                    placeholder="e.g. Distributed Consensus Notes"
                    className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as NoteCategory)}
                      className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tags</label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="raft, paxos, consensus"
                      className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-48">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Content (Markdown)</label>
                  <textarea
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="flex-1 w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden focus:border-indigo-500 leading-relaxed"
                    spellCheck={false}
                  />
                </div>
              </div>
            </form>
          ) : activeNote ? (
            /* View Note */
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-5 border-b border-slate-100 dark:border-[#252830] shrink-0 flex items-start justify-between gap-4 bg-slate-50/40 dark:bg-transparent">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {activeNote.title}
                    </h2>
                    <button
                      onClick={() => togglePinNote(activeNote.id)}
                      className={`p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                        activeNote.isPinned ? 'text-indigo-600 dark:text-indigo-400' : ''
                      }`}
                      title={activeNote.isPinned ? 'Unpin note' : 'Pin note to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${activeNote.isPinned ? 'fill-indigo-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleFavoriteNote(activeNote.id)}
                      className="p-1 text-slate-400 hover:text-amber-500"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          activeNote.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{activeNote.category}</span>
                    <span>·</span>
                    <span>Updated {new Date(activeNote.updatedAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(activeNote.content)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Copy note text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownload(activeNote)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Download as .md"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleStartEdit(activeNote)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Edit note"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(activeNote.id)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Note Content Viewport */}
              <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-[#121316] p-5 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {activeNote.content}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
              <FolderOpen className="w-8 h-8 text-slate-400 mb-2" />
              <p>Select a note from the left sidebar or create a new one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delete Note?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this engineering note?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteNote(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-medium text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
