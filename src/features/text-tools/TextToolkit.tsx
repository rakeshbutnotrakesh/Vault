import React, { useState, useMemo } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  Type,
  Copy,
  Trash2,
  Download,
  Search,
  Sliders
} from 'lucide-react';

const SAMPLE_TEXT = `Vault Architecture Overview

Vault is a high-performance offline developer workspace.
It integrates essential programming utilities into a unified workstation.
It integrates essential programming utilities into a unified workstation.

Features include:
1. Code snippet management
2. JSON parsing & validation
3. Live CSS, HTML, and JS sandboxes
4. Color harmonies & contrast analyzer
5. Regular expression matching engine
`;

export const TextToolkit: React.FC = () => {
  const { showToast } = useDevVault();
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [findStr, setFindStr] = useState<string>('');
  const [replaceStr, setReplaceStr] = useState<string>('');
  const [isRegexFind, setIsRegexFind] = useState<boolean>(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(false);

  // Statistics
  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        chars: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readTime: '0s',
        speakTime: '0s'
      };
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    const readSeconds = Math.round((words / 200) * 60);
    const speakSeconds = Math.round((words / 130) * 60);

    const readTime = readSeconds < 60 ? `${readSeconds}s` : `${Math.ceil(readSeconds / 60)}m`;
    const speakTime = speakSeconds < 60 ? `${speakSeconds}s` : `${Math.ceil(speakSeconds / 60)}m`;

    return {
      words,
      chars,
      charsNoSpaces,
      sentences,
      paragraphs,
      lines,
      readTime,
      speakTime
    };
  }, [text]);

  const transform = (fn: (input: string) => string, actionName: string) => {
    setText((prev) => fn(prev));
    showToast(`Applied ${actionName}`);
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/[\s-_]+/g, '');
  };

  const toPascalCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/[\s-_]+/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  };

  const toSnakeCase = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  };

  const removeExtraSpaces = (str: string) => {
    return str
      .split('\n')
      .map((line) => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n');
  };

  const removeDuplicateLines = (str: string) => {
    const lines = str.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];
    lines.forEach((l) => {
      if (!seen.has(l)) {
        seen.add(l);
        result.push(l);
      }
    });
    return result.join('\n');
  };

  const removeBlankLines = (str: string) => {
    return str
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n');
  };

  const sortLines = (direction: 'asc' | 'desc') => {
    const lines = text.split('\n');
    lines.sort((a, b) => (direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a)));
    setText(lines.join('\n'));
    showToast(`Sorted lines (${direction.toUpperCase()})`);
  };

  const reverseText = () => {
    setText(text.split('').reverse().join(''));
    showToast('Reversed characters');
  };

  const reverseLines = () => {
    setText(text.split('\n').reverse().join('\n'));
    showToast('Reversed lines order');
  };

  const handleFindReplace = () => {
    if (!findStr) {
      showToast('Enter a search string', 'info');
      return;
    }

    try {
      if (isRegexFind) {
        const flags = isCaseSensitive ? 'g' : 'gi';
        const regex = new RegExp(findStr, flags);
        const replaced = text.replace(regex, replaceStr);
        setText(replaced);
        showToast('Regex find & replace complete');
      } else {
        const flags = isCaseSensitive ? 'g' : 'gi';
        const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, flags);
        const replaced = text.replace(regex, replaceStr);
        setText(replaced);
        showToast('Find & replace complete');
      }
    } catch (err: any) {
      showToast(`Find/Replace error: ${err.message}`, 'error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    showToast('Text copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vault-text.txt';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Text file downloaded');
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Text Toolkit</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Real-time Batch Processor</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Text</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Download as .txt"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setText('')}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 shrink-0">
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] text-center shadow-2xs">
          <span className="block text-slate-400 text-[10px] uppercase font-mono">Words</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{stats.words}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] text-center shadow-2xs">
          <span className="block text-slate-400 text-[10px] uppercase font-mono">Chars</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{stats.chars}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] text-center shadow-2xs">
          <span className="block text-slate-400 text-[10px] uppercase font-mono">No Spaces</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{stats.charsNoSpaces}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] text-center shadow-2xs">
          <span className="block text-slate-400 text-[10px] uppercase font-mono">Lines</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{stats.lines}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] text-center shadow-2xs">
          <span className="block text-slate-400 text-[10px] uppercase font-mono">Sentences</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{stats.sentences}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] text-center shadow-2xs">
          <span className="block text-slate-400 text-[10px] uppercase font-mono">Paragraphs</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{stats.paragraphs}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] text-center shadow-2xs">
          <span className="block text-slate-400 text-[10px] uppercase font-mono">Read Time</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{stats.readTime}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] text-center shadow-2xs">
          <span className="block text-slate-400 text-[10px] uppercase font-mono">Speech</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{stats.speakTime}</span>
        </div>
      </div>

      {/* Main Split: Text Area + Action Sidebar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Editor (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-transparent">
            Source Text Input
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to transform instantly..."
            className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Action Controls Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {/* Find and Replace Box */}
          <div className="p-4 bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl space-y-2.5 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200">Find & Replace</h3>
            <input
              type="text"
              value={findStr}
              onChange={(e) => setFindStr(e.target.value)}
              placeholder="Find..."
              className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
            />
            <input
              type="text"
              value={replaceStr}
              onChange={(e) => setReplaceStr(e.target.value)}
              placeholder="Replace with..."
              className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCaseSensitive}
                  onChange={(e) => setIsCaseSensitive(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Match Case</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRegexFind}
                  onChange={(e) => setIsRegexFind(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Regex</span>
              </label>
            </div>

            <button
              onClick={handleFindReplace}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
            >
              Replace All
            </button>
          </div>

          {/* Quick Transformations */}
          <div className="p-4 bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl space-y-2.5 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200">Case Converters</h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => transform((s) => s.toUpperCase(), 'UPPERCASE')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                UPPERCASE
              </button>
              <button
                onClick={() => transform((s) => s.toLowerCase(), 'lowercase')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                lowercase
              </button>
              <button
                onClick={() => transform(toTitleCase, 'Title Case')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                Title Case
              </button>
              <button
                onClick={() => transform(toCamelCase, 'camelCase')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                camelCase
              </button>
              <button
                onClick={() => transform(toPascalCase, 'PascalCase')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                PascalCase
              </button>
              <button
                onClick={() => transform(toKebabCase, 'kebab-case')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                kebab-case
              </button>
              <button
                onClick={() => transform(toSnakeCase, 'snake_case')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                snake_case
              </button>
              <button
                onClick={() => transform((s) => toSnakeCase(s).toUpperCase(), 'CONSTANT_CASE')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                CONSTANT_CASE
              </button>
            </div>
          </div>

          {/* Cleanup & Sorting */}
          <div className="p-4 bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl space-y-2.5 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200">Line & Space Ops</h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => transform(removeExtraSpaces, 'Trim Extra Spaces')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                Trim Spaces
              </button>
              <button
                onClick={() => transform(removeDuplicateLines, 'Deduplicate Lines')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                Dedupe Lines
              </button>
              <button
                onClick={() => transform(removeBlankLines, 'Remove Blank Lines')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                Strip Empty
              </button>
              <button
                onClick={() => sortLines('asc')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                Sort A &rarr; Z
              </button>
              <button
                onClick={() => sortLines('desc')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                Sort Z &rarr; A
              </button>
              <button
                onClick={reverseLines}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                Reverse Lines
              </button>
              <button
                onClick={reverseText}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                Reverse Chars
              </button>
              <button
                onClick={() => transform((s) => encodeURIComponent(s), 'URL Encode')}
                className="p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-left"
              >
                URL Encode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
