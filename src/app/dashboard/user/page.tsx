'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import AuthGuard from '../../../components/features/auth/AuthGuard';
import { Calendar, MapPin, Users, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { formatDate, formatPrice } from '../../../lib/utils/utils';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import NotificationModal from '../../../components/shared/NotificationModal';
import { useMyBookings, useDeleteBooking } from '../../../hooks/api/useBookingsApi';

interface Booking {
    id: number;
    numberOfTickets: number;
    totalAmount: number;
    bookingDate: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    event: {
        id: number;
        title: string;
        description: string;
        date: string;
        location: string;
        category: string;
        ticketPrice: number;
        vendor: {
            vendorName: string;
        };
    };
}

export default function UserDashboard() {
    const { user } = useAuth();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState({ title: '', message: '', type: 'info' as 'success' | 'error' | 'warning' | 'info' });
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

    // Use React Query hooks
    const { data: bookings = [], isLoading, error, refetch } = useMyBookings();
    const deleteBookingMutation = useDeleteBooking();

    const handleCancelBookingClick = (bookingId: number) => {
        setSelectedBookingId(bookingId);
        setShowCancelConfirm(true);
    };

    const handleCancelBookingConfirm = async () => {
        if (!selectedBookingId) return;

        setShowCancelConfirm(false);

        try {
            await deleteBookingMutation.mutateAsync(selectedBookingId);
            setNotificationData({
                title: 'Success',
                message: 'Booking cancelled successfully',
                type: 'success'
            });
            setShowNotification(true);
        } catch (error) {
            setNotificationData({
                title: 'Error',
                message: 'Failed to cancel booking',
                type: 'error'
            });
            setShowNotification(true);
        } finally {
            setSelectedBookingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirmed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancelled
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                    </span>
                );
            default:
                return null;
        }
    };

    const upcomingBookings = bookings.filter(booking =>
        new Date(booking.event.date) > new Date() && booking.status === 'confirmed'
    );

    const pastBookings = bookings.filter(booking =>
        new Date(booking.event.date) <= new Date()
    );

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    Failed to load bookings. Please try again.
                </div>
            </DashboardLayout>
        );
    }

    return (
        <AuthGuard requiredRole="user">
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
                        <p className="text-gray-600">Manage your event bookings and account settings.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                                    <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {(() => {
                                            try {
                                                const total = bookings.reduce((sum, booking) => {
                                                    const amount = Number(booking.totalAmount) || 0;
                                                    return sum + amount;
                                                }, 0);
                                                return formatPrice(total);
                                            } catch (error) {
                                                console.error('Error calculating total spent:', error);
                                                return '$0.00';
                                            }
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Bookings */}
                    {upcomingBookings.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {upcomingBookings.map((booking) => (
                                    <div key={booking.id} className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {booking.event.title}
                                                        </h3>
                                                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                {formatDate(booking.event.date)}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <MapPin className="h-4 w-4 mr-1" />
                                                                {booking.event.location}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Users className="h-4 w-4 mr-1" />
                                                                {booking.numberOfTickets} ticket{booking.numberOfTickets !== 1 ? 's' : ''}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <DollarSign className="h-4 w-4 mr-1" />
                                                                {formatPrice(booking.totalAmount)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusBadge(booking.status)}
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleCancelBookingClick(booking.id)}
                                                        disabled={deleteBookingMutation.isPending}
                                                        className="btn btn-outline text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {deleteBookingMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Bookings */}
                    {pastBookings.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Past Events</h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {pastBookings.map((booking) => (
                                    <div key={booking.id} className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {booking.event.title}
                                                        </h3>
                                                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                {formatDate(booking.event.date)}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <MapPin className="h-4 w-4 mr-1" />
                                                                {booking.event.location}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Users className="h-4 w-4 mr-1" />
                                                                {booking.numberOfTickets} ticket{booking.numberOfTickets !== 1 ? 's' : ''}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <DollarSign className="h-4 w-4 mr-1" />
                                                                {formatPrice(booking.totalAmount)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusBadge(booking.status)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {bookings.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                            <p className="text-gray-600 mb-4">Start exploring events and make your first booking!</p>
                            <a href="/events" className="btn btn-primary">
                                Browse Events
                            </a>
                        </div>
                    )}
                </div>
            </DashboardLayout>

            {/* Cancel Booking Confirmation Modal */}
            <ConfirmationModal
                isOpen={showCancelConfirm}
                onClose={() => setShowCancelConfirm(false)}
                onConfirm={handleCancelBookingConfirm}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmText="Cancel Booking"
                cancelText="Keep Booking"
                variant="danger"
                loading={deleteBookingMutation.isPending}
            />

            {/* Notification Modal */}
            <NotificationModal
                isOpen={showNotification}
                onClose={() => setShowNotification(false)}
                title={notificationData.title}
                message={notificationData.message}
                type={notificationData.type}
            />
        </AuthGuard>
    );
} 