import { Project } from '../../types';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../services/api';
interface ProjectListProps {
  projects: Project[];
  status: string;
}
export function ProjectList({
  projects,
  status
}: ProjectListProps) {
  if (projects.length === 0) {
    return <div className="text-center py-12 bg-[#151b2d] rounded-xl border border-gray-800 border-dashed">
      <p className="text-gray-400 mb-4">No projects found in this section.</p>
      <Link to="/submit">
        <Button variant="primary" size="sm">
          Submit New Project
        </Button>
      </Link>
    </div>;
  }
  return <div className="space-y-4">
    {projects.map(project => {
      const thumbnail = project.media?.thumbnail
        ? (project.media.thumbnail.startsWith('/uploads') ? `${API_BASE_URL}${project.media.thumbnail}` : project.media.thumbnail)
        : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400';

      return <div key={project._id} className="bg-[#151b2d] border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-gray-700 transition-colors">
        <img src={thumbnail} alt={project.basicInfo?.title} className="w-full sm:w-32 h-20 object-cover rounded-lg bg-gray-800" />

        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-white">{project.basicInfo?.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-1">
            {project.basicInfo?.description}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
            <Badge variant={project.metadata?.status?.toLowerCase() as any}>
              {project.metadata?.status || 'Unknown'}
            </Badge>
            <Badge variant="default" className="bg-gray-800">
              {project.basicInfo?.category}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'Draft' && <Button variant="secondary" size="sm" className="h-9 w-9 p-0">
            <Edit className="w-4 h-4" />
          </Button>}
          <Link to={`/project/${project._id}`}>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          {status === 'Draft' && <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </Button>}
        </div>
      </div>;
    })}
  </div>;
}