'use client';

import { EventAnalytics as EventAnalyticsType } from '../../../types/types';
import { formatPrice, formatDate } from '../../../lib/utils/utils';
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  Loader2,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface EventAnalyticsProps {
  data: EventAnalyticsType;
  isLoading?: boolean;
}

export default function EventAnalytics({ data, isLoading }: EventAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  const { event, stats, recentBookings, bookingTrends } = data;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

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
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {formatPrice(event.ticketPrice)}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {event.availableTickets} available
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(event.status)}
            {getStatusBadge(event.status)}
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Tickets/Booking</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageTicketsPerBooking.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Trends (Last 30 Days)</h3>
        <div className="h-64 flex items-end space-x-1">
          {bookingTrends.map((trend, index) => {
            const maxBookings = Math.max(...bookingTrends.map(t => t.bookings));
            const height = maxBookings > 0 ? (trend.bookings / maxBookings) * 100 : 0;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                />
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                  {trend.date}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          {bookingTrends.length > 0 && (
            <p>
              Total bookings in last 30 days: {bookingTrends.reduce((sum, t) => sum + t.bookings, 0)}
            </p>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No bookings yet for this event.
            </div>
          ) : (
            recentBookings.map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.numberOfTickets} ticket{booking.numberOfTickets !== 1 ? 's' : ''} • {formatDate(booking.bookingDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(booking.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Tickets Sold:</span>
              <span className="text-sm font-medium">{stats.totalTickets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining Tickets:</span>
              <span className="text-sm font-medium">{stats.remainingTickets}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Revenue:</span>
              <span className="text-sm font-medium">{formatPrice(stats.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Revenue per Booking:</span>
              <span className="text-sm font-medium">
                {stats.totalBookings > 0 ? formatPrice(stats.totalRevenue / stats.totalBookings) : '$0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ticket Price:</span>
              <span className="text-sm font-medium">{formatPrice(event.ticketPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Potential Revenue:</span>
              <span className="text-sm font-medium">
                {formatPrice((stats.totalTickets + stats.remainingTickets) * event.ticketPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 