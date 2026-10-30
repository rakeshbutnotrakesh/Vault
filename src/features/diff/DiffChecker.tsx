import React, { useState, useMemo } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  GitCompare,
  Copy,
  Trash2,
  ArrowLeftRight,
  Columns,
  List
} from 'lucide-react';

const SAMPLE_ORIGINAL = `export interface UserSession {
  id: string;
  userId: string;
  role: 'admin' | 'user';
  createdAt: number;
}

function validateToken(token: string) {
  if (!token) return false;
  return token.startsWith("ey");
}`;

const SAMPLE_MODIFIED = `export interface UserSession {
  id: string;
  userId: string;
  role: 'admin' | 'user' | 'service';
  createdAt: number;
  expiresAt: number;
}

function validateToken(token: string) {
  if (!token || token.length < 32) return false;
  return token.startsWith("eyJ");
}`;

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  originalLineNum?: number;
  modifiedLineNum?: number;
}

export const DiffChecker: React.FC = () => {
  const { showToast } = useDevVault();
  const [originalText, setOriginalText] = useState<string>(SAMPLE_ORIGINAL);
  const [modifiedText, setModifiedText] = useState<string>(SAMPLE_MODIFIED);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const diffResult = useMemo(() => {
    const origLines = originalText.split('\n');
    const modLines = modifiedText.split('\n');

    const n = origLines.length;
    const m = modLines.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (origLines[i - 1] === modLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const lines: DiffLine[] = [];
    let i = n;
    let j = m;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
        lines.unshift({
          type: 'unchanged',
          text: origLines[i - 1],
          originalLineNum: i,
          modifiedLineNum: j
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        lines.unshift({
          type: 'added',
          text: modLines[j - 1],
          modifiedLineNum: j
        });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        lines.unshift({
          type: 'removed',
          text: origLines[i - 1],
          originalLineNum: i
        });
        i--;
      }
    }

    const additions = lines.filter((l) => l.type === 'added').length;
    const deletions = lines.filter((l) => l.type === 'removed').length;
    const unchanged = lines.filter((l) => l.type === 'unchanged').length;

    return { lines, additions, deletions, unchanged };
  }, [originalText, modifiedText]);

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
    showToast('Swapped original and modified texts');
  };

  const handleClear = () => {
    setOriginalText('');
    setModifiedText('');
  };

  const handleCopyDiff = () => {
    const summary = diffResult.lines
      .map((l) => {
        const prefix = l.type === 'added' ? '+ ' : l.type === 'removed' ? '- ' : '  ';
        return prefix + l.text;
      })
      .join('\n');
    navigator.clipboard.writeText(summary);
    showToast('Unified diff copied');
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Diff Checker</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">LCS Text & Code Comparison</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Additions / Deletions Badges */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono shadow-2xs">
            <span className="text-emerald-600 dark:text-emerald-400">+{diffResult.additions}</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-rose-600 dark:text-rose-400">-{diffResult.deletions}</span>
          </div>

          <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                viewMode === 'split' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                viewMode === 'unified' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Unified</span>
            </button>
          </div>

          <button
            onClick={handleSwap}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Swap inputs"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyDiff}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Copy diff"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inputs Two-Panel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-48 shrink-0">
        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-2.5 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
            <span>Original (Before)</span>
            <button
              onClick={() => setOriginalText(SAMPLE_ORIGINAL)}
              className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sample
            </button>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-3 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-2.5 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
            <span>Modified (After)</span>
            <button
              onClick={() => setModifiedText(SAMPLE_MODIFIED)}
              className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sample
            </button>
          </div>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-3 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Difference Output Viewer */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
        <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-transparent">
          <span>Comparison Output ({viewMode === 'split' ? 'Side by Side' : 'Unified'})</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {diffResult.lines.length} lines analyzed
          </span>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-[#111215] p-3 font-mono text-xs space-y-0.5">
          {diffResult.lines.map((line, idx) => {
            const isAdd = line.type === 'added';
            const isRem = line.type === 'removed';

            return (
              <div
                key={idx}
                className={`flex items-start px-2 py-0.5 rounded leading-relaxed ${
                  isAdd
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-l-2 border-emerald-500'
                    : isRem
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-l-2 border-rose-500'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1e25]'
                }`}
              >
                <span className="w-6 shrink-0 text-slate-400 text-right pr-2 select-none text-[11px]">
                  {line.originalLineNum || ''}
                </span>
                <span className="w-6 shrink-0 text-slate-400 text-right pr-2 select-none text-[11px]">
                  {line.modifiedLineNum || ''}
                </span>
                <span className="w-4 shrink-0 font-bold select-none text-center">
                  {isAdd ? '+' : isRem ? '-' : ' '}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all">{line.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
