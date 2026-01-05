import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../shared/Input';
interface FilterSidebarProps {
  filters: {
    profession: string;
    categories: string[];
    platform: string;
  };
  onFilterChange: (key: string, value: any) => void;
}
export function FilterSidebar({
  filters,
  onFilterChange
}: FilterSidebarProps) {
  const professions = ['All', 'Developer', 'Designer', 'Student', 'Marketer', 'Freelancer'];
  const categories = ['AI Tools', 'Productivity', 'Social', 'Entertainment', 'Education'];
  const platforms = ['All', 'Web', 'Mobile'];
  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category) ? filters.categories.filter(c => c !== category) : [...filters.categories, category];
    onFilterChange('categories', newCategories);
  };
  return <div className="bg-[#151b2d] rounded-xl border border-gray-800 p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-blue-500" />
        <h2 className="font-bold text-white">Filters</h2>
      </div>

      <div className="space-y-8">
        {/* Profession */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Profession
          </h3>
          <div className="space-y-2">
            {professions.map(prof => <label key={prof} className="flex items-center gap-3 cursor-pointer group">
                <div className={`
                  w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                  ${filters.profession === prof ? 'border-blue-500 bg-blue-500' : 'border-gray-600 group-hover:border-gray-400'}
                `}>
                  {filters.profession === prof && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <input type="radio" name="profession" className="hidden" checked={filters.profession === prof} onChange={() => onFilterChange('profession', prof)} />
                <span className={`text-sm transition-colors ${filters.profession === prof ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  {prof}
                </span>
              </label>)}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map(cat => <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <div className={`
                  w-4 h-4 rounded border flex items-center justify-center transition-colors
                  ${filters.categories.includes(cat) ? 'border-blue-500 bg-blue-500' : 'border-gray-600 group-hover:border-gray-400'}
                `}>
                  {filters.categories.includes(cat) && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <input type="checkbox" className="hidden" checked={filters.categories.includes(cat)} onChange={() => toggleCategory(cat)} />
                <span className={`text-sm transition-colors ${filters.categories.includes(cat) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  {cat}
                </span>
              </label>)}
          </div>
        </div>

        {/* Platform */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Platform
          </h3>
          <div className="flex bg-[#0a0e1a] p-1 rounded-lg border border-gray-800">
            {platforms.map(plat => <button key={plat} onClick={() => onFilterChange('platform', plat)} className={`
                  flex-1 py-1.5 text-xs font-medium rounded-md transition-all
                  ${filters.platform === plat ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}
                `}>
                {plat}
              </button>)}
          </div>
        </div>
      </div>
    </div>;
}