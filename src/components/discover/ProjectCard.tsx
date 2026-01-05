import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Project } from '../../types';
import { CheckCircle, ExternalLink } from 'lucide-react';
interface ProjectCardProps {
  project: Project;
}
export function ProjectCard({
  project
}: ProjectCardProps) {
  return <Link to={`/project/${project.id}`}>
      <Card hoverEffect className="h-full flex flex-col group">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-800">
          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={project.platform === 'Web' ? 'web' : 'mobile'}>
              {project.platform}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              {project.title}
            </h3>
            {project.verified && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />}
          </div>

          <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.slice(0, 3).map(tag => <span key={tag} className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                #{tag}
              </span>)}
          </div>
        </div>
      </Card>
    </Link>;
}