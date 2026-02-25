import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import DashboardPage from './pages/DashboardPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from './hooks/useAuth';

function AppLayout() {
    const { showProfileSetup } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <Toaster richColors position="top-right" />
            {showProfileSetup && <ProfileSetupModal />}
        </div>
    );
}

const rootRoute = createRootRoute({
    component: AppLayout,
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
});

const tasksRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/tasks',
    component: TasksPage,
});

const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: DashboardPage,
});

const routeTree = rootRoute.addChildren([homeRoute, tasksRoute, dashboardRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return <RouterProvider router={router} />;
}
