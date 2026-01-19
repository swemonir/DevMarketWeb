import { useEffect, useState } from 'react';
import { FilterSidebar } from '../components/discover/FilterSidebar';
import { ProjectCard } from '../components/discover/ProjectCard';
import { CardSkeleton } from '../components/shared/LoadingSkeleton';
import { Project, DiscoverResponse } from '../types';
import { motion } from 'framer-motion';
import { discoverService } from '../services/api';
import { Search } from 'lucide-react';
import { Input } from '../components/shared/Input';

export function DiscoverPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    profession: 'All',
    categories: [] as string[],
    platform: 'All'
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response: DiscoverResponse = await discoverService.getDiscoverItems({
        limit: 10,
        page: 1,
        category: filters.categories.length > 0 ? filters.categories[0] : 'All',
        search: searchQuery
      });
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch discovery items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 500); // Debounce search/filter changes
    return () => clearTimeout(timer);
  }, [filters, searchQuery]);
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setLoading(true); // Trigger reload effect
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Discover Projects
              </h1>
              <p className="text-gray-400">
                Explore the best tools and apps from our community.
              </p>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search projects..."
                icon={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => <motion.div key={project._id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: idx * 0.05
          }}>
            <ProjectCard project={project} />
          </motion.div>)}
        </div>}

        {!loading && projects.length === 0 && <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            No projects found matching your filters.
          </p>
        </div>}
      </main>
    </div>
  </div>;
}