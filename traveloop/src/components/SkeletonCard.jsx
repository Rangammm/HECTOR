export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-slate-200 rounded animate-pulse ${className}`} />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="erp-card overflow-hidden">
      <div className="h-28 bg-slate-100 animate-pulse border-b border-slate-200" />
      <div className="p-4 flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: `${80 - i * 15}%` }} />
        ))}
      </div>
    </div>
  )
}

export default SkeletonCard;
