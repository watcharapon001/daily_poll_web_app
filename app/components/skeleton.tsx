"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-slate-700/50 rounded-lg ${className}`} 
    />
  );
}

export function PollSkeleton() {
  return (
    <div className="w-full bg-slate-800/80 border border-slate-700/50 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-24 h-4" />
      </div>

      <Skeleton className="w-3/4 h-10 mb-8" />

      <div className="space-y-3">
        <Skeleton className="w-full h-14 rounded-xl" />
        <Skeleton className="w-full h-14 rounded-xl" />
        <Skeleton className="w-full h-14 rounded-xl" />
      </div>
    </div>
  );
}
