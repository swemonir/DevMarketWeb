import { Link } from 'react-router-dom';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Project } from '../../types';
import { API_BASE_URL } from '../../services/api';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({
  project
}: ProjectCardProps) {
  const thumbnail = project.media?.thumbnail
    ? (project.media.thumbnail.startsWith('/uploads') ? `${API_BASE_URL}${project.media.thumbnail}` : project.media.thumbnail)
    : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';

  return <Link to={`/project/${project._id}`}>
    <Card hoverEffect className="h-full flex flex-col group">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-800">
        <img src={thumbnail} alt={project.basicInfo?.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="default" className="bg-blue-600 text-white border-none shadow-lg">
            ${project.marketplace?.price}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {project.basicInfo?.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-400">by {project.owner?.name}</span>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
          {project.basicInfo?.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800/50">
          <span className="text-xs text-gray-500 capitalize">{project.basicInfo?.category}</span>
          <span className="text-xs font-medium text-blue-400">{project.marketplace?.deliveryTime || 0}d delivery</span>
        </div>
      </div>
    </Card>
  </Link>;
}