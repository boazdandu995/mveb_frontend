'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: 'user' | 'vendor' | 'admin';
    redirectTo?: string;
}

export default function AuthGuard({ children, requiredRole, redirectTo }: AuthGuardProps) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // If not authenticated, redirect to login
            if (!isAuthenticated) {
                router.push('/auth/login');
                return;
            }

            // If role is required and user doesn't have it, redirect
            if (requiredRole && user?.role !== requiredRole) {
                if (redirectTo) {
                    router.push(redirectTo);
                } else {
                    // Redirect to appropriate dashboard based on user's actual role
                    switch (user?.role) {
                        case 'admin':
                            router.push('/dashboard/admin');
                            break;
                        case 'vendor':
                            router.push('/dashboard/vendor');
                            break;
                        default:
                            router.push('/dashboard/user');
                    }
                }
                return;
            }
        }
    }, [user, loading, isAuthenticated, requiredRole, redirectTo, router]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, don't render children
    if (!isAuthenticated) {
        return null;
    }

    // If role is required and user doesn't have it, don't render children
    if (requiredRole && user?.role !== requiredRole) {
        return null;
    }

    // Render children if all checks pass
    return <>{children}</>;
} 