'use client';

import { DashboardData } from '../../../types/types';
import { formatPrice, formatDate } from '../../../lib/utils/utils';
import {
    TrendingUp,
    Users,
    DollarSign,
    Calendar,
    BarChart3,
    Loader2,
    ArrowUpRight,
    ArrowDownRight,
    Minus
} from 'lucide-react';

interface VendorAnalyticsProps {
    data: DashboardData;
    isLoading?: boolean;
}

export default function VendorAnalytics({ data, isLoading }: VendorAnalyticsProps) {
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

    const { monthlyStats = [], topEvents = [], bookingTrends = [] } = data;

    const calculateGrowth = (current: number, previous: number): { value: number; isPositive: boolean } => {
        if (previous === 0) return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
        const growth = ((current - previous) / previous) * 100;
        return { value: Math.abs(growth), isPositive: growth >= 0 };
    };

    const getGrowthIcon = (isPositive: boolean) => {
        if (isPositive) {
            return <ArrowUpRight className="h-4 w-4 text-green-500" />;
        }
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    };

    const getGrowthColor = (isPositive: boolean) => {
        return isPositive ? 'text-green-600' : 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Monthly Performance Overview */}
            {monthlyStats.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Performance (Last 6 Months)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Events Trend */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-4">Events Created</h4>
                            <div className="space-y-3">
                                {monthlyStats.map((stat, index) => {
                                    const previous = index > 0 ? monthlyStats[index - 1].events : 0;
                                    const growth = calculateGrowth(stat.events, previous);

                                    return (
                                        <div key={stat.month} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{stat.month}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium">{stat.events}</span>
                                                {index > 0 && (
                                                    <div className={`flex items-center text-xs ${getGrowthColor(growth.isPositive)}`}>
                                                        {getGrowthIcon(growth.isPositive)}
                                                        <span>{growth.value.toFixed(1)}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bookings Trend */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-4">Bookings Received</h4>
                            <div className="space-y-3">
                                {monthlyStats.map((stat, index) => {
                                    const previous = index > 0 ? monthlyStats[index - 1].bookings : 0;
                                    const growth = calculateGrowth(stat.bookings, previous);

                                    return (
                                        <div key={stat.month} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{stat.month}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium">{stat.bookings}</span>
                                                {index > 0 && (
                                                    <div className={`flex items-center text-xs ${getGrowthColor(growth.isPositive)}`}>
                                                        {getGrowthIcon(growth.isPositive)}
                                                        <span>{growth.value.toFixed(1)}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Revenue Trend */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-4">Revenue Generated</h4>
                            <div className="space-y-3">
                                {monthlyStats.map((stat, index) => {
                                    const previous = index > 0 ? monthlyStats[index - 1].revenue : 0;
                                    const growth = calculateGrowth(stat.revenue, previous);

                                    return (
                                        <div key={stat.month} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{stat.month}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium">{formatPrice(stat.revenue)}</span>
                                                {index > 0 && (
                                                    <div className={`flex items-center text-xs ${getGrowthColor(growth.isPositive)}`}>
                                                        {getGrowthIcon(growth.isPositive)}
                                                        <span>{growth.value.toFixed(1)}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Performing Events */}
            {topEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Top Performing Events</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {topEvents.map((event, index) => (
                            <div key={event.event_id} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{event.event_title}</h4>
                                            <p className="text-sm text-gray-500">
                                                {formatPrice(event.event_ticketPrice)} per ticket
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {event.bookingCount} bookings
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatPrice(parseFloat(event.totalRevenue))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Booking Trends Chart */}
            {bookingTrends.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Trends (Last 30 Days)</h3>
                    <div className="h-64 flex items-end space-x-1">
                        {bookingTrends.map((trend, index) => {
                            const maxBookings = Math.max(...bookingTrends.map(t => t.bookings));
                            const height = maxBookings > 0 ? (trend.bookings / maxBookings) * 100 : 0;

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-green-500 rounded-t"
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
                        <p>
                            Total bookings in last 30 days: {bookingTrends.reduce((sum, t) => sum + t.bookings, 0)}
                        </p>
                    </div>
                </div>
            )}

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Events Created:</span>
                            <span className="text-sm font-medium">{data.stats?.totalEvents || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Active Events:</span>
                            <span className="text-sm font-medium text-green-600">{data.stats?.approvedEvents || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Pending Review:</span>
                            <span className="text-sm font-medium text-yellow-600">{data.stats?.pendingEvents || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Rejected Events:</span>
                            <span className="text-sm font-medium text-red-600">{data.stats?.rejectedEvents || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Revenue:</span>
                            <span className="text-sm font-medium">{formatPrice(data.stats?.totalRevenue || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Bookings:</span>
                            <span className="text-sm font-medium">{data.stats?.totalBookings || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Average Revenue per Booking:</span>
                            <span className="text-sm font-medium">
                                {data.stats?.totalBookings && data.stats?.totalRevenue
                                    ? formatPrice(data.stats.totalRevenue / data.stats.totalBookings)
                                    : '$0.00'
                                }
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Conversion Rate:</span>
                            <span className="text-sm font-medium">
                                {data.stats?.totalEvents && data.stats?.totalBookings
                                    ? ((data.stats.totalBookings / data.stats.totalEvents) * 100).toFixed(1)
                                    : '0.0'
                                }%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            {data.recentEvents && data.recentEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {data.recentEvents.slice(0, 5).map((event) => (
                            <div key={event.id} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(event.date)} • {event.location}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 