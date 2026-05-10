import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-md shadow-lg max-w-md w-full animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-sm text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
