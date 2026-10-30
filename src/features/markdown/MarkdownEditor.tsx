import React, { useState, useMemo, useRef } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  FileText,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Table,
  Link2,
  Download,
  Copy,
  Save,
  CheckSquare
} from 'lucide-react';

const SAMPLE_MARKDOWN = `# Vault Technical Documentation

Vault provides a client-side, offline-first developer workspace built for clean engineering workflows.

## Core Architecture
1. **Zero External APIs**: Never leak credentials, API keys, or intellectual property.
2. **Deterministic Tooling**: Run regex parsers, diff comparisons, and JS execution locally.
3. **Storage Resilience**: Versioned JSON snapshots in localStorage with schema migrations.

### Tech Stack Matrix
| Component | Implementation | Rationale |
| :--- | :--- | :--- |
| Framework | React 19 + TypeScript | Strict static verification |
| Styling | Tailwind CSS v4 | Zero-runtime CSS design tokens |
| State | Browser LocalStorage | Total offline autonomy |

### Code Example
\`\`\`typescript
interface VaultConfig {
  offlineOnly: true;
  securityTier: 'maximum';
}
\`\`\`

> *"Tools that work reliably offline give developers uninterrupted focus."*

- [x] Sandboxed JavaScript execution
- [x] Color harmony generation & WCAG checks
- [ ] Automated regression test suite
`;

export const MarkdownEditor: React.FC = () => {
  const { addNote, showToast } = useDevVault();
  const [content, setContent] = useState(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Markdown statistics
  const stats = useMemo(() => {
    const text = content.trim();
    if (!text) return { words: 0, chars: 0, lines: 0, readTime: '0 min' };
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const lines = text.split('\n').length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return { words, chars, lines, readTime: `${minutes} min read` };
  }, [content]);

  // Insert markdown syntax helper
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  // Safe client-side markdown to HTML parser
  const renderMarkdown = (md: string): string => {
    let escaped = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Fenced Code blocks
    escaped = escaped.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="my-3 p-3.5 bg-slate-900 dark:bg-black border border-slate-700/60 rounded-xl overflow-x-auto text-xs font-mono text-emerald-400"><code>${code.trim()}</code></pre>`;
    });

    // Inline code
    escaped = escaped.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 rounded text-xs font-mono">$1</code>');

    // Tables
    escaped = escaped.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (tableMatch) => {
      const rows = tableMatch.trim().split('\n').filter(Boolean);
      if (rows.length < 2) return tableMatch;

      let tableHtml = '<div class="overflow-x-auto my-3"><table class="w-full text-left text-xs border-collapse border border-slate-200 dark:border-slate-800">';
      
      rows.forEach((row, idx) => {
        const cells = row.split('|').slice(1, -1).map(c => c.trim());
        if (cells.every(c => /^:?-+:?$/.test(c))) return;

        if (idx === 0) {
          tableHtml += '<thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"><tr>';
          cells.forEach(c => {
            tableHtml += `<th class="p-2 font-semibold border-r border-slate-200 dark:border-slate-800">${c}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr class="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900/40">';
          cells.forEach(c => {
            tableHtml += `<td class="p-2 border-r border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">${c}</td>`;
          });
          tableHtml += '</tr>';
        }
      });
      tableHtml += '</tbody></table></div>';
      return tableHtml;
    });

    // Headings
    escaped = escaped
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-1.5">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3 pb-1 border-b border-slate-200 dark:border-slate-800">$1</h1>');

    // Blockquotes
    escaped = escaped.replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-indigo-500 pl-3 my-2 text-slate-500 dark:text-slate-400 italic text-xs">$1</blockquote>');

    // Checkboxes
    escaped = escaped
      .replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center gap-2 my-1 text-xs text-slate-400 line-through"><span class="w-3.5 h-3.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px]">✓</span> $1</div>')
      .replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center gap-2 my-1 text-xs text-slate-700 dark:text-slate-300"><span class="w-3.5 h-3.5 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center"></span> $1</div>');

    // Lists
    escaped = escaped
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal text-xs text-slate-700 dark:text-slate-300 my-0.5">$1</li>')
      .replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-xs text-slate-700 dark:text-slate-300 my-0.5">$1</li>');

    // Bold and Italic
    escaped = escaped
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-slate-100">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic text-slate-800 dark:text-slate-200">$1</em>');

    // Links
    escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline">$1</a>');

    // Paragraph breaks
    const lines = escaped.split('\n');
    return lines
      .map((l) => {
        if (!l.trim()) return '<div class="h-2"></div>';
        if (l.startsWith('<h') || l.startsWith('<li') || l.startsWith('<div') || l.startsWith('<pre') || l.startsWith('<table') || l.startsWith('<block')) {
          return l;
        }
        return `<p class="my-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${l}</p>`;
      })
      .join('\n');
  };

  const handleDownloadMd = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vault-document.md';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Markdown downloaded as .md');
  };

  const handleSaveAsNote = () => {
    const firstLine = content.split('\n')[0]?.replace(/^#+\s*/, '') || 'Markdown Document';
    addNote({
      title: firstLine,
      content,
      category: 'General',
      tags: ['markdown', 'docs'],
      isPinned: false,
      isFavorite: false
    });
    showToast('Document saved to Dev Notes');
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Top Header with Stats and Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Markdown Editor</h1>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono pl-2 border-l border-slate-200 dark:border-slate-800">
            <span>{stats.words} words</span>
            <span>·</span>
            <span>{stats.chars} chars</span>
            <span>·</span>
            <span>{stats.readTime}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-lg ${
                viewMode === 'split' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1 rounded-lg ${
                viewMode === 'editor' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-lg ${
                viewMode === 'preview' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={handleSaveAsNote}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Notes</span>
          </button>

          <button
            onClick={handleDownloadMd}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Download .md file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-xl overflow-x-auto shrink-0 text-slate-500 dark:text-slate-400 text-xs shadow-2xs">
        <button
          onClick={() => insertFormatting('# ', '', 'Heading 1')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('## ', '', 'Heading 2')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('### ', '', 'Heading 3')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />

        <button
          onClick={() => insertFormatting('**', '**', 'bold text')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('*', '*', 'italic text')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('`', '`', 'code')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('```typescript\n', '\n```', '// code block')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Fenced Code Block"
        >
          <FileText className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />

        <button
          onClick={() => insertFormatting('- ', '', 'List item')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('1. ', '', 'Numbered item')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('- [ ] ', '', 'Task item')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Task Checkbox"
        >
          <CheckSquare className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />

        <button
          onClick={() => insertFormatting('> ', '', 'Quote')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            insertFormatting(
              '| Header 1 | Header 2 |\n| :--- | :--- |\n| Row 1 | Data 1 |\n',
              ''
            )
          }
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Insert Table"
        >
          <Table className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormatting('[', '](https://example.com)', 'link label')}
          className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Insert Link"
        >
          <Link2 className="w-4 h-4" />
        </button>
      </div>

      {/* Editor & Preview Panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* Editor Panel */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div
            className={`flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs ${
              viewMode === 'editor' ? 'lg:col-span-2' : ''
            }`}
          >
            <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-transparent">
              Markdown Source
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your technical markdown here..."
              className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}

        {/* Live Preview Panel */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            className={`flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs ${
              viewMode === 'preview' ? 'lg:col-span-2' : ''
            }`}
          >
            <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
              <span>Rendered Preview</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Sanitized Output</span>
            </div>
            <div
              className="flex-1 overflow-auto bg-slate-50/40 dark:bg-[#121316] p-5 prose-sm max-w-none text-slate-800 dark:text-slate-200"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
