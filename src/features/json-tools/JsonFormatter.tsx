import React, { useState, useMemo } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  Braces,
  Copy,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sparkles,
  Minimize2
} from 'lucide-react';

const SAMPLE_JSON = `{
  "platform": "Vault",
  "version": 1.2,
  "offlineReady": true,
  "security": {
    "zeroExternalAPIs": true,
    "localStorageEncrypted": false,
    "sandboxIframe": true
  },
  "supportedLanguages": [
    "typescript",
    "python",
    "sql",
    "rust",
    "go"
  ],
  "metrics": {
    "toolsAvailable": 15,
    "activeUsers": 1,
    "latencyMs": 0
  }
}`;

export const JsonFormatter: React.FC = () => {
  const { showToast } = useDevVault();

  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [outputJson, setOutputJson] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number | 'tab'>(2);
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    line?: number;
    column?: number;
  } | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'raw' | 'tree'>('raw');

  // Parse error finder helper
  const parseJsonWithErrorPosition = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      return { success: true, data: parsed, error: null };
    } catch (err: any) {
      const msg = err.message || 'Syntax error';
      let line: number | undefined = undefined;
      let column: number | undefined = undefined;

      const posMatch = msg.match(/at position (\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const upToError = text.slice(0, pos);
        const lines = upToError.split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }
      return { success: false, data: null, error: { message: msg, line, column } };
    }
  };

  const handleFormat = () => {
    if (!inputJson.trim()) {
      setOutputJson('');
      setErrorDetails(null);
      return;
    }

    const res = parseJsonWithErrorPosition(inputJson);
    if (res.success) {
      const space = indentSize === 'tab' ? '\t' : indentSize;
      const formatted = JSON.stringify(res.data, null, space);
      setOutputJson(formatted);
      setErrorDetails(null);
      setIsValid(true);
      showToast('JSON formatted successfully');
    } else {
      setErrorDetails(res.error);
      setIsValid(false);
      showToast('Invalid JSON syntax', 'error');
    }
  };

  const handleMinify = () => {
    if (!inputJson.trim()) return;
    const res = parseJsonWithErrorPosition(inputJson);
    if (res.success) {
      const minified = JSON.stringify(res.data);
      setOutputJson(minified);
      setErrorDetails(null);
      setIsValid(true);
      showToast('JSON minified');
    } else {
      setErrorDetails(res.error);
      setIsValid(false);
      showToast('Invalid JSON syntax', 'error');
    }
  };

  const handleValidate = () => {
    if (!inputJson.trim()) {
      showToast('Input is empty', 'info');
      return;
    }
    const res = parseJsonWithErrorPosition(inputJson);
    if (res.success) {
      setErrorDetails(null);
      setIsValid(true);
      showToast('JSON is completely valid!');
    } else {
      setErrorDetails(res.error);
      setIsValid(false);
      showToast('Invalid JSON syntax', 'error');
    }
  };

  const handleClear = () => {
    setInputJson('');
    setOutputJson('');
    setErrorDetails(null);
    setIsValid(true);
  };

  const handleCopy = () => {
    const textToCopy = outputJson || inputJson;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    showToast('Copied to clipboard');
  };

  const handleDownload = () => {
    const textToDownload = outputJson || inputJson;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vault-data.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('JSON file downloaded');
  };

  const parsedTreeData = useMemo(() => {
    try {
      const source = outputJson || inputJson;
      return JSON.parse(source);
    } catch {
      return null;
    }
  }, [outputJson, inputJson]);

  // Recursive Tree Node Renderer
  const renderTreeNode = (key: string | null, value: any, depth = 0): React.ReactNode => {
    const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
    const isArray = Array.isArray(value);

    if (isArray) {
      return (
        <div key={key || 'root'} style={{ marginLeft: depth * 16 }} className="py-0.5 text-xs">
          {key && <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{key}: </span>}
          <span className="text-slate-400 font-mono">[{value.length} items]</span>
          <div className="border-l border-slate-200 dark:border-slate-800 pl-2 mt-1 space-y-0.5">
            {value.map((item: any, idx: number) => renderTreeNode(`[${idx}]`, item, depth + 1))}
          </div>
        </div>
      );
    }

    if (isObject) {
      const keys = Object.keys(value);
      return (
        <div key={key || 'root'} style={{ marginLeft: depth * 16 }} className="py-0.5 text-xs">
          {key && <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{key}: </span>}
          <span className="text-slate-400 font-mono">{'{'}{keys.length} keys{'}'}</span>
          <div className="border-l border-slate-200 dark:border-slate-800 pl-2 mt-1 space-y-0.5">
            {keys.map((k) => renderTreeNode(k, value[k], depth + 1))}
          </div>
        </div>
      );
    }

    let valClass = 'text-emerald-600 dark:text-emerald-400';
    if (typeof value === 'number') valClass = 'text-amber-600 dark:text-amber-400';
    if (typeof value === 'boolean') valClass = 'text-rose-600 dark:text-rose-400';
    if (value === null) valClass = 'text-slate-400 italic';

    return (
      <div key={key || 'root'} style={{ marginLeft: depth * 16 }} className="py-0.5 text-xs font-mono">
        {key && <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{key}: </span>}
        <span className={valClass}>{JSON.stringify(value)}</span>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Braces className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">JSON Formatter & Validator</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Native JSON Engine</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setIndentSize(2)}
              className={`px-2.5 py-1 rounded-lg ${
                indentSize === 2 ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2 Spaces
            </button>
            <button
              onClick={() => setIndentSize(4)}
              className={`px-2.5 py-1 rounded-lg ${
                indentSize === 4 ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              4 Spaces
            </button>
            <button
              onClick={() => setIndentSize('tab')}
              className={`px-2.5 py-1 rounded-lg ${
                indentSize === 'tab' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tab
            </button>
          </div>

          <button
            onClick={handleFormat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Format</span>
          </button>

          <button
            onClick={handleMinify}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </button>

          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Validate</span>
          </button>

          <button
            onClick={handleClear}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Clear fields"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Syntax Error Banner if present */}
      {errorDetails && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300 shrink-0">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">JSON Parse Error: </span>
            <span>{errorDetails.message}</span>
            {errorDetails.line && (
              <span className="font-mono text-rose-600 dark:text-rose-200 ml-2">
                (Line {errorDetails.line}, Column {errorDetails.column})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Two-Panel Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* Panel 1: Input JSON */}
        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0 bg-slate-50/50 dark:bg-transparent">
            <span>Input JSON</span>
            <button
              onClick={() => setInputJson(SAMPLE_JSON)}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Load Sample
            </button>
          </div>

          <textarea
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value);
              if (errorDetails) setErrorDetails(null);
            }}
            placeholder="Paste raw or unformatted JSON here..."
            className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Panel 2: Formatted / Tree Output */}
        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0 bg-slate-50/50 dark:bg-transparent">
            <div className="flex items-center gap-2">
              <span>Formatted Output</span>
              {isValid && outputJson && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Valid
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-[#111215] border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 text-[11px]">
                <button
                  onClick={() => setViewMode('raw')}
                  className={`px-2 py-0.5 rounded-md ${
                    viewMode === 'raw' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Raw
                </button>
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-2 py-0.5 rounded-md ${
                    viewMode === 'tree' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Tree View
                </button>
              </div>

              <button
                onClick={handleCopy}
                disabled={!outputJson && !inputJson}
                className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30"
                title="Copy output"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleDownload}
                disabled={!outputJson && !inputJson}
                className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30"
                title="Download .json file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-800 dark:text-slate-200">
            {viewMode === 'raw' ? (
              <pre className="whitespace-pre overflow-x-auto leading-relaxed">
                <code>{outputJson || inputJson}</code>
              </pre>
            ) : parsedTreeData ? (
              <div className="p-1 font-sans">{renderTreeNode(null, parsedTreeData)}</div>
            ) : (
              <div className="text-slate-400 text-center py-8">
                Format valid JSON to inspect interactive tree nodes.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
