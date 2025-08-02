'use client';

import { useState } from 'react';
import { PieChart, TrendingUp, DollarSign, Building, Calendar, Filter, Download, BarChart3 } from 'lucide-react';
import { useAdminRevenueAnalytics } from '../../../hooks/api/useBookingsApi';
import { formatPrice } from '../../../lib/utils/utils';

interface RevenueAnalytics {
    totalRevenue: number;
    platformRevenue: number;
    vendorRevenue: number;
    averageRevenuePerBooking: number;
    revenueGrowth: number;
    topVendors: Array<{
        vendorId: number;
        vendorName: string;
        revenue: number;
        bookingCount: number;
        eventCount: number;
    }>;
    revenueByCategory: Array<{
        category: string;
        revenue: number;
        bookingCount: number;
    }>;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
        bookings: number;
        growth: number;
    }>;
    dailyRevenue: Array<{
        date: string;
        revenue: number;
        bookings: number;
    }>;
}

export default function AdminRevenueAnalytics() {
    const [dateFilter, setDateFilter] = useState<string>('30');
    const [selectedVendor, setSelectedVendor] = useState<number | null>(null);

    // Use React Query hooks
    const { data: analytics, isLoading, error } = useAdminRevenueAnalytics();

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading revenue analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Failed to load revenue analytics. Please try again.
            </div>
        );
    }

    const analyticsData = analytics || {
        totalRevenue: 0,
        platformRevenue: 0,
        vendorRevenue: 0,
        averageRevenuePerBooking: 0,
        revenueGrowth: 0,
        topVendors: [],
        revenueByCategory: [],
        monthlyRevenue: [],
        dailyRevenue: []
    };

    const getRevenueGrowthColor = (growth: number) => {
        if (growth > 0) return 'text-green-600';
        if (growth < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getRevenueGrowthIcon = (growth: number) => {
        if (growth > 0) return <TrendingUp className="h-3 w-3 inline mr-1" />;
        if (growth < 0) return <TrendingUp className="h-3 w-3 inline mr-1 transform rotate-180" />;
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Revenue Analytics</h2>
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
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(analyticsData.totalRevenue)}</p>
                            <p className={`text-xs mt-1 ${getRevenueGrowthColor(analyticsData.revenueGrowth)}`}>
                                {getRevenueGrowthIcon(analyticsData.revenueGrowth)}
                                {analyticsData.revenueGrowth > 0 ? '+' : ''}{analyticsData.revenueGrowth.toFixed(1)}% vs last period
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(analyticsData.platformRevenue)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <PieChart className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Vendor Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(analyticsData.vendorRevenue)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg. Revenue/Booking</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(analyticsData.averageRevenuePerBooking)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Vendors by Revenue */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Vendors by Revenue</h3>
                    <div className="space-y-3">
                        {analyticsData.topVendors.slice(0, 5).map((vendor: {
                            vendorId: number;
                            vendorName: string;
                            revenue: number;
                            bookingCount: number;
                            eventCount: number;
                        }, index: number) => (
                            <div key={vendor.vendorId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 mr-3">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{vendor.vendorName}</p>
                                        <p className="text-sm text-gray-500">{vendor.eventCount} events, {vendor.bookingCount} bookings</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{formatPrice(vendor.revenue)}</p>
                                    <p className="text-sm text-gray-500">Revenue</p>
                                </div>
                            </div>
                        ))}
                        {analyticsData.topVendors.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                No vendors with revenue found
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue by Category */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Category</h3>
                    <div className="space-y-3">
                        {analyticsData.revenueByCategory.slice(0, 5).map((category: {
                            category: string;
                            revenue: number;
                            bookingCount: number;
                        }, index: number) => (
                            <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 mr-3">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{category.category}</p>
                                        <p className="text-sm text-gray-500">{category.bookingCount} bookings</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{formatPrice(category.revenue)}</p>
                                    <p className="text-sm text-gray-500">Revenue</p>
                                </div>
                            </div>
                        ))}
                        {analyticsData.revenueByCategory.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                No revenue by category found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Monthly Revenue Trends */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trends</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Month
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Revenue
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bookings
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Growth
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {analyticsData.monthlyRevenue.slice(0, 12).map((month: {
                                month: string;
                                revenue: number;
                                bookings: number;
                                growth: number;
                            }) => (
                                <tr key={month.month} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {month.month}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatPrice(month.revenue)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {month.bookings}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`${getRevenueGrowthColor(month.growth)}`}>
                                            {getRevenueGrowthIcon(month.growth)}
                                            {month.growth > 0 ? '+' : ''}{month.growth.toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {analyticsData.monthlyRevenue.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        No monthly revenue data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Revenue Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Revenue trend chart</p>
                            <p className="text-sm text-gray-400">Monthly revenue visualization</p>
                        </div>
                    </div>
                </div>

                {/* Revenue Distribution Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Distribution</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Revenue distribution chart</p>
                            <p className="text-sm text-gray-400">Platform vs vendor revenue split</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Platform Commission</h4>
                        <p className="text-sm text-gray-600">10% commission on all bookings</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Growth Rate</h4>
                        <p className="text-sm text-gray-600">{analyticsData.revenueGrowth > 0 ? '+' : ''}{analyticsData.revenueGrowth.toFixed(1)}% this month</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Vendor Performance</h4>
                        <p className="text-sm text-gray-600">{analyticsData.topVendors.length} active vendors</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 