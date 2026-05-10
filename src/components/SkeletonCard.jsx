export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-sand-100 overflow-hidden">
      <div className="h-44 skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded-lg skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
        <div className="h-3 w-full rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
}
