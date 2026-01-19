import React, { useState, useRef } from 'react';
import { X, Camera, ShieldCheck, Trash2, Loader2, Save } from 'lucide-react';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { user, refreshUser, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<'profile' | 'security'>('profile');

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [interests, setInterests] = useState(user?.interests?.join(', ') || '');

    // Security State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Avatar State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    if (!isOpen) return null;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i !== '');
            await authService.updateProfile({ name, interests: interestsArray });
            await refreshUser();
            toast.success('Profile updated successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            await authService.updatePassword({ currentPassword, password: newPassword });
            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleDeleteAvatar = async () => {
        setUploadingAvatar(true);
        try {
            await authService.deleteAvatar();
            await refreshUser();
            toast.success('Avatar removed');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to remove avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you absolutely sure? This action is irreversible and all your data will be deleted.')) {
            return;
        }

        setLoading(true);
        try {
            await authService.deleteAccount();
            toast.success('Account deleted successfully');
            logout();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#151b2d]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Settings
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row min-h-[450px]">
                    {/* Sidebar */}
                    <div className="w-full md:w-48 bg-[#151b2d]/50 border-r border-gray-800 p-2 space-y-1">
                        <button
                            onClick={() => setActiveSection('profile')}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                        >
                            Profile Info
                        </button>
                        <button
                            onClick={() => setActiveSection('security')}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === 'security' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                        >
                            Security
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8 overflow-y-auto max-h-[70vh]">
                        {activeSection === 'profile' ? (
                            <div className="space-y-8 animate-fadeIn">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-600/20 bg-gray-800">
                                            {uploadingAvatar ? (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                                </div>
                                            ) : (
                                                <img
                                                    src={user?.avatar || 'https://www.gravatar.com/avatar?d=mp'}
                                                    alt={user?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        {user?.avatar && !uploadingAvatar && (
                                            <button
                                                onClick={handleDeleteAvatar}
                                                className="absolute -top-1 -right-1 p-1 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-500 transition-colors"
                                                title="Remove avatar"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition-colors group-hover:scale-110"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Profile Photo</h3>
                                        <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <Input
                                        label="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Interests (Comma separated)</label>
                                        <textarea
                                            value={interests}
                                            onChange={(e) => setInterests(e.target.value)}
                                            placeholder="e.g. business, it-services, web-development"
                                            className="w-full bg-[#1a1f35] border border-gray-700 rounded-lg text-white p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        isLoading={loading}
                                        className="gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                                    <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                                    <p className="text-sm">Manage your password and account security settings here.</p>
                                </div>

                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <Input
                                        label="Current Password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <Input
                                        label="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="primary"
                                        isLoading={loading}
                                        className="mt-2"
                                    >
                                        Change Password
                                    </Button>
                                </form>

                                <div className="pt-8 border-t border-gray-800">
                                    <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
                                    <p className="text-sm text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                    <Button
                                        onClick={handleDeleteAccount}
                                        variant="ghost"
                                        fullWidth
                                        className="text-red-500 border border-red-500/20 hover:bg-red-500/10 gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete My Account
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
