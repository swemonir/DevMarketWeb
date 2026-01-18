import { forwardRef, InputHTMLAttributes } from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {label}
    </label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        {icon}
      </div>}
      <input ref={ref} className={`
              w-full bg-[#1a1f35] border border-gray-700 rounded-lg 
              text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : 'pl-4'}
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
              py-2.5
              ${className}
            `} {...props} />
    </div>
    {error && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{error}</p>}
  </div>;
});
Input.displayName = 'Input';