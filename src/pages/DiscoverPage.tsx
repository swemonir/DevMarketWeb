import React, { useEffect, useState } from 'react';
import { FilterSidebar } from '../components/discover/FilterSidebar';
import { ProjectCard } from '../components/discover/ProjectCard';
import { CardSkeleton } from '../components/shared/LoadingSkeleton';
import { Project } from '../types';
import { motion } from 'framer-motion';
// Mock Data
const MOCK_PROJECTS: Project[] = Array.from({
  length: 9
}).map((_, i) => ({
  id: `p${i}`,
  title: `Project Nexus ${i + 1}`,
  description: 'A powerful dashboard for managing developer workflows and assets with ease.',
  thumbnail: `https://picsum.photos/seed/${i + 10}/800/450`,
  category: i % 2 === 0 ? 'AI Tools' : 'Productivity',
  profession: 'Developer',
  platform: i % 3 === 0 ? 'Mobile' : 'Web',
  tags: ['React', 'TypeScript', 'Tailwind'],
  status: 'Approved',
  verified: i % 2 === 0,
  authorId: 'u1',
  authorName: 'Alex Dev',
  createdAt: new Date().toISOString()
}));
export function DiscoverPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({
    profession: 'All',
    categories: [] as string[],
    platform: 'All'
  });
  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setProjects(MOCK_PROJECTS);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [filters]);
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
            <h1 className="text-2xl font-bold text-white mb-2">
              Discover Projects
            </h1>
            <p className="text-gray-400">
              Explore the best tools and apps from our community.
            </p>
          </div>

          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => <motion.div key={project.id} initial={{
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