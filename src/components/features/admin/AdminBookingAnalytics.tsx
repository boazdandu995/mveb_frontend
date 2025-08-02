'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Filter, Download, Eye } from 'lucide-react';
import { useAdminBookings, useAdminBookingAnalytics } from '../../../hooks/api/useBookingsApi';
import { formatPrice } from '../../../lib/utils/utils';
import { Booking } from '../../../types/types';



interface BookingAnalytics {
    totalBookings: number;
    totalRevenue: number;
    totalTickets: number;
    averageTicketsPerBooking: number;
    topEvents: Array<{
        eventId: number;
        eventTitle: string;
        bookingCount: number;
        revenue: number;
    }>;
    topUsers: Array<{
        userId: number;
        userName: string;
        bookingCount: number;
        totalSpent: number;
    }>;
    monthlyTrends: Array<{
        month: string;
        bookings: number;
        revenue: number;
    }>;
    dailyTrends: Array<{
        date: string;
        bookings: number;
    }>;
}

export default function AdminBookingAnalytics() {
    const [dateFilter, setDateFilter] = useState<string>('30');
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

    // Use React Query hooks
    const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = useAdminBookings();
    const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useAdminBookingAnalytics();

    const isLoading = bookingsLoading || analyticsLoading;
    const error = bookingsError || analyticsError;

    const getDateRange = () => {
        const days = parseInt(dateFilter);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return { startDate, endDate };
    };

    const filterBookingsByDate = (bookings: Booking[]) => {
        if (dateFilter === 'all') return bookings;

        const { startDate, endDate } = getDateRange();
        return bookings.filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate >= startDate && bookingDate <= endDate;
        });
    };

    const filteredBookings = filterBookingsByDate(bookings);

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading booking analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Failed to load booking analytics. Please try again.
            </div>
        );
    }

    const analyticsData = analytics || {
        totalBookings: 0,
        totalRevenue: 0,
        totalTickets: 0,
        averageTicketsPerBooking: 0,
        topEvents: [],
        topUsers: [],
        monthlyTrends: [],
        dailyTrends: []
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Booking Analytics</h2>
                <div className="flex space-x-2">
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="all">All time</option>
                    </select>
                    <button className="btn btn-outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredBookings.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatPrice(filteredBookings.reduce((sum, booking) => {
                                    const amount = Number(booking.totalAmount) || 0;
                                    return sum + amount;
                                }, 0))}
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
                            <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {filteredBookings.reduce((sum, booking) => {
                                    const tickets = Number(booking.numberOfTickets) || 0;
                                    return sum + tickets;
                                }, 0)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg. Tickets/Booking</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {filteredBookings.length > 0
                                    ? (filteredBookings.reduce((sum, booking) => {
                                        const tickets = Number(booking.numberOfTickets) || 0;
                                        return sum + tickets;
                                    }, 0) / filteredBookings.length).toFixed(1)
                                    : '0'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Events */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Events</h3>
                    <div className="space-y-3">
                        {analyticsData.topEvents.slice(0, 5).map((event: {
                            eventId: number;
                            eventTitle: string;
                            bookingCount: number;
                            revenue: number;
                        }, index: number) => (
                            <div key={event.eventId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 mr-3">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{event.eventTitle}</p>
                                        <p className="text-sm text-gray-500">{event.bookingCount} bookings</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{formatPrice(Number(event.revenue) || 0)}</p>
                                    <p className="text-sm text-gray-500">{event.bookingCount} tickets</p>
                                </div>
                            </div>
                        ))}
                        {analyticsData.topEvents.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                No events with bookings found
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Users */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Users by Bookings</h3>
                    <div className="space-y-3">
                        {analyticsData.topUsers.slice(0, 5).map((user: {
                            userId: number;
                            userName: string;
                            bookingCount: number;
                            totalSpent: number;
                        }, index: number) => (
                            <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600 mr-3">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.userName}</p>
                                        <p className="text-sm text-gray-500">{user.bookingCount} bookings</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{formatPrice(Number(user.totalSpent) || 0)}</p>
                                    <p className="text-sm text-gray-500">Total spent</p>
                                </div>
                            </div>
                        ))}
                        {analyticsData.topUsers.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                No users with bookings found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Event
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tickets
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBookings.slice(0, 10).map((booking: Booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                                            <div className="text-sm text-gray-500">{booking.user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{booking.event.title}</div>
                                            <div className="text-sm text-gray-500">{booking.event.vendor.vendorName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {booking.numberOfTickets}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatPrice(booking.totalAmount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => setSelectedEvent(booking.event.id)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="View Event Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        No bookings found for the selected period
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Monthly Trends Chart Placeholder */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Booking Trends</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Chart visualization would be implemented here</p>
                        <p className="text-sm text-gray-400">Monthly booking and revenue trends</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 