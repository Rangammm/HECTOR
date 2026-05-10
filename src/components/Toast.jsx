import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  const isError = type === 'error';
  return (
    <div className={`animate-toast-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
      isError ? 'bg-sunset-500/5 border-sunset-400/20' : 'bg-white border-sand-200'
    }`}>
      {isError
        ? <AlertCircle className="w-5 h-5 text-sunset-500 shrink-0" />
        : <CheckCircle className="w-5 h-5 text-forest-500 shrink-0" />}
      <span className="text-sm text-ink-800 font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-0.5 rounded hover:bg-sand-100 transition-colors">
        <X className="w-3.5 h-3.5 text-ink-400" />
      </button>
    </div>
  );
}
