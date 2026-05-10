import { Plus } from 'lucide-react'

export default function EmptyState({ title, message, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="erp-card p-12 flex flex-col items-center justify-center text-center">
      {Icon && (
        <div className="w-12 h-12 mb-4 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center text-slate-400">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      {message && <p className="text-xs text-slate-500 mb-5 max-w-sm">{message}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="erp-button"
        >
          <Plus className="w-4 h-4 shrink-0" /> {actionLabel}
        </button>
      )}
    </div>
  )
}
