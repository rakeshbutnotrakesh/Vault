import React from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDevVault();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-3.5 py-2.5 rounded-xl border shadow-xl text-xs font-medium transition-all duration-200 ${
              isSuccess
                ? 'bg-white dark:bg-[#181a20] border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                : isError
                ? 'bg-white dark:bg-[#181a20] border-rose-500/40 text-rose-700 dark:text-rose-300'
                : 'bg-white dark:bg-[#181a20] border-indigo-500/40 text-indigo-700 dark:text-indigo-200'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
            {!isSuccess && !isError && <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
