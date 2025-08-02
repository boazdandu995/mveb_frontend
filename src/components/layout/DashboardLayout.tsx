'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils/utils';
import {
    Calendar,
    Users,
    BarChart3,
    Plus,
    Home,
    User,
    Building
} from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
                    <a href="/auth/login" className="text-blue-600 hover:text-blue-500">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    const getSidebarItems = () => {
        switch (user.role) {
            case 'admin':
                return [
                    { href: '/dashboard/admin', label: 'Dashboard', icon: Home },
                    { href: '/dashboard/admin/profile', label: 'Profile', icon: User },
                ];
            case 'vendor':
                return [
                    { href: '/dashboard/vendor', label: 'Overview', icon: Home },
                    { href: '/dashboard/vendor/events', label: 'Event Management', icon: Calendar },
                    { href: '/dashboard/vendor/profile', label: 'Profile', icon: User },
                ];
            case 'user':
                return [
                    { href: '/dashboard/user', label: 'My Bookings', icon: Calendar },
                    { href: '/dashboard/user/profile', label: 'Profile', icon: User },
                ];
            default:
                return [];
        }
    };

    const sidebarItems = getSidebarItems();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Fixed Sidebar */}
            <div className="w-56 bg-white shadow-sm fixed left-0 top-12 h-[calc(100vh-48px)] z-30">
                <div className="p-4 border-b">
                    <h1 className="text-lg font-semibold text-gray-900">
                        {user.role === 'admin' && 'Admin Dashboard'}
                        {user.role === 'vendor' && 'Vendor Dashboard'}
                        {user.role === 'user' && 'My Dashboard'}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Welcome back, {user.name}</p>
                </div>

                <nav className="p-3 overflow-y-auto h-[calc(100vh-140px)]">
                    <ul className="space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex items-center space-x-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors',
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-56">
                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
} 