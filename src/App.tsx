import React, { useEffect, useState, Component } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
// Pages
import { LandingPage } from './pages/LandingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { SubmitPage } from './pages/SubmitPage';
import { ProfilePage } from './pages/ProfilePage';
// Protected Route Component
function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    loading
  } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen bg-[#0a0e1a]" />;
  if (!isAuthenticated) {
    return <Navigate to="/" state={{
      from: location
    }} replace />;
  }
  return <>{children}</>;
}
function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col font-sans">
      <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage onOpenAuth={() => setIsAuthModalOpen(true)} />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/marketplace" element={<ProtectedRoute>
                <MarketplacePage />
              </ProtectedRoute>} />
          <Route path="/project/:id" element={<ProjectDetailsPage />} />
          <Route path="/submit" element={<ProtectedRoute>
                <SubmitPage />
              </ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <Toaster position="bottom-right" toastOptions={{
      style: {
        background: '#151b2d',
        color: '#fff',
        border: '1px solid #374151'
      }
    }} />
    </div>;
}
export function App() {
  return <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>;
}