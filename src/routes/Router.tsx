import { createBrowserRouter, useOutletContext } from "react-router-dom";
import { RootLayout } from "../components/layout/RootLayout";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import { LandingPage } from "../pages/LandingPage";
import { DiscoverPage } from "../pages/DiscoverPage";
import { MarketplacePage } from "../pages/MarketplacePage";
import { ProjectDetailsPage } from "../pages/ProjectDetailsPage";
import { SubmitPage } from "../pages/SubmitPage";
import { ProfilePage } from "../pages/ProfilePage";

// Helper to provide the openAuth capability to LandingPage
function LandingPageWrapper() {
    const { openAuth } = useOutletContext<{ openAuth: () => void }>();
    return <LandingPage onOpenAuth={openAuth} />;
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <LandingPageWrapper />
            },
            {
                path: "/discover",
                element: <DiscoverPage />
            },
            {
                path: "/marketplace",
                element: <MarketplacePage />
            },
            {
                path: "/project/:id",
                element: (
                    <ProtectedRoute>
                        <ProjectDetailsPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/submit",
                element: (
                    <ProtectedRoute allowedRoles={['seller', 'admin']}>
                        <SubmitPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                )
            }
        ]
    }
]);
