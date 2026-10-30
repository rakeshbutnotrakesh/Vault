import React, { useState } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  Globe,
  Copy,
  Download,
  RefreshCw,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

const HTML_TEMPLATES = {
  card: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 24px;
      max-width: 360px;
      width: 100%;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .badge {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #818cf8;
      letter-spacing: 0.05em;
    }
    h2 {
      margin: 8px 0;
      font-size: 18px;
    }
    p {
      color: #94a3b8;
      font-size: 13px;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      margin-top: 16px;
      padding: 8px 16px;
      background: #6366f1;
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #4f46e5;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Architecture</span>
    <h2>Resilient Microfrontends</h2>
    <p>Decoupled team autonomous deployment with unified design system tokens.</p>
    <a href="#" class="btn">Read Blueprint &rarr;</a>
  </div>
</body>
</html>`,
  form: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #090d16;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .form-container {
      background: #111827;
      border: 1px solid #1f2937;
      padding: 28px;
      border-radius: 14px;
      width: 320px;
    }
    h3 { margin-top: 0; margin-bottom: 20px; font-size: 16px; }
    .group { margin-bottom: 14px; }
    label { display: block; font-size: 12px; margin-bottom: 6px; color: #9ca3af; }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 12px;
      background: #030712;
      border: 1px solid #374151;
      border-radius: 8px;
      color: #f3f4f6;
      font-size: 13px;
    }
    input:focus { outline: none; border-color: #6366f1; }
    button {
      width: 100%;
      padding: 9px;
      background: #4f46e5;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 10px;
    }
    button:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="form-container">
    <h3>Developer Credentials</h3>
    <div class="group">
      <label>Service Identifier</label>
      <input type="text" value="auth-cluster-west" />
    </div>
    <div class="group">
      <label>Access Token</label>
      <input type="password" value="secret_token_123" />
    </div>
    <button onclick="alert('Configuration verified!')">Connect Endpoint</button>
  </div>
</body>
</html>`
};

export const HtmlPlayground: React.FC = () => {
  const { showToast } = useDevVault();
  const [htmlCode, setHtmlCode] = useState<string>(HTML_TEMPLATES.card);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    showToast('HTML copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vault-playground.html';
    link.click();
    URL.revokeObjectURL(url);
    showToast('HTML file downloaded');
  };

  const getViewportWidth = () => {
    switch (viewportMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#f8f9fa] dark:bg-[#111215] p-4' : 'h-[calc(100vh-7rem)]'}`}>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">HTML Playground</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Sandboxed DOM Preview</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Templates */}
          <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setHtmlCode(HTML_TEMPLATES.card)}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
            >
              Card
            </button>
            <button
              onClick={() => setHtmlCode(HTML_TEMPLATES.form)}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
            >
              Form
            </button>
          </div>

          {/* Viewport switch */}
          <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-slate-600 dark:text-slate-400 shadow-2xs">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-lg ${
                viewportMode === 'desktop' ? 'bg-indigo-600 text-white' : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Desktop width"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded-lg ${
                viewportMode === 'tablet' ? 'bg-indigo-600 text-white' : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tablet width (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-lg ${
                viewportMode === 'mobile' ? 'bg-indigo-600 text-white' : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Mobile width (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            title="Refresh iframe preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            title="Copy HTML"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            title="Download .html file"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor & Preview Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* Editor */}
        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-transparent">
            HTML & Embedded Styles
          </div>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Sandboxed Iframe Preview */}
        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
            <span>Sandboxed Preview</span>
            <span className="text-[10px] text-slate-400 font-mono">
              mode: {viewportMode}
            </span>
          </div>

          <div className="flex-1 bg-slate-100/60 dark:bg-[#0e0f13] p-4 overflow-auto flex items-center justify-center">
            <div className={`h-full border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white shadow-lg transition-all duration-200 ${getViewportWidth()}`}>
              <iframe
                key={refreshKey}
                title="HTML Preview Canvas"
                srcDoc={htmlCode}
                sandbox="allow-scripts"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
