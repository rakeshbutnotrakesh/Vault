import React, { useState, useEffect, useRef } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  Terminal,
  Play,
  RotateCcw,
  Trash2,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface ConsoleLog {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  args: string[];
  timestamp: string;
}

const JS_PRESETS = {
  arrayPipeline: `// Data Pipeline: Transformations & Aggregations
const transactions = [
  { id: 'tx-1', amount: 120.50, category: 'Hardware', status: 'settled' },
  { id: 'tx-2', amount: 45.00, category: 'Software', status: 'settled' },
  { id: 'tx-3', amount: 890.00, category: 'Hardware', status: 'pending' },
  { id: 'tx-4', amount: 15.00, category: 'Software', status: 'settled' },
  { id: 'tx-5', amount: 310.20, category: 'Cloud', status: 'settled' }
];

console.log("Input transactions count:", transactions.length);

// 1. Filter settled hardware & cloud purchases
const filtered = transactions.filter(tx => 
  tx.status === 'settled' && (tx.category === 'Hardware' || tx.category === 'Cloud')
);

// 2. Sum amounts
const totalSpent = filtered.reduce((sum, tx) => sum + tx.amount, 0);

console.info("Filtered transactions:", filtered);
console.log("Total Settled Expenditure: $" + totalSpent.toFixed(2));
`,
  asyncQueue: `// Async Task Processing with Simulated Latency
async function simulateWorker(taskName, delayMs) {
  console.log(\`[START] \${taskName} (allocated \${delayMs}ms)\`);
  await new Promise(resolve => setTimeout(resolve, delayMs));
  console.info(\`[DONE] \${taskName} completed successfully!\`);
  return { task: taskName, status: 'ok', duration: delayMs };
}

async function runQueue() {
  console.log("Starting async pipeline...");
  const results = await Promise.all([
    simulateWorker("Validate TLS Certificate", 200),
    simulateWorker("Read Disk Cache", 350),
    simulateWorker("Hydrate State Tree", 150)
  ]);
  console.log("All tasks settled:", results);
}

runQueue();
`,
  memoFib: `// Memoized Recursive Algorithm
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.time("Compute fib(40)");
const val = fibonacci(40);
console.timeEnd("Compute fib(40)");
console.log("Fibonacci(40) =", val);
`
};

export const JsPlayground: React.FC = () => {
  const { showToast } = useDevVault();
  const [code, setCode] = useState<string>(JS_PRESETS.arrayPipeline);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen to postMessage from sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'devvault-js-sandbox') {
        const { type, args } = event.data;
        if (type === 'execution-complete') {
          setIsRunning(false);
          setExecutionTime(event.data.duration);
        } else {
          const newLog: ConsoleLog = {
            id: Math.random().toString(36).substring(2, 9),
            type,
            args: args.map((a: any) =>
              typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
            ),
            timestamp: new Date().toLocaleTimeString()
          };
          setLogs((prev) => [...prev, newLog]);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const runCode = () => {
    setLogs([]);
    setIsRunning(true);
    setExecutionTime(null);

    // Build execution sandbox HTML document
    const sandboxDoc = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script>
(function() {
  const startTime = performance.now();
  function send(type, args) {
    try {
      window.parent.postMessage({
        source: 'devvault-js-sandbox',
        type: type,
        args: args
      }, '*');
    } catch(e) {}
  }

  // Intercept standard console methods
  console.log = function(...args) { send('log', args); };
  console.info = function(...args) { send('info', args); };
  console.warn = function(...args) { send('warn', args); };
  console.error = function(...args) { send('error', args); };

  const timeTracker = {};
  console.time = function(label = 'default') {
    timeTracker[label] = performance.now();
  };
  console.timeEnd = function(label = 'default') {
    if (timeTracker[label] !== undefined) {
      const elapsed = performance.now() - timeTracker[label];
      send('log', [\`\${label}: \${elapsed.toFixed(2)}ms\`]);
      delete timeTracker[label];
    }
  };

  window.onerror = function(msg, url, line) {
    send('error', [\`Runtime Error (line \${line}): \${msg}\`]);
    return true;
  };

  try {
    ${code}
  } catch (err) {
    send('error', [err && err.stack ? err.stack : String(err)]);
  }

  // Allow async tasks a small window before sending complete
  setTimeout(function() {
    const totalTime = performance.now() - startTime;
    send('execution-complete', { duration: totalTime });
  }, 100);
})();
<\/script>
</body>
</html>`;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = sandboxDoc;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    showToast('Code copied');
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'playground.js';
    link.click();
    URL.revokeObjectURL(url);
    showToast('JavaScript file downloaded');
  };

  // Run on Ctrl+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Hidden sandboxed iframe */}
      <iframe
        ref={iframeRef}
        title="JS Execution Sandbox"
        sandbox="allow-scripts"
        className="hidden"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">JavaScript Playground</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Isolated Sandbox</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => {
                setCode(JS_PRESETS.arrayPipeline);
                setLogs([]);
              }}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              Pipeline
            </button>
            <button
              onClick={() => {
                setCode(JS_PRESETS.asyncQueue);
                setLogs([]);
              }}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              Async Queue
            </button>
            <button
              onClick={() => {
                setCode(JS_PRESETS.memoFib);
                setLogs([]);
              }}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              Memoize
            </button>
          </div>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            <kbd className="hidden md:inline text-[10px] font-mono opacity-80 pl-1">
              Ctrl+↵
            </kbd>
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
            title="Download .js"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Disclaimer */}
      <div className="px-4 py-2.5 bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Code runs inside an isolated iframe sandbox without network or DOM storage privileges.
          </span>
        </div>
        {executionTime !== null && (
          <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[11px] shrink-0 font-medium">
            settled in {executionTime.toFixed(1)}ms
          </span>
        )}
      </div>

      {/* Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* JS Editor */}
        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
            <span>JavaScript Source</span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">ES2022</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Console Output Panel */}
        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Console Output ({logs.length})</span>
            </div>
            <button
              onClick={() => setLogs([])}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 text-[11px] transition-colors"
              title="Clear console"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-[#101114] p-4 font-mono text-xs space-y-2">
            {logs.length === 0 ? (
              <div className="text-slate-400 text-center py-12">
                Click &ldquo;Run Code&rdquo; or press Ctrl+Enter to execute script.
              </div>
            ) : (
              logs.map((log) => {
                const isError = log.type === 'error';
                const isWarn = log.type === 'warn';
                const isInfo = log.type === 'info';

                return (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                      isError
                        ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300'
                        : isWarn
                        ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
                        : isInfo
                        ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-[#181a20] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                      <span className="uppercase font-semibold tracking-wider">{log.type}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-wrap">
                      {log.args.join(' ')}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
