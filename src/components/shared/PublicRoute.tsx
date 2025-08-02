'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface PublicRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export default function PublicRoute({ children, redirectTo }: PublicRouteProps) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated && user) {
            // Check if there's a redirect parameter in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const redirectParam = urlParams.get('redirect');

            if (redirectParam) {
                // User just logged in and should be redirected back
                router.replace(redirectParam);
            } else if (redirectTo) {
                // Use the provided redirectTo
                router.replace(redirectTo);
            } else {
                // Default dashboard redirect
                switch (user.role) {
                    case 'admin':
                        router.replace('/dashboard/admin');
                        break;
                    case 'vendor':
                        router.replace('/dashboard/vendor');
                        break;
                    default:
                        router.replace('/dashboard/user');
                }
            }
        }
    }, [user, loading, isAuthenticated, redirectTo, router]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If authenticated, don't render children (will redirect)
    if (isAuthenticated) {
        return null;
    }

    // Render children if not authenticated
    return <>{children}</>;
} 