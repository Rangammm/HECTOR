import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-900/30" />
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-0">
            <h2 className="font-[family-name:var(--font-family-heading)] font-semibold text-lg text-ink-900">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-sand-100 transition-colors duration-200">
              <X className="w-5 h-5 text-ink-400" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
