import React, { useState } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  Palette,
  RotateCcw,
  Copy,
  Download,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

interface Preset {
  name: string;
  css: string;
  html: string;
}

const CSS_PRESETS: Record<string, Preset> = {
  flexbox: {
    name: 'Flexbox Layout',
    html: `<div class="container">
  <div class="item">01. Service Mesh</div>
  <div class="item highlight">02. Auth Proxy</div>
  <div class="item">03. Event Queue</div>
</div>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #0f172a;
  color: #f8fafc;
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: #1e293b;
  padding: 24px;
  border-radius: 14px;
  border: 1px solid #334155;
}
.item {
  flex: 1;
  padding: 18px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.2s;
}
.item:hover {
  transform: translateY(-2px);
}
.highlight {
  border-color: #6366f1;
  color: #818cf8;
}`
  },
  grid: {
    name: 'CSS Grid Matrix',
    html: `<div class="grid-layout">
  <div class="card card-wide">Primary Cluster (Wide)</div>
  <div class="card">Redis Cache</div>
  <div class="card">PostgreSQL DB</div>
  <div class="card card-wide">Monitoring & Prometheus</div>
</div>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #090d16;
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
}
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}
.card {
  background: #131b2e;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 20px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}
.card-wide {
  grid-column: span 2;
  border-color: #3b82f6;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}`
  },
  animations: {
    name: 'Keyframe Pulse & Glow',
    html: `<div class="wrapper">
  <div class="pulse-sphere"></div>
  <div class="glow-box">
    <h3>Real-Time Telemetry Node</h3>
    <p>Operational invariants verified with sub-millisecond settling.</p>
  </div>
</div>`,
    css: `body {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #09090b;
  color: #fafafa;
  font-family: system-ui, sans-serif;
}
.wrapper {
  text-align: center;
}
.pulse-sphere {
  width: 48px;
  height: 48px;
  background: #6366f1;
  border-radius: 50%;
  margin: 0 auto 24px;
  box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  animation: pulse-ring 1.8s infinite cubic-bezier(0.66, 0, 0, 1);
}
@keyframes pulse-ring {
  to {
    box-shadow: 0 0 0 32px rgba(99, 102, 241, 0);
  }
}
.glow-box {
  background: #18181b;
  border: 1px solid #27272a;
  padding: 20px 28px;
  border-radius: 14px;
  max-width: 320px;
}
h3 { margin: 0 0 8px; font-size: 16px; color: #a5b4fc; }
p { margin: 0; font-size: 13px; color: #a1a1aa; line-height: 1.4; }`
  },
  gradients: {
    name: 'Animated Gradient Card',
    html: `<div class="gradient-border">
  <div class="inner-content">
    <h2>Quantum Core Engine</h2>
    <p>Dynamic boundary layers with GPU accelerated background shifts.</p>
  </div>
</div>`,
    css: `body {
  margin: 0;
  background: #030712;
  color: #f9fafb;
  font-family: system-ui, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.gradient-border {
  padding: 2px;
  border-radius: 16px;
  background: linear-gradient(60deg, #6366f1, #ec4899, #06b6d4, #10b981);
  background-size: 300% 300%;
  animation: gradientShift 6s ease infinite;
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.inner-content {
  background: #0f172a;
  padding: 30px;
  border-radius: 14px;
  max-width: 320px;
}
h2 { margin: 0 0 8px; font-size: 18px; }
p { margin: 0; font-size: 13px; color: #94a3b8; }`
  },
  buttons: {
    name: 'Interactive Glass Buttons',
    html: `<div class="button-strip">
  <button class="btn btn-primary">Primary Action</button>
  <button class="btn btn-glass">Glassmorphism</button>
  <button class="btn btn-outline">Outlined</button>
</div>`,
    css: `body {
  margin: 0;
  background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #030712 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
}
.button-strip {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}
.btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
}
.btn-primary {
  background: #6366f1;
  color: #fff;
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.4);
}
.btn-primary:hover {
  transform: translateY(-2px);
  background: #4f46e5;
}
.btn-glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  color: #e0e7ff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.btn-glass:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-2px);
}
.btn-outline {
  background: transparent;
  color: #a5b4fc;
  border: 1px solid #4338ca;
}
.btn-outline:hover {
  border-color: #818cf8;
  color: #fff;
}`
  }
};

export const CssPlayground: React.FC = () => {
  const { showToast } = useDevVault();
  const [activePreset, setActivePreset] = useState<string>('flexbox');
  const [cssCode, setCssCode] = useState<string>(CSS_PRESETS.flexbox.css);
  const [htmlCode, setHtmlCode] = useState<string>(CSS_PRESETS.flexbox.html);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'css' | 'html'>('css');

  const handleSelectPreset = (key: string) => {
    setActivePreset(key);
    setCssCode(CSS_PRESETS[key].css);
    setHtmlCode(CSS_PRESETS[key].html);
    showToast(`Loaded "${CSS_PRESETS[key].name}" preset`);
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(cssCode);
    showToast('CSS copied to clipboard');
  };

  const handleDownloadCss = () => {
    const blob = new Blob([cssCode], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'styles.css';
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSS file downloaded');
  };

  const combinedDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
</body>
</html>`;

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
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">CSS Playground</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Interactive Style Lab</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs overflow-x-auto shadow-2xs">
            {Object.entries(CSS_PRESETS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  activePreset === key ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
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
              title="Tablet width"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-lg ${
                viewportMode === 'mobile' ? 'bg-indigo-600 text-white' : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Mobile width"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopyCss}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Copy CSS"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownloadCss}
            className="p-1.5 rounded-xl bg-white dark:bg-[#181a20] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Download .css"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* Editor (CSS / HTML tabs) */}
        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] flex items-center justify-between text-xs bg-slate-50/50 dark:bg-transparent">
            <div className="flex items-center bg-slate-100 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab('css')}
                className={`px-3 py-1 rounded font-medium ${
                  activeTab === 'css' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                styles.css
              </button>
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1 rounded font-medium ${
                  activeTab === 'html' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                sample.html
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Real-time update</span>
          </div>

          {activeTab === 'css' ? (
            <textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed"
              spellCheck={false}
            />
          ) : (
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed"
              spellCheck={false}
            />
          )}
        </div>

        {/* Live CSS Preview */}
        <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
            <span>Live Style Preview</span>
            <span className="text-[10px] text-slate-400 font-mono">
              viewport: {viewportMode}
            </span>
          </div>

          <div className="flex-1 bg-slate-100/60 dark:bg-[#0e0f13] p-4 overflow-auto flex items-center justify-center">
            <div className={`h-full border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-900 shadow-xl transition-all duration-200 ${getViewportWidth()}`}>
              <iframe
                title="CSS Preview Canvas"
                srcDoc={combinedDoc}
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
