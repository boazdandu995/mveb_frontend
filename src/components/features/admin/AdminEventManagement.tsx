'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Eye, MapPin, Users } from 'lucide-react';
import { useAdminEvents, useUpdateEventStatus } from '../../../hooks/api/useEventsApi';
import { useAppDispatch } from '../../../redux/store/hooks';
import { addNotification } from '../../../redux/slices/uiSlice';
import { Event } from '../../../types/types';



interface AdminEventManagementProps {
    onEventUpdate: () => void;
}

export default function AdminEventManagement({ onEventUpdate }: AdminEventManagementProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const dispatch = useAppDispatch();

    // Use React Query hooks
    const { data: events = [], isLoading, error, refetch } = useAdminEvents();
    const updateEventStatusMutation = useUpdateEventStatus();

    const handleUpdateEventStatus = async (eventId: number, status: 'approved' | 'rejected') => {
        try {
            await updateEventStatusMutation.mutateAsync({ id: eventId, status });
            setSelectedEvent(null);
            onEventUpdate();
            dispatch(addNotification({
                type: 'success',
                message: `Event ${status} successfully!`,
                duration: 5000
            }));
        } catch (error) {
            console.error('Failed to update event status:', error);
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to update event status. Please try again.',
                duration: 5000
            }));
        }
    };

    const handleToggleFeatured = async (eventId: number, featured: boolean) => {
        try {
            // Note: This would need a separate mutation hook for updating featured status
            // For now, we'll refetch the data after the status update
            await updateEventStatusMutation.mutateAsync({ id: eventId, status: 'approved' });
            onEventUpdate();
        } catch (error) {
            console.error('Failed to update featured status:', error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Failed to load events. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Event Management</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => refetch()}
                        className="btn btn-outline"
                        disabled={isLoading}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {events.map((event: Event) => (
                    <div key={event.id} className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                                        {event.status}
                                    </span>
                                    {event.featured && (
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 mb-3">{event.description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        {event.availableTickets} tickets
                                    </div>
                                    <div>
                                        ${event.ticketPrice} per ticket
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500">
                                    <span className="font-medium">Vendor:</span> {event.vendor.vendorName} ({event.vendor.user.name})
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {getStatusIcon(event.status)}

                                {event.status === 'approved' && (
                                    <button
                                        onClick={() => handleToggleFeatured(event.id, !event.featured)}
                                        disabled={updateEventStatusMutation.isPending}
                                        className={`btn btn-sm ${event.featured ? 'btn-outline text-purple-600 border-purple-600' : 'btn-outline'}`}
                                    >
                                        {event.featured ? 'Unfeature' : 'Feature'}
                                    </button>
                                )}

                                {event.status === 'pending' && (
                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        className="btn btn-outline btn-sm"
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Review
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Review Event: {selectedEvent.title}
                        </h3>

                        <div className="mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Description:</span> {selectedEvent.description}</div>
                                    <div><span className="font-medium">Location:</span> {selectedEvent.location}</div>
                                    <div><span className="font-medium">Date:</span> {new Date(selectedEvent.date).toLocaleDateString()}</div>
                                    <div><span className="font-medium">Category:</span> {selectedEvent.category}</div>
                                    <div><span className="font-medium">Available Tickets:</span> {selectedEvent.availableTickets}</div>
                                    <div><span className="font-medium">Ticket Price:</span> ${selectedEvent.ticketPrice}</div>
                                    <div><span className="font-medium">Vendor:</span> {selectedEvent.vendor.vendorName}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                disabled={updateEventStatusMutation.isPending}
                                className="flex-1 btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdateEventStatus(selectedEvent.id, 'rejected')}
                                disabled={updateEventStatusMutation.isPending}
                                className="flex-1 btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
                            >
                                {updateEventStatusMutation.isPending ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                                onClick={() => handleUpdateEventStatus(selectedEvent.id, 'approved')}
                                disabled={updateEventStatusMutation.isPending}
                                className="flex-1 btn btn-primary"
                            >
                                {updateEventStatusMutation.isPending ? 'Processing...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 