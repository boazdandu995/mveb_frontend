'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import EventForm from '../../../../components/features/events/EventForm';
import { formatDate, formatPrice } from '../../../../lib/utils/utils';
import { useAppDispatch } from '../../../../redux/store/hooks';
import { addNotification } from '../../../../redux/slices/uiSlice';
import {
    Calendar,
    MapPin,
    Users,
    DollarSign,
    Edit,
    Trash2,
    Loader2,
    Plus,
    Search,
    Filter,
    SortAsc,
    SortDesc,
    BarChart3,
    Eye,
    X,
    AlertTriangle
} from 'lucide-react';
import { useVendorEvents, useDeleteEvent } from '../../../../hooks/common/useEvents';
import { Event } from '../../../../types/types';
import ConfirmationModal from '../../../../components/shared/ConfirmationModal';

type ViewMode = 'list' | 'create' | 'edit';
type SortField = 'title' | 'date' | 'status' | 'ticketPrice' | 'availableTickets';
type SortOrder = 'asc' | 'desc';

export default function VendorEvents() {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const { data: events = [], isLoading, error } = useVendorEvents();
    const deleteEventMutation = useDeleteEvent();

    const categories = [
        'Music',
        'Technology',
        'Food & Drink',
        'Arts & Culture',
        'Sports',
        'Business',
        'Education',
        'Entertainment',
        'Health & Wellness',
        'Networking'
    ];

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

    // Filter and sort events
    const filteredAndSortedEvents = useMemo(() => {
        let filtered = events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        // Sort events
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortField) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'ticketPrice':
                    aValue = a.ticketPrice;
                    bValue = b.ticketPrice;
                    break;
                case 'availableTickets':
                    aValue = a.availableTickets;
                    bValue = b.availableTickets;
                    break;
                default:
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [events, searchQuery, statusFilter, categoryFilter, sortField, sortOrder]);

    const handleCreateEvent = () => {
        setSelectedEvent(null);
        setViewMode('create');
    };

    const handleEditEvent = (event: Event) => {
        setSelectedEvent(event);
        setViewMode('edit');
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
                dispatch(addNotification({
                    type: 'success',
                    message: 'Event deleted successfully!',
                    duration: 5000
                }));
            } catch (error) {
                console.error('Error deleting event:', error);
                dispatch(addNotification({
                    type: 'error',
                    message: 'Failed to delete event. Please try again.',
                    duration: 5000
                }));
            }
        }
    };

    const handleFormSuccess = () => {
        setViewMode('list');
        setSelectedEvent(null);
    };

    const handleCancel = () => {
        setViewMode('list');
        setSelectedEvent(null);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <SortAsc className="h-4 w-4 text-gray-400" />;
        }
        return sortOrder === 'asc' ?
            <SortAsc className="h-4 w-4 text-blue-600" /> :
            <SortDesc className="h-4 w-4 text-blue-600" />;
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    if (user.role !== 'vendor') {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have permission to access the vendor events page.</p>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Events</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Try Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // Render form views
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
                        event={selectedEvent ? { ...selectedEvent, status: selectedEvent.status } : undefined}
                        onSuccess={handleFormSuccess}
                        onCancel={handleCancel}
                        mode={viewMode}
                    />
                </div>
            </DashboardLayout>
        );
    }

    // Main events list view
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
                        <p className="text-gray-600">Manage and organize your events</p>
                        <p className="text-sm text-amber-600 mt-1">
                            💡 Note: Approved events cannot be edited to maintain data integrity. Contact admin for changes.
                        </p>
                    </div>
                    <button
                        onClick={handleCreateEvent}
                        className="btn btn-primary flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        {/* Results Count */}
                        <div className="flex items-center justify-end text-sm text-gray-600">
                            {filteredAndSortedEvents.length} of {events.length} events
                        </div>
                    </div>
                </div>

                {/* Events Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Date</span>
                                            {getSortIcon('date')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('ticketPrice')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Price</span>
                                            {getSortIcon('ticketPrice')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('availableTickets')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Available</span>
                                            {getSortIcon('availableTickets')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Status</span>
                                            {getSortIcon('status')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 mb-4" />
                                            <p className="text-gray-600">Loading events...</p>
                                        </td>
                                    </tr>
                                ) : filteredAndSortedEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                                            <p className="text-gray-600 mb-4">
                                                {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                                                    ? 'Try adjusting your filters or search terms.'
                                                    : 'Create your first event to get started!'
                                                }
                                            </p>
                                            {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
                                                <button
                                                    onClick={handleCreateEvent}
                                                    className="btn btn-primary"
                                                >
                                                    Create Your First Event
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAndSortedEvents.map((event) => (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={event.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop'}
                                                        alt={event.title}
                                                        className="w-12 h-12 object-cover rounded-lg mr-4"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop';
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {event.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {event.location} • {event.category}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(event.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {event.ticketPrice > 0 ? formatPrice(event.ticketPrice) : 'Free'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {event.availableTickets}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(event.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => window.open(`/events/${event.id}`, '_blank')}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View Event"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditEvent(event)}
                                                        disabled={event.status === 'approved'}
                                                        className={`${event.status === 'approved'
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-indigo-600 hover:text-indigo-900'
                                                            }`}
                                                        title={event.status === 'approved'
                                                            ? 'Cannot edit approved events. Contact admin for changes.'
                                                            : 'Edit Event'
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete Event"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
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