import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProjectList } from '../components/profile/ProjectList';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { Project } from '../types';
import { Settings, LogOut, Camera, Loader2 } from 'lucide-react';
import { projectService, authService } from '../services/api';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import toast from 'react-hot-toast';
export function ProfilePage() {
  const {
    user,
    logout,
    refreshUser
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'Approved' | 'Pending' | 'Draft' | 'Marketplace'>('Approved');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchUserProjects() {
      if (!user) return;
      setLoading(true);
      try {
        let response;
        if (activeTab === 'Marketplace') {
          // Use status/marketplace with owner=me to get OWN items
          response = await projectService.getProjectsByStatus('marketplace', 'me');
          setProjects(response.data || response || []);
        } else {
          // Use status with owner=me for Draft, Pending, Approved
          response = await projectService.getProjectsByStatus(activeTab, 'me');
          setProjects(response.data || response || []);
        }
      } catch (error) {
        console.error('Error fetching user projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProjects();
  }, [user, activeTab]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      await authService.uploadAvatar(file);
      await refreshUser();
      toast.success('Avatar updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!user) return null;

  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header */}
    <div className="bg-[#151b2d] rounded-2xl p-8 border border-gray-800 mb-8 flex flex-col md:flex-row items-center gap-6">
      <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
        <div className="w-24 h-24 rounded-full border-4 border-[#0a0e1a] overflow-hidden bg-gray-800 flex items-center justify-center">
          {uploadingAvatar ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <img src={user.avatar || 'https://www.gravatar.com/avatar?d=mp'} alt={user.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          {user.verified && <Badge variant="verified">Verified</Badge>}
        </div>
        <p className="text-gray-400 mb-4">{user.email}</p>
        <div className="flex justify-center md:justify-start gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
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
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 w-full bg-[#151b2d] rounded-xl border border-gray-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <ProjectList projects={projects} status={activeTab} />
      )}
    </div>

    <EditProfileModal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
    />
  </div>;
}