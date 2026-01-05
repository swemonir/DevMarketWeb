import React from 'react';
interface LoadingSkeletonProps {
  className?: string;
}
export function LoadingSkeleton({
  className = ''
}: LoadingSkeletonProps) {
  return <div className={`animate-pulse bg-gray-800/50 rounded ${className}`} />;
}
export function CardSkeleton() {
  return <div className="bg-[#151b2d] rounded-xl border border-gray-800 overflow-hidden shadow-lg h-full">
      <div className="aspect-video w-full bg-gray-800/50 animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="h-6 bg-gray-800/50 rounded w-3/4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-800/50 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-800/50 rounded w-5/6 animate-pulse" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-gray-800/50 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-gray-800/50 rounded-full animate-pulse" />
        </div>
      </div>
    </div>;
}