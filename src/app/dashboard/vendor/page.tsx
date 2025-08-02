'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import EventForm from '../../../components/features/events/EventForm';
import EventAnalytics from '../../../components/features/events/EventAnalytics';
import VendorAnalytics from '../../../components/features/vendor/VendorAnalytics';
import { formatDate, formatPrice } from '../../../lib/utils/utils';
import {
    Calendar,
    MapPin,
    Users,
    DollarSign,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    Loader2,
    Plus,
    BarChart3,
    X,
    AlertTriangle
} from 'lucide-react';
import { useVendorEvents, useDeleteEvent, useEventAnalytics } from '../../../hooks/common/useEvents';
import { useVendorDashboard } from '../../../hooks/common/useDashboard';
import { Event, EventFormData } from '../../../types/types';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

type ViewMode = 'dashboard' | 'create' | 'edit' | 'analytics' | 'overview';

export default function VendorDashboard() {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

    const { data: events = [], isLoading: eventsLoading, error: eventsError } = useVendorEvents();
    const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useVendorDashboard();
    const deleteEventMutation = useDeleteEvent();

    const { data: eventAnalytics, isLoading: analyticsLoading } = useEventAnalytics(
        selectedEvent?.id || 0
    );

    const loading = eventsLoading || dashboardLoading;
    const error = eventsError || dashboardError;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Approved
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending Review
                    </span>
                );
            case 'draft':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Draft
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    const handleCreateEvent = () => {
        setSelectedEvent(null);
        setViewMode('create');
    };

    const handleEditEvent = (event: Event) => {
        setSelectedEvent(event);
        setViewMode('edit');
    };

    const handleViewAnalytics = (event: Event) => {
        setSelectedEvent(event);
        setViewMode('analytics');
    };

    const handleDeleteEvent = (event: Event) => {
        setEventToDelete(event);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (eventToDelete) {
            try {
                await deleteEventMutation.mutateAsync(eventToDelete.id);
                setShowDeleteModal(false);
                setEventToDelete(null);
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    const handleFormSuccess = () => {
        setViewMode('dashboard');
        setSelectedEvent(null);
    };

    const handleCancel = () => {
        setViewMode('dashboard');
        setSelectedEvent(null);
    };

    const totalEvents = events.length;
    const activeEvents = events.filter(event => event.status === 'approved').length;
    const pendingEvents = events.filter(event => event.status === 'pending').length;
    const rejectedEvents = events.filter(event => event.status === 'rejected').length;

    if (!user) {
        return <div>Loading...</div>;
    }

    // Check if user has vendor role
    if (user.role !== 'vendor') {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have permission to access the vendor dashboard.</p>
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
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Try Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // Render different views based on mode
    if (viewMode === 'create' || viewMode === 'edit') {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {viewMode === 'create' ? 'Create New Event' : 'Edit Event'}
                            </h1>
                            <p className="text-gray-600">
                                {viewMode === 'create' ? 'Add a new event to your portfolio' : 'Update your event details'}
                            </p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <EventForm
                        event={selectedEvent || undefined}
                        onSuccess={handleFormSuccess}
                        onCancel={handleCancel}
                        mode={viewMode}
                    />
                </div>
            </DashboardLayout>
        );
    }

    if (viewMode === 'analytics' && selectedEvent) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Event Analytics</h1>
                            <p className="text-gray-600">Detailed performance metrics for your event</p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="btn btn-outline"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                    {eventAnalytics && (
                        <EventAnalytics
                            data={eventAnalytics}
                            isLoading={analyticsLoading}
                        />
                    )}
                </div>
            </DashboardLayout>
        );
    }

    if (viewMode === 'overview') {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
                            <p className="text-gray-600">Comprehensive performance metrics and trends</p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="btn btn-outline"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                    {dashboardData && (
                        <VendorAnalytics
                            data={dashboardData}
                            isLoading={dashboardLoading}
                        />
                    )}
                </div>
            </DashboardLayout>
        );
    }

    // Main dashboard view
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
                        <p className="text-gray-600">Manage your events and track performance</p>
                    </div>
                    <button
                        onClick={handleCreateEvent}
                        className="btn btn-primary flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Events</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData?.stats?.totalEvents || totalEvents}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Events</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData?.stats?.approvedEvents || activeEvents}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData?.stats?.totalBookings || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatPrice(dashboardData?.stats?.totalRevenue ?? 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Event Status Overview</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Pending Review:</span>
                                <span className="text-sm font-medium text-yellow-600">
                                    {dashboardData?.stats?.pendingEvents || pendingEvents}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Rejected:</span>
                                <span className="text-sm font-medium text-red-600">
                                    {dashboardData?.stats?.rejectedEvents || rejectedEvents}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleCreateEvent}
                                className="btn btn-primary text-sm"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                New Event
                            </button>
                            <button
                                onClick={() => setViewMode('overview')}
                                className="btn btn-outline text-sm"
                            >
                                <BarChart3 className="h-4 w-4 mr-1" />
                                View Analytics
                            </button>
                        </div>
                    </div>
                </div>

                {/* Events List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">My Events</h2>
                        <button
                            onClick={handleCreateEvent}
                            className="btn btn-primary text-sm"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Create Event
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 mb-4" />
                            <p className="text-gray-600">Loading events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="p-6 text-center">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                            <p className="text-gray-600 mb-4">Create your first event to start selling tickets!</p>
                            <button
                                onClick={handleCreateEvent}
                                className="btn btn-primary"
                            >
                                Create Your First Event
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <div key={event.id} className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={event.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop'}
                                            alt={event.title}
                                            className="w-20 h-20 object-cover rounded-lg"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {event.title}
                                                    </h3>
                                                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {formatDate(event.date)}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <MapPin className="h-4 w-4 mr-1" />
                                                            {event.location}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <DollarSign className="h-4 w-4 mr-1" />
                                                            {event.ticketPrice > 0 ? formatPrice(event.ticketPrice) : 'Free'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusBadge(event.status)}
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Available Tickets</p>
                                                    <p className="font-medium">{event.availableTickets}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Category</p>
                                                    <p className="font-medium">{event.category}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewAnalytics(event)}
                                                    className="btn btn-outline text-sm"
                                                >
                                                    <BarChart3 className="h-4 w-4 mr-1" />
                                                    Analytics
                                                </button>
                                                <button
                                                    onClick={() => handleEditEvent(event)}
                                                    className="btn btn-outline text-sm"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event)}
                                                    className="btn btn-outline text-sm text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Event"
                message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                loading={deleteEventMutation.isPending}
            />
        </DashboardLayout>
    );
} 