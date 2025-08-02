'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import AdminVendorManagement from '../../../components/features/admin/AdminVendorManagement';
import AdminEventManagement from '../../../components/features/admin/AdminEventManagement';
import AdminUserManagement from '../../../components/features/admin/AdminUserManagement';
import AdminBookingAnalytics from '../../../components/features/admin/AdminBookingAnalytics';
import AdminRevenueAnalytics from '../../../components/features/admin/AdminRevenueAnalytics';
import { formatPrice } from '../../../lib/utils/utils';
import { Users, Building, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Loader2, Settings, Eye, BarChart3, PieChart } from 'lucide-react';
import { useAdminDashboard } from '../../../hooks/common/useDashboard';

export default function AdminDashboard() {
    const { user } = useAuth();
    const { data: dashboardData, isLoading, error, refetch } = useAdminDashboard();
    const [activeTab, setActiveTab] = useState('overview');

    if (!user) {
        return <div>Loading...</div>;
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
                    <button onClick={() => window.location.href = '/dashboard/user'} className="btn btn-primary">
                        Go to User Dashboard
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Try Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const stats = dashboardData?.stats || {
        totalUsers: 0,
        totalVendors: 0,
        totalEvents: 0,
        totalBookings: 0,
        pendingEvents: 0,
        approvedEvents: 0,
    };

    const tabs = [
        { id: 'overview', name: 'Overview', icon: Eye },
        { id: 'users', name: 'User Management', icon: Users },
        { id: 'vendors', name: 'Vendor Management', icon: Building },
        { id: 'events', name: 'Event Management', icon: Calendar },
        { id: 'bookings', name: 'Booking Analytics', icon: BarChart3 },
        { id: 'revenue', name: 'Revenue Analytics', icon: PieChart },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users':
                return <AdminUserManagement onUserUpdate={refetch} />;
            case 'vendors':
                return <AdminVendorManagement onVendorUpdate={refetch} />;
            case 'events':
                return <AdminEventManagement onEventUpdate={refetch} />;
            case 'bookings':
                return <AdminBookingAnalytics />;
            case 'revenue':
                return <AdminRevenueAnalytics />;
            default:
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Platform overview and management</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers?.toLocaleString() || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Building className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalVendors || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Calendar className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Events</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalEvents || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <DollarSign className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isLoading && (
                            <div className="text-center py-12">
                                <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 mb-4" />
                                <p className="text-gray-600">Loading dashboard data...</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Pending Approvals</h2>
                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {stats.pendingEvents ?? 0} pending
                                    </span>
                                </div>

                                {(stats.pendingEvents ?? 0) > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">Events Pending Review</p>
                                                <p className="text-sm text-gray-500">Click to review pending events</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setActiveTab('events')}
                                                    className="btn btn-outline text-xs"
                                                >
                                                    Review All
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                        <p className="text-gray-600">No pending events to review</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <Users className="h-5 w-5 text-blue-600 mr-3" />
                                            <div>
                                                <p className="font-medium text-gray-900">Manage Users</p>
                                                <p className="text-sm text-gray-500">View and manage user accounts</p>
                                            </div>
                                        </div>
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('bookings')}
                                        className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <BarChart3 className="h-5 w-5 text-green-600 mr-3" />
                                            <div>
                                                <p className="font-medium text-gray-900">Booking Analytics</p>
                                                <p className="text-sm text-gray-500">View booking trends and patterns</p>
                                            </div>
                                        </div>
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('revenue')}
                                        className="w-full flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <PieChart className="h-5 w-5 text-yellow-600 mr-3" />
                                            <div>
                                                <p className="font-medium text-gray-900">Revenue Analytics</p>
                                                <p className="text-sm text-gray-500">Track platform revenue and growth</p>
                                            </div>
                                        </div>
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Health</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-2">99.9%</div>
                                    <p className="text-sm text-gray-600">Uptime</p>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 mb-2">245ms</div>
                                    <p className="text-sm text-gray-600">Average Response Time</p>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 mb-2">{stats.totalUsers || 0}</div>
                                    <p className="text-sm text-gray-600">Total Users</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {renderTabContent()}
        </DashboardLayout>
    );
} 