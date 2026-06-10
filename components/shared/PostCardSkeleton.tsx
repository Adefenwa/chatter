export default function PostCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
        <div className="flex items-center gap-2 mt-4">
          <div className="w-6 h-6 rounded-full bg-white/10" />
          <div className="h-3 bg-white/10 rounded w-24" />
        </div>
      </div>
    </div>
  );
}
