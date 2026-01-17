import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { AuthModal } from '../auth/AuthModal';

export function RootLayout() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col font-sans">
            <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />

            <main className="flex-grow">
                <Outlet context={{ openAuth: () => setIsAuthModalOpen(true) }} />
            </main>

            <Footer />

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#151b2d',
                        color: '#fff',
                        border: '1px solid #374151'
                    }
                }}
            />
        </div>
    );
}
