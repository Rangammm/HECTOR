const COLORS = {
  food: 'bg-sunset-500/10 text-sunset-600',
  sight: 'bg-ocean-500/10 text-ocean-600',
  adventure: 'bg-forest-500/10 text-forest-600',
  transport: 'bg-ink-400/10 text-ink-700',
  stay: 'bg-sand-200 text-ink-700',
  default: 'bg-sand-100 text-ink-400',
};

export default function Badge({ type = 'default', children }) {
  const cls = COLORS[type] || COLORS.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}
