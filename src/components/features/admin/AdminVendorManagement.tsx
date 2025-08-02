'use client';

import { useState } from 'react';
import { Building, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { useVendors, useVerifyVendor } from '../../../hooks/common/useVendors';
import { useAppDispatch } from '../../../redux/store/hooks';
import { addNotification } from '../../../redux/slices/uiSlice';
import { Vendor } from '../../../types/types';

interface AdminVendor extends Vendor {
    status?: 'pending' | 'verified' | 'rejected';
    verifiedAt?: string;
}

interface AdminVendorManagementProps {
    onVendorUpdate: () => void;
}

export default function AdminVendorManagement({ onVendorUpdate }: AdminVendorManagementProps) {
    const [selectedVendor, setSelectedVendor] = useState<AdminVendor | null>(null);
    const [verificationNotes, setVerificationNotes] = useState('');
    const dispatch = useAppDispatch();

    // Use React Query hooks
    const { data: vendors = [], isLoading, error, refetch } = useVendors();
    const verifyVendorMutation = useVerifyVendor();

    const handleVerifyVendor = async (vendorId: number, status: 'verified' | 'rejected') => {
        try {
            await verifyVendorMutation.mutateAsync({
                id: vendorId,
                data: { status, notes: verificationNotes }
            });
            setSelectedVendor(null);
            setVerificationNotes('');
            onVendorUpdate();
            dispatch(addNotification({
                type: 'success',
                message: `Vendor ${status} successfully!`,
                duration: 5000
            }));
        } catch (error) {
            console.error('Failed to update vendor status:', error);
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to update vendor status. Please try again.',
                duration: 5000
            }));
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
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
                <p className="mt-2 text-gray-600">Loading vendors...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Failed to load vendors. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Vendor Management</h2>
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
                {vendors.map((vendor: AdminVendor) => (
                    <div key={vendor.id} className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Building className="h-5 w-5 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-900">{vendor.vendorName}</h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vendor.status || 'pending')}`}>
                                        {vendor.status || 'pending'}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-3">{vendor.description}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div>
                                        <span className="font-medium">Contact:</span> {vendor.user.name} ({vendor.user.email})
                                    </div>
                                    <div>
                                        <span className="font-medium">Registered:</span> {new Date(vendor.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {vendor.verifiedAt && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        <span className="font-medium">Verified:</span> {new Date(vendor.verifiedAt).toLocaleDateString()}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                {getStatusIcon(vendor.status || 'pending')}

                                {(vendor.status || 'pending') === 'pending' && (
                                    <button
                                        onClick={() => setSelectedVendor(vendor)}
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

            {selectedVendor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Review Vendor: {selectedVendor.vendorName}
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Notes (Optional)
                            </label>
                            <textarea
                                value={verificationNotes}
                                onChange={(e) => setVerificationNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Add any notes about the verification decision..."
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setSelectedVendor(null)}
                                disabled={verifyVendorMutation.isPending}
                                className="flex-1 btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleVerifyVendor(selectedVendor.id, 'rejected')}
                                disabled={verifyVendorMutation.isPending}
                                className="flex-1 btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
                            >
                                {verifyVendorMutation.isPending ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                                onClick={() => handleVerifyVendor(selectedVendor.id, 'verified')}
                                disabled={verifyVendorMutation.isPending}
                                className="flex-1 btn btn-primary"
                            >
                                {verifyVendorMutation.isPending ? 'Processing...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 