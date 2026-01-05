import React, { useEffect, useState, Component } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { Project } from '../types';
import { ExternalLink, Github, Globe, Smartphone, Share2, Flag } from 'lucide-react';
export function ProjectDetailsPage() {
  const {
    id
  } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setProject({
        id: id || '1',
        title: 'Project Nexus Dashboard',
        description: 'A comprehensive dashboard solution for modern SaaS applications.',
        fullDescription: `
          <p>Project Nexus is a high-performance dashboard template built with React and Tailwind CSS. It features a modular architecture, responsive design, and a dark-mode-first aesthetic perfect for modern SaaS products.</p>
          <br/>
          <h3>Key Features:</h3>
          <ul>
            <li>• Fully Responsive Layout</li>
            <li>• 50+ Pre-built Components</li>
            <li>• Dark & Light Mode Support</li>
            <li>• TypeScript Ready</li>
          </ul>
        `,
        thumbnail: 'https://picsum.photos/seed/nexus/1200/600',
        category: 'Productivity',
        profession: 'Developer',
        platform: 'Web',
        tags: ['React', 'Dashboard', 'Admin', 'UI Kit'],
        status: 'Approved',
        verified: true,
        websiteUrl: 'https://example.com',
        authorId: 'u1',
        authorName: 'Alex Developer',
        createdAt: new Date().toISOString()
      });
      setLoading(false);
    }, 1000);
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
  if (!project) return <div>Project not found</div>;
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Image */}
      <div className="rounded-2xl overflow-hidden mb-8 border border-gray-800 shadow-2xl">
        <img src={project.thumbnail} alt={project.title} className="w-full h-auto object-cover max-h-[600px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={project.platform === 'Web' ? 'web' : 'mobile'}>
                {project.platform}
              </Badge>
              <Badge variant="default">{project.category}</Badge>
              {project.verified && <Badge variant="verified">Verified</Badge>}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => <span key={tag} className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                  #{tag}
                </span>)}
            </div>

            <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{
            __html: project.fullDescription || project.description
          }} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#151b2d] rounded-xl border border-gray-800 p-6 sticky top-24">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                {project.websiteUrl && <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="block">
                    <Button fullWidth className="gap-2">
                      <Globe className="w-4 h-4" />
                      Visit Website
                    </Button>
                  </a>}
                <Button variant="secondary" fullWidth className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Project
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Creator
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {project.authorName[0]}
                </div>
                <div>
                  <p className="text-white font-medium">{project.authorName}</p>
                  <p className="text-xs text-gray-500">Member since 2023</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
              <button className="text-xs text-gray-500 hover:text-red-400 flex items-center justify-center gap-1 mx-auto">
                <Flag className="w-3 h-3" /> Report this project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}