import React, { useState, useMemo } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  Pipette,
  Copy,
  Trash2,
  Check,
  Star
} from 'lucide-react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = (h % 360) / 360;
  s = s / 100;
  l = l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return { r, g, b };
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export const ColorStudio: React.FC = () => {
  const { palettes, addPalette, deletePalette, showToast } = useDevVault();
  const [currentHex, setCurrentHex] = useState<string>('#6366f1');
  const [newPaletteName, setNewPaletteName] = useState('');

  const rgb = useMemo(() => hexToRgb(currentHex) || { r: 99, g: 102, b: 241 }, [currentHex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const complementaryHex = useMemo(() => {
    const compH = (hsl.h + 180) % 360;
    const { r, g, b } = hslToRgb(compH, hsl.s, hsl.l);
    return rgbToHex(r, g, b);
  }, [hsl]);

  const analogousColors = useMemo(() => {
    const h1 = (hsl.h + 30) % 360;
    const h2 = (hsl.h + 330) % 360;
    const c1 = hslToRgb(h1, hsl.s, hsl.l);
    const c2 = hslToRgb(h2, hsl.s, hsl.l);
    return [rgbToHex(c1.r, c1.g, c1.b), currentHex, rgbToHex(c2.r, c2.g, c2.b)];
  }, [hsl, currentHex]);

  const triadicColors = useMemo(() => {
    const h1 = (hsl.h + 120) % 360;
    const h2 = (hsl.h + 240) % 360;
    const c1 = hslToRgb(h1, hsl.s, hsl.l);
    const c2 = hslToRgb(h2, hsl.s, hsl.l);
    return [currentHex, rgbToHex(c1.r, c1.g, c1.b), rgbToHex(c2.r, c2.g, c2.b)];
  }, [hsl, currentHex]);

  const lightnessScale = useMemo(() => {
    const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    return steps.map((l) => {
      const c = hslToRgb(hsl.h, hsl.s, l);
      return { lightness: l, hex: rgbToHex(c.r, c.g, c.b) };
    });
  }, [hsl]);

  const contrastWithWhite = useMemo(() => {
    return getContrastRatio(rgb, { r: 255, g: 255, b: 255 });
  }, [rgb]);

  const contrastWithBlack = useMemo(() => {
    return getContrastRatio(rgb, { r: 0, g: 0, b: 0 });
  }, [rgb]);

  const handleCopy = (str: string, label = 'Copied') => {
    navigator.clipboard.writeText(str);
    showToast(`${label}: ${str}`);
  };

  const handleSavePalette = () => {
    const name = newPaletteName.trim() || `Palette #${palettes.length + 1}`;
    const colors = [currentHex, complementaryHex, ...triadicColors.slice(1)];
    addPalette(name, colors);
    setNewPaletteName('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Pipette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Color Studio</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Palette & Contrast Engine</span>
        </div>
      </div>

      {/* Main Color Picker & Values Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Color Preview & Picker (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-5 space-y-4 shadow-2xs">
          <div
            className="w-full h-40 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-inner flex items-end p-4 transition-colors"
            style={{ backgroundColor: currentHex }}
          >
            <span
              className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/50 text-white backdrop-blur-xs"
            >
              {currentHex.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={currentHex}
              onChange={(e) => setCurrentHex(e.target.value)}
              className="w-12 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
            />
            <input
              type="text"
              value={currentHex}
              onChange={(e) => setCurrentHex(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 uppercase focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Formats Copy Grid */}
          <div className="space-y-2 text-xs">
            <div
              onClick={() => handleCopy(currentHex, 'HEX')}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors"
            >
              <span className="text-slate-500 dark:text-slate-400 font-medium">HEX</span>
              <div className="flex items-center gap-2 font-mono text-slate-800 dark:text-slate-200 font-semibold">
                <span>{currentHex.toUpperCase()}</span>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div
              onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors"
            >
              <span className="text-slate-500 dark:text-slate-400 font-medium">RGB</span>
              <div className="flex items-center gap-2 font-mono text-slate-800 dark:text-slate-200 font-semibold">
                <span>rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div
              onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors"
            >
              <span className="text-slate-500 dark:text-slate-400 font-medium">HSL</span>
              <div className="flex items-center gap-2 font-mono text-slate-800 dark:text-slate-200 font-semibold">
                <span>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Contrast Checker & Harmonies (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* WCAG Accessibility Contrast Checker */}
          <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-5 space-y-3 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200">
              WCAG Accessibility Contrast Analyzer
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* On White */}
              <div className="p-4 rounded-xl bg-white text-slate-900 flex flex-col justify-between h-24 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: currentHex }}>
                    Aa Text on White
                  </span>
                  <span className="font-mono text-xs font-bold tabular-nums">
                    {contrastWithWhite.toFixed(2)}:1
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold ${
                      contrastWithWhite >= 4.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    AA: {contrastWithWhite >= 4.5 ? 'PASS' : 'FAIL'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-semibold ${
                      contrastWithWhite >= 7.0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    AAA: {contrastWithWhite >= 7.0 ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* On Black */}
              <div className="p-4 rounded-xl bg-[#090a0d] text-white flex flex-col justify-between h-24 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: currentHex }}>
                    Aa Text on Black
                  </span>
                  <span className="font-mono text-xs font-bold tabular-nums">
                    {contrastWithBlack.toFixed(2)}:1
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold ${
                      contrastWithBlack >= 4.5 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                    }`}
                  >
                    AA: {contrastWithBlack >= 4.5 ? 'PASS' : 'FAIL'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-semibold ${
                      contrastWithBlack >= 7.0 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                    }`}
                  >
                    AAA: {contrastWithBlack >= 7.0 ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Harmonies */}
          <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200">Harmonic Palettes</h3>

            {/* Complementary */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Complementary</span>
              <div className="flex h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  onClick={() => handleCopy(currentHex)}
                  style={{ backgroundColor: currentHex }}
                  className="flex-1 flex items-center justify-center text-[10px] font-mono font-bold text-white drop-shadow cursor-pointer"
                >
                  {currentHex}
                </div>
                <div
                  onClick={() => handleCopy(complementaryHex)}
                  style={{ backgroundColor: complementaryHex }}
                  className="flex-1 flex items-center justify-center text-[10px] font-mono font-bold text-white drop-shadow cursor-pointer"
                >
                  {complementaryHex}
                </div>
              </div>
            </div>

            {/* Triadic */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Triadic</span>
              <div className="flex h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                {triadicColors.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(c)}
                    style={{ backgroundColor: c }}
                    className="flex-1 flex items-center justify-center text-[10px] font-mono font-bold text-white drop-shadow cursor-pointer"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Analogous */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Analogous</span>
              <div className="flex h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                {analogousColors.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopy(c)}
                    style={{ backgroundColor: c }}
                    className="flex-1 flex items-center justify-center text-[10px] font-mono font-bold text-white drop-shadow cursor-pointer"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightness Scale & Saved Palettes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tints & Shades Scale */}
        <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-5 space-y-3 shadow-2xs">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200">Lightness Scale (10% - 90%)</h3>
          <div className="grid grid-cols-9 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {lightnessScale.map((step) => (
              <div
                key={step.lightness}
                onClick={() => handleCopy(step.hex)}
                style={{ backgroundColor: step.hex }}
                className="flex items-center justify-center cursor-pointer group relative"
                title={`${step.lightness}%: ${step.hex}`}
              >
                <span className="opacity-0 group-hover:opacity-100 text-[9px] font-mono font-bold text-white drop-shadow">
                  {step.lightness}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Palettes */}
        <div className="bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200">Saved Palettes</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newPaletteName}
                onChange={(e) => setNewPaletteName(e.target.value)}
                placeholder="Palette name..."
                className="bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-slate-200 focus:outline-hidden"
              />
              <button
                onClick={handleSavePalette}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-xs"
              >
                Save
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {palettes.map((pal) => (
              <div
                key={pal.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 block truncate mb-1">
                    {pal.name}
                  </span>
                  <div className="flex h-5 rounded-md overflow-hidden max-w-xs">
                    {pal.colors.map((c, idx) => (
                      <div
                        key={idx}
                        style={{ backgroundColor: c }}
                        className="flex-1 cursor-pointer"
                        title={c}
                        onClick={() => handleCopy(c)}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => deletePalette(pal.id)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                  title="Delete palette"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
