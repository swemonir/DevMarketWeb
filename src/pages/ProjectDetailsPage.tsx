import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { Project } from '../types';
import { Globe, Share2, Flag, ShoppingCart, Calendar, Clock } from 'lucide-react';
import { marketplaceService, API_BASE_URL } from '../services/api';
import { ProjectCard } from '../components/discover/ProjectCard';

export function ProjectDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        setLoading(true);
        const response = await marketplaceService.getProjectById(id);
        if (response && response.data) {
          setProject(response.data);
        } else {
          setProject(response);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <LoadingSkeleton className="w-full aspect-video rounded-xl" />
      <div className="space-y-4">
        <LoadingSkeleton className="h-10 w-1/2" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
      </div>
    </div>;
  }

  if (error || !project) {
    return <div className="max-w-7xl mx-auto px-4 py-32 text-center text-gray-400">
      <p className="text-xl mb-4">{error || 'Project not found'}</p>
      <Button variant="secondary" onClick={() => window.history.back()}>Go Back</Button>
    </div>;
  }

  const thumbnail = project.media?.thumbnail
    ? (project.media.thumbnail.startsWith('/uploads') ? `${API_BASE_URL}${project.media.thumbnail}` : project.media.thumbnail)
    : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200';

  console.log(project);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header Image */}
    <div className="rounded-2xl overflow-hidden mb-8 border border-gray-800 shadow-2xl bg-gray-900 aspect-video max-h-[500px]">
      <img src={thumbnail} alt={project.basicInfo?.title || 'Project'} className="w-full h-full object-cover" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="default" className="bg-blue-600/20 text-blue-400 border-blue-500/30">
              {project.basicInfo?.category}
            </Badge>
            <Badge variant="verified">
              {project.metadata?.status?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-white mb-6">
            {project.basicInfo?.title || 'Untitled Project'}
          </h1>

          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            {project.basicInfo?.description || 'No description available'}
          </div>

          {project.basicInfo?.tags && project.basicInfo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {project.basicInfo.tags.map(tag => (
                <span key={tag} className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Project Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-800">
          <div>
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Submitted
            </p>
            <p className="text-white font-medium">
              {project.metadata?.submissionDate ? new Date(project.metadata.submissionDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Delivery Time
            </p>
            <p className="text-white font-medium">
              {project.marketplace?.deliveryTime || 0} Days
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Platform
            </p>
            <p className="text-white font-medium capitalize">
              {project.platform?.type || 'Web'}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-[#151b2d] rounded-xl border border-gray-800 p-6 sticky top-24">
          <div className="mb-6">
            {project && (
              <>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Project Preview
                </h3>
                <div className="mb-8 scale-95 origin-top border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                  <ProjectCard project={project} />
                </div>
              </>
            )}

            <div className="flex items-baseline justify-between mb-6">
              <span className="text-gray-400">Price</span>
              <span className="text-3xl font-bold text-white">${project.marketplace?.price || 0}</span>
            </div>

            <div className="space-y-3">
              <Button fullWidth className="gap-2 text-lg py-6" size="lg">
                <ShoppingCart className="w-5 h-5" />
                Request to Buy
              </Button>
              <Button variant="secondary" fullWidth className="gap-2">
                <Share2 className="w-4 h-4" />
                Share Project
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Seller Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {project.owner?.avatar ? (
                  <img src={project.owner.avatar} alt={project.owner.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  project.owner?.name?.[0] || '?'
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">
                  {project.owner?.name || 'Unknown Seller'}
                </p>
                <p className="text-xs text-gray-500 truncate">{project.owner?.email || 'No email provided'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 text-center">
            <button className="text-xs text-gray-500 hover:text-red-400 flex items-center justify-center gap-1 mx-auto transition-colors">
              <Flag className="w-3 h-3" /> Report this project
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>;
}