import { MapPin } from 'lucide-react';

export default function EmptyState({ title, message, actionLabel, onAction, icon: Icon = MapPin }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in-up">
      <div className="w-20 h-20 rounded-2xl bg-sand-100 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-ink-200" />
      </div>
      <h3 className="font-[family-name:var(--font-family-heading)] font-semibold text-ink-900 text-xl mb-2">{title}</h3>
      <p className="text-ink-400 text-sm max-w-xs mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-sunset-500 text-white font-medium rounded-xl text-sm hover:bg-sunset-600 transition-colors duration-200 ease-out"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
