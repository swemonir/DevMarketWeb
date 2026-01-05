import React, { useState, Component } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, User as UserIcon, LogOut, PlusCircle, LayoutGrid, ShoppingBag } from 'lucide-react';
import { Button } from '../shared/Button';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
interface NavbarProps {
  onOpenAuth: () => void;
}
export function Navbar({
  onOpenAuth
}: NavbarProps) {
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  const isActive = (path: string) => location.pathname === path;
  return <nav className="sticky top-0 z-40 w-full bg-[#0a0e1a]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                DevNexus
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/discover" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/discover') ? 'text-white' : 'text-gray-400'}`}>
                Discover
              </Link>
              <Link to="/marketplace" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/marketplace') ? 'text-white' : 'text-gray-400'}`}>
                Marketplace
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search apps, source code, designers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#151b2d] border border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" />
            </form>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? <>
                <Link to="/submit">
                  <Button variant="outline" size="sm" className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Submit Project
                  </Button>
                </Link>

                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt={user?.name} className="w-8 h-8 rounded-full border border-gray-700" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                        <motion.div initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95
                  }} animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }} exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95
                  }} className="absolute right-0 mt-2 w-56 bg-[#151b2d] border border-gray-800 rounded-xl shadow-xl z-20 py-2">
                          <div className="px-4 py-2 border-b border-gray-800 mb-2">
                            <p className="text-sm font-medium text-white truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>

                          <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsProfileOpen(false)}>
                            <LayoutGrid className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link to="/profile?tab=marketplace" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsProfileOpen(false)}>
                            <ShoppingBag className="w-4 h-4" />
                            My Listings
                          </Link>

                          <div className="border-t border-gray-800 mt-2 pt-2">
                            <button onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        navigate('/');
                      }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>}
                  </AnimatePresence>
                </div>
              </> : <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onOpenAuth}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={onOpenAuth}>
                  Get Started
                </Button>
              </div>}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 hover:text-white p-2">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} className="md:hidden bg-[#0a0e1a] border-b border-gray-800 overflow-hidden">
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#151b2d] border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white" />
              </form>

              <div className="flex flex-col gap-2">
                <Link to="/discover" className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                  Discover
                </Link>
                <Link to="/marketplace" className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                  Marketplace
                </Link>
                {isAuthenticated && <>
                    <Link to="/submit" className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      Submit Project
                    </Link>
                    <Link to="/profile" className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      My Profile
                    </Link>
                  </>}
              </div>

              <div className="pt-4 border-t border-gray-800">
                {isAuthenticated ? <Button variant="outline" fullWidth onClick={() => {
              logout();
              setIsMobileMenuOpen(false);
            }}>
                    Sign Out
                  </Button> : <Button variant="primary" fullWidth onClick={() => {
              onOpenAuth();
              setIsMobileMenuOpen(false);
            }}>
                    Sign In / Sign Up
                  </Button>}
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </nav>;
}