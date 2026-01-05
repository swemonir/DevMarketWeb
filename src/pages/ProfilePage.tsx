import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProjectList } from '../components/profile/ProjectList';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { Project } from '../types';
import { Settings, LogOut } from 'lucide-react';
// Mock Data
const MOCK_USER_PROJECTS: Project[] = [{
  id: 'p1',
  title: 'My Awesome App',
  description: 'A productivity tool for designers',
  thumbnail: 'https://picsum.photos/seed/1/400/225',
  category: 'Productivity',
  profession: 'Developer',
  platform: 'Web',
  tags: ['React'],
  status: 'Approved',
  verified: true,
  authorId: 'u1',
  authorName: 'Me',
  createdAt: new Date().toISOString()
}, {
  id: 'p2',
  title: 'Draft Project',
  description: 'Work in progress...',
  thumbnail: 'https://picsum.photos/seed/2/400/225',
  category: 'AI Tools',
  profession: 'Developer',
  platform: 'Mobile',
  tags: ['AI'],
  status: 'Draft',
  verified: false,
  authorId: 'u1',
  authorName: 'Me',
  createdAt: new Date().toISOString()
}];
export function ProfilePage() {
  const {
    user,
    logout
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'Draft' | 'Pending' | 'Approved' | 'Marketplace'>('Approved');
  if (!user) return null;
  const filteredProjects = MOCK_USER_PROJECTS.filter(p => {
    if (activeTab === 'Marketplace') return false; // Mock data doesn't have marketplace items yet
    return p.status === activeTab;
  });
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-[#151b2d] rounded-2xl p-8 border border-gray-800 mb-8 flex flex-col md:flex-row items-center gap-6">
        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-[#0a0e1a]" />
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            {user.verified && <Badge variant="verified">Verified</Badge>}
          </div>
          <p className="text-gray-400 mb-4">{user.email}</p>
          <div className="flex justify-center md:justify-start gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-800">
        <div className="flex gap-8 overflow-x-auto">
          {['Approved', 'Pending', 'Draft', 'Marketplace'].map(tab => <button key={tab} onClick={() => setActiveTab(tab as any)} className={`
                pb-4 text-sm font-medium transition-colors relative whitespace-nowrap
                ${activeTab === tab ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'}
              `}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-t-full" />}
            </button>)}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        <ProjectList projects={filteredProjects} status={activeTab} />
      </div>
    </div>;
}