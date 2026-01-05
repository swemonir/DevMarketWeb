import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'draft' | 'pending' | 'approved' | 'verified' | 'default' | 'web' | 'mobile';
  className?: string;
}
export function Badge({
  children,
  variant = 'default',
  className = ''
}: BadgeProps) {
  const variants = {
    draft: 'bg-gray-800 text-gray-300 border-gray-700',
    pending: 'bg-yellow-900/30 text-yellow-500 border-yellow-900/50',
    approved: 'bg-green-900/30 text-green-400 border-green-900/50',
    verified: 'bg-blue-900/30 text-blue-400 border-blue-900/50',
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    web: 'bg-indigo-900/30 text-indigo-400 border-indigo-900/50',
    mobile: 'bg-purple-900/30 text-purple-400 border-purple-900/50'
  };
  return <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>;
}