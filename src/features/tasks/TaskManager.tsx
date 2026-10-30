import React, { useState, useMemo } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { DevTask, TaskStatus, TaskPriority } from '../../types';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit3,
  Columns,
  List,
  Calendar
} from 'lucide-react';

const STATUS_COLUMNS: { id: TaskStatus; label: string; countColor: string }[] = [
  { id: 'todo', label: 'To Do', countColor: 'text-slate-500 dark:text-slate-400' },
  { id: 'in-progress', label: 'In Progress', countColor: 'text-blue-600 dark:text-blue-400' },
  { id: 'review', label: 'Code Review', countColor: 'text-purple-600 dark:text-purple-400' },
  { id: 'done', label: 'Done', countColor: 'text-emerald-600 dark:text-emerald-400' }
];

export const TaskManager: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, updateTaskStatus, showToast } = useDevVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<TaskStatus>('todo');
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [formProject, setFormProject] = useState('Backend');
  const [formDueDate, setFormDueDate] = useState('');

  // Extract unique projects
  const projects = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => set.add(t.project));
    return Array.from(set);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.project.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProj = selectedProject === 'All' || t.project === selectedProject;
      const matchesPri = selectedPriority === 'All' || t.priority === selectedPriority;

      return matchesSearch && matchesProj && matchesPri;
    });
  }, [tasks, searchQuery, selectedProject, selectedPriority]);

  const handleOpenCreate = () => {
    setEditingTaskId(null);
    setFormTitle('');
    setFormDescription('');
    setFormStatus('todo');
    setFormPriority('medium');
    setFormProject('Backend');
    setFormDueDate('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: DevTask) => {
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormStatus(task.status);
    setFormPriority(task.priority);
    setFormProject(task.project);
    setFormDueDate(task.dueDate || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    if (editingTaskId) {
      updateTask(editingTaskId, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        status: formStatus,
        priority: formPriority,
        project: formProject.trim() || 'General',
        dueDate: formDueDate || undefined
      });
    } else {
      addTask({
        title: formTitle.trim(),
        description: formDescription.trim(),
        status: formStatus,
        priority: formPriority,
        project: formProject.trim() || 'General',
        dueDate: formDueDate || undefined
      });
    }
    setIsModalOpen(false);
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30';
      case 'high':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30';
      case 'medium':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/30';
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Developer Task Board</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            ({tasks.filter((t) => t.status !== 'done').length} pending)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl flex flex-wrap items-center gap-3 shrink-0 text-xs shadow-2xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, description, or project..."
            className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-hidden"
        >
          <option value="All">All Projects</option>
          {projects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-hidden"
        >
          <option value="All">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Main Board / List View */}
      {viewMode === 'kanban' ? (
        /* Kanban Board */
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-0 overflow-y-auto">
          {STATUS_COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-100 dark:border-[#252830] flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-[#141519]">
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{col.label}</span>
                  <span className={`text-xs font-mono font-bold ${col.countColor}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No tasks in {col.label.toLowerCase()}
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#121316] border border-slate-200/80 dark:border-[#22252c] hover:border-slate-300 dark:hover:border-slate-700 space-y-2 text-xs transition-colors group shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex-1 leading-snug">
                            {task.title}
                          </h4>
                          <span
                            className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border shrink-0 ${getPriorityBadge(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 truncate max-w-[100px] font-semibold">
                            {task.project}
                          </span>
                          {task.dueDate && (
                            <span className="font-mono text-slate-400">
                              {task.dueDate}
                            </span>
                          )}
                        </div>

                        {/* Action buttons on card hover */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1">
                            {col.id !== 'todo' && (
                              <button
                                onClick={() => {
                                  const prevStatus: Record<TaskStatus, TaskStatus> = {
                                    'todo': 'todo',
                                    'in-progress': 'todo',
                                    'review': 'in-progress',
                                    'done': 'review'
                                  };
                                  updateTaskStatus(task.id, prevStatus[col.id]);
                                }}
                                className="text-[10px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-1.5 py-0.5 rounded bg-white dark:bg-[#1c1e25] border border-slate-200 dark:border-slate-800"
                              >
                                &larr; Back
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={() => {
                                  const nextStatus: Record<TaskStatus, TaskStatus> = {
                                    'todo': 'in-progress',
                                    'in-progress': 'review',
                                    'review': 'done',
                                    'done': 'done'
                                  };
                                  updateTaskStatus(task.id, nextStatus[col.id]);
                                }}
                                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline px-1.5 py-0.5 rounded bg-white dark:bg-[#1c1e25] border border-slate-200 dark:border-slate-800 font-medium"
                              >
                                Next &rarr;
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(task)}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="flex-1 bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 flex flex-col shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] grid grid-cols-12 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 bg-slate-50/50 dark:bg-transparent">
            <span className="col-span-5">Task Title</span>
            <span className="col-span-2">Project</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-1">Priority</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-12 items-center p-2.5 text-xs hover:bg-slate-50 dark:hover:bg-[#1f2129] rounded-xl transition-colors"
              >
                <div className="col-span-5 flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')
                    }
                    className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${task.status === 'done' ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-500/20' : ''}`}
                    />
                  </button>
                  <span className={`font-medium ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {task.title}
                  </span>
                </div>

                <span className="col-span-2 font-mono text-slate-500 dark:text-slate-400 truncate">
                  {task.project}
                </span>

                <div className="col-span-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                    className="bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <span
                    className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="col-span-2 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleSave}
            className="bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-3.5 text-xs text-slate-900 dark:text-slate-100 shadow-xl"
          >
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {editingTaskId ? 'Edit Development Task' : 'Create Development Task'}
            </h3>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Implement refresh token rotation"
                className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Project</label>
                <input
                  type="text"
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  placeholder="e.g. Auth Service"
                  className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Priority</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                  className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                  className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Description</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Technical details, acceptance criteria, or PR links..."
                className="w-full h-24 bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
