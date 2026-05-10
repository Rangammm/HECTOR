export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-sand-100 rounded-lg animate-pulse ${className}`} />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-sand-100 p-5 space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-sand-100 rounded" style={{ width: `${80 - i * 15}%` }} />
      ))}
    </div>
  )
}
