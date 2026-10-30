import React, { useState } from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import {
  Binary,
  Copy,
  Trash2,
  Upload,
  FileCode,
  AlertCircle
} from 'lucide-react';

export const Base64Converter: React.FC = () => {
  const { showToast } = useDevVault();
  const [plainText, setPlainText] = useState<string>('Hello Vault! ⚡ UTF-8 String & Code');
  const [base64Text, setBase64Text] = useState<string>('');
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileDetails, setFileDetails] = useState<{ name: string; size: number; type: string } | null>(null);
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Robust UTF-8 Text to Base64 using TextEncoder
  const encodeUtf8ToBase64 = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
    return btoa(binString);
  };

  // Robust UTF-8 Base64 to Text using TextDecoder
  const decodeBase64ToUtf8 = (b64: string): string => {
    const clean = b64.replace(/\s/g, '');
    const binString = atob(clean);
    const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  const handleEncode = () => {
    try {
      if (!plainText) {
        setBase64Text('');
        setErrorMsg(null);
        return;
      }
      const encoded = encodeUtf8ToBase64(plainText);
      setBase64Text(encoded);
      setErrorMsg(null);
      showToast('Encoded to Base64');
    } catch (err: any) {
      setErrorMsg(`Encoding error: ${err.message}`);
      showToast('Encoding failed', 'error');
    }
  };

  const handleDecode = () => {
    try {
      if (!base64Text) {
        setPlainText('');
        setErrorMsg(null);
        return;
      }
      const decoded = decodeBase64ToUtf8(base64Text);
      setPlainText(decoded);
      setErrorMsg(null);
      showToast('Decoded to UTF-8 text');
    } catch (err: any) {
      setErrorMsg('Invalid Base64 sequence: The string contains non-Base64 characters or invalid padding.');
      showToast('Decoding failed: Invalid Base64', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileDetails({
      name: file.name,
      size: file.size,
      type: file.type || 'unknown'
    });

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
      showToast(`Processed ${file.name}`);
    };
    reader.onerror = () => {
      showToast('Failed to read file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (val: string, label = 'Copied') => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    showToast(label);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Binary className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Base64 Studio</h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">UTF-8 & File DataURI Engine</span>
        </div>

        <div className="flex items-center bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs shadow-2xs">
          <button
            onClick={() => setMode('text')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              mode === 'text' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Text Encoder / Decoder
          </button>
          <button
            onClick={() => setMode('file')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              mode === 'file' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            File &rarr; DataURI
          </button>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 shrink-0">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {mode === 'text' ? (
        /* Text Converter Mode */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
          {/* Plain Text Panel */}
          <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
            <div className="p-3 border-b border-slate-100 dark:border-[#252830] flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0 bg-slate-50/50 dark:bg-transparent">
              <span>Plain UTF-8 Text</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleEncode}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
                >
                  <span>Encode &rarr;</span>
                </button>
                <button
                  onClick={() => handleCopy(plainText)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  title="Copy text"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPlainText('')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  title="Clear"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="Enter plain text, emojis, or code..."
              className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Base64 Output / Input Panel */}
          <div className="flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden min-h-0 shadow-2xs">
            <div className="p-3 border-b border-slate-100 dark:border-[#252830] flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0 bg-slate-50/50 dark:bg-transparent">
              <span>Base64 String</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDecode}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
                >
                  <span>&larr; Decode</span>
                </button>
                <button
                  onClick={() => handleCopy(base64Text)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  title="Copy Base64"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setBase64Text('')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  title="Clear"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              value={base64Text}
              onChange={(e) => setBase64Text(e.target.value)}
              placeholder="Paste Base64 encoded string here to decode..."
              className="flex-1 w-full bg-slate-50/60 dark:bg-[#121316] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden leading-relaxed break-all"
              spellCheck={false}
            />
          </div>
        </div>
      ) : (
        /* File to Base64 Mode */
        <div className="flex-1 flex flex-col bg-white dark:bg-[#181a20] border border-slate-200/90 dark:border-[#272a33] rounded-2xl overflow-hidden p-6 gap-6 shadow-2xs">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 bg-slate-50/50 dark:bg-[#121316] transition-colors">
            <Upload className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                Upload any file to convert to Base64 Data URL
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Images, SVG icons, fonts, JSON or audio payloads
              </p>
            </div>
            <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer transition-colors shadow-xs">
              Choose Local File
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {fileDetails && fileBase64 && (
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-[#121316] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{fileDetails.name}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">
                    ({(fileDetails.size / 1024).toFixed(1)} KB · {fileDetails.type})
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(fileBase64, 'Data URI copied')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Data URI</span>
                </button>
              </div>

              {/* Preview if image */}
              {fileDetails.type.startsWith('image/') && (
                <div className="p-4 bg-slate-50 dark:bg-[#121316] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center max-h-48 overflow-hidden">
                  <img
                    src={fileBase64}
                    alt="Preview"
                    className="max-h-40 max-w-full rounded object-contain"
                  />
                </div>
              )}

              <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-[#121316] rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mb-1.5">
                  Base64 Data URI Payload ({fileBase64.length} chars):
                </span>
                <textarea
                  readOnly
                  value={fileBase64}
                  className="flex-1 w-full bg-transparent font-mono text-xs text-slate-800 dark:text-slate-300 resize-none focus:outline-hidden break-all"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
