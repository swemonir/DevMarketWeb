import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: {
    value: string;
    label: string;
  }[];
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  className = '',
  ...props
}, ref) => {
  return <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {label}
    </label>}
    <div className="relative">
      <select ref={ref} className={`
              w-full bg-[#1a1f35] border border-gray-700 rounded-lg 
              text-white appearance-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              pl-4 pr-10 py-2.5
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
              ${className}
            `} {...props}>
        {options.map(opt => <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>)}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
    {error && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{error}</p>}
  </div>;
});
Select.displayName = 'Select';