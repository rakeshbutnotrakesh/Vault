import React, { useState, useMemo } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  Regex,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface RegexPreset {
  name: string;
  pattern: string;
  flags: string;
  sample: string;
  description: string;
}

const REGEX_PRESETS: RegexPreset[] = [
  {
    name: 'Email Address',
    pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})',
    flags: 'g',
    sample: 'Contact us at team@vault.internal or reach out to engineer.ops@company.io for support.',
    description: 'Matches standard RFC compliant email addresses with user and domain capture groups.'
  },
  {
    name: 'URL with Protocol',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
    flags: 'g',
    sample: 'Documentation available at https://vault.app/docs or http://localhost:3000/api/health',
    description: 'Captures full http and https URLs.'
  },
  {
    name: 'IPv4 Address',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    sample: 'DNS servers resolved: 192.168.1.1, 10.0.0.254, and Google Public DNS 8.8.8.8.',
    description: 'Matches valid 0-255 dotted decimal IPv4 network addresses.'
  },
  {
    name: 'Hex Color',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: 'g',
    sample: 'Design tokens: primary: #6366f1, dark: #0f172a, white: #fff, muted: #94a3b8.',
    description: 'Validates 3-digit and 6-digit hexadecimal color codes.'
  },
  {
    name: 'Date (YYYY-MM-DD)',
    pattern: '\\b(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b',
    flags: 'g',
    sample: 'Audit release dates: 2026-10-30, sprint deadline: 2026-11-15, next review: 2026-12-01.',
    description: 'Parses ISO 8601 standard dates into Year, Month, and Day groups.'
  },
  {
    name: 'UUID v4',
    pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
    flags: 'gi',
    sample: 'Transaction ID: 7b31ff5e-8551-4e78-bc57-01efebdb8cf2 created by worker node.',
    description: 'Strict format check for RFC 4122 Version 4 UUIDs.'
  }
];

export const RegexTester: React.FC = () => {
  const { showToast } = useDevVault();
  const [pattern, setPattern] = useState<string>('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: false,
    m: false,
    s: false
  });
  const [testString, setTestString] = useState<string>(
    'Reach out to security@vault.local or founder@startup.co for questions.'
  );

  const flagString = useMemo(() => {
    let str = '';
    if (flags.g) str += 'g';
    if (flags.i) str += 'i';
    if (flags.m) str += 'm';
    if (flags.s) str += 's';
    return str;
  }, [flags]);

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flagString);
      const allMatches: Array<{
        index: number;
        length: number;
        match: string;
        groups: string[];
      }> = [];

      if (flags.g) {
        let m: RegExpExecArray | null;
        while ((m = regex.exec(testString)) !== null) {
          allMatches.push({
            index: m.index,
            length: m[0].length,
            match: m[0],
            groups: m.slice(1)
          });
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          if (allMatches.length > 500) break;
        }
      } else {
        const m = regex.exec(testString);
        if (m) {
          allMatches.push({
            index: m.index,
            length: m[0].length,
            match: m[0],
            groups: m.slice(1)
          });
        }
      }

      return { matches: allMatches, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  }, [pattern, flagString, testString, flags.g]);

  const handleApplyPreset = (preset: RegexPreset) => {
    setPattern(preset.pattern);
    setTestString(preset.sample);
    setFlags({
      g: preset.flags.includes('g'),
      i: preset.flags.includes('i'),
      m: preset.flags.includes('m'),
      s: preset.flags.includes('s')
    });
    showToast(`Loaded "${preset.name}" preset`);
  };

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    showToast('Copied to clipboard');
  };

  const renderHighlightedText = () => {
    if (!testString || matches.length === 0) {
      return <span className="text-slate-700 dark:text-slate-300">{testString}</span>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((m, idx) => {
      if (m.index > lastIndex) {
        segments.push(
          <span key={`unmatched-${idx}`} className="text-slate-700 dark:text-slate-300">
            {testString.slice(lastIndex, m.index)}
          </span>
        );
      }
      segments.push(
        <mark
          key={`match-${idx}`}
          className="bg-indigo-100 dark:bg-indigo-500/30 text-indigo-900 dark:text-indigo-200 border-b-2 border-indigo-600 px-0.5 rounded-xs"
          title={`Match #${idx + 1}: "${m.match}"`}
        >
          {m.match}
        </mark>
      );
      lastIndex = m.index + m.length;
    });

    if (lastIndex < testString.length) {
      segments.push(
        <span key="trailing" className="text-slate-700 dark:text-slate-300">
          {testString.slice(lastIndex)}
        </span>
      );
    }

    return segments;
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Regex className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Regex Tester</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">RegExp Parser & Inspector</span>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs overflow-x-auto shadow-2xs">
          {REGEX_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg whitespace-nowrap transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Regex Input & Flags Bar */}
      <div className="p-4 bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl space-y-3 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 text-lg">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Regular expression pattern..."
            className="flex-1 bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-indigo-600 dark:text-indigo-300 focus:outline-hidden focus:border-indigo-500 font-medium"
          />
          <span className="font-mono text-slate-400 text-lg">/</span>

          {/* Flag toggles */}
          <div className="flex items-center bg-slate-100 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs font-mono">
            {(['g', 'i', 'm', 's'] as const).map((flag) => (
              <button
                key={flag}
                onClick={() => setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }))}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  flags[flag] ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={`Flag: ${flag}`}
              >
                {flag}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCopy(`/${pattern}/${flagString}`)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Copy regex"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {error ? (
          <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Regex Syntax Error: {error}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Pattern Compiled Successfully</span>
            </div>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
            </span>
          </div>
        )}
      </div>

      {/* Main Split: Test String Input & Match Results Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Test String Input (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
            <span>Test String</span>
            <button
              onClick={() => setTestString('')}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              title="Clear test string"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 grid grid-rows-2 min-h-0">
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test pattern against..."
              className="w-full h-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed border-b border-slate-100 dark:border-[#252830]"
              spellCheck={false}
            />

            {/* Highlighting Viewport */}
            <div className="w-full h-full bg-slate-50/40 dark:bg-[#101114] p-4 font-mono text-xs overflow-auto whitespace-pre-wrap leading-relaxed select-text">
              <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">
                Live Highlight Preview:
              </div>
              {renderHighlightedText()}
            </div>
          </div>
        </div>

        {/* Match Inspection (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-[#252830] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
            <span>Match Details ({matches.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {matches.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No matches found in test string.
              </div>
            ) : (
              matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Match #{idx + 1}</span>
                    <span className="text-[10px] text-slate-400">
                      pos {m.index}..{m.index + m.length}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white dark:bg-[#1a1c22] border border-slate-200/80 dark:border-[#22252c] text-emerald-600 dark:text-emerald-300 break-all">
                    {m.match}
                  </div>

                  {m.groups.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px]">
                      <span className="text-slate-400 text-[10px] uppercase font-sans">Capture Groups:</span>
                      {m.groups.map((grp, gIdx) => (
                        <div key={gIdx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 pl-2">
                          <span className="text-indigo-600 dark:text-indigo-400">${gIdx + 1}:</span>
                          <span className="text-amber-600 dark:text-amber-300 break-all">{grp || '(empty)'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
