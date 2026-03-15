import { X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed top-20 right-6 z-[9999] w-full max-w-sm animate-in slide-in-from-right-8 fade-in duration-300 pointer-events-none">
      <div 
        className="bg-slate-900 border border-red-500/40 rounded-2xl p-5 shadow-[0_20px_50px_rgba(239,68,68,0.15)] relative overflow-hidden pointer-events-auto"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Error</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold py-2 rounded-lg border border-red-500/20 transition-all uppercase tracking-wider"
        >
          Dismiss
        </button>
      </div>
    </div>,
    document.body
  );
}
