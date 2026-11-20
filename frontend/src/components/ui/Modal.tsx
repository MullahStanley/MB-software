import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

/**
 * Shared dialog shell used by every overlay in the app.
 * Closes on Escape or backdrop click, traps nothing (no focus library),
 * and keeps heading structure consistent (h2 title inside role="dialog").
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-3xl',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`my-8 w-full ${maxWidth} overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-icon btn-quiet -mr-1.5 shrink-0"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
