'use client';

import { useState } from 'react';
import { Users, Eye, Edit, Trash2, Shield, UserCheck, UserX, Search, Filter, MoreVertical } from 'lucide-react';
import { useAdminUsers, useUpdateUserRole, useToggleUserActive, useDeleteUser } from '../../../hooks/api/useUsersApi';
import { useAppDispatch } from '../../../redux/store/hooks';
import { addNotification } from '../../../redux/slices/uiSlice';
import { User } from '../../../types/types';

interface AdminUser extends User {
    vendor?: {
        id: number;
        vendorName: string;
    };
}

interface AdminUserManagementProps {
    onUserUpdate: () => void;
}

export default function AdminUserManagement({ onUserUpdate }: AdminUserManagementProps) {
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const dispatch = useAppDispatch();

    // Use React Query hooks
    const { data: users = [], isLoading, error, refetch } = useAdminUsers();
    const updateUserRoleMutation = useUpdateUserRole();
    const toggleUserActiveMutation = useToggleUserActive();
    const deleteUserMutation = useDeleteUser();

    const handleUpdateUserRole = async (userId: number, role: 'user' | 'vendor' | 'admin') => {
        try {
            await updateUserRoleMutation.mutateAsync({ id: userId, role });
            setSelectedUser(null);
            onUserUpdate();
            dispatch(addNotification({
                type: 'success',
                message: `User role updated to ${role} successfully!`,
                duration: 5000
            }));
        } catch (error) {
            console.error('Failed to update user role:', error);
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to update user role. Please try again.',
                duration: 5000
            }));
        }
    };

    const handleToggleUserActive = async (userId: number) => {
        try {
            await toggleUserActiveMutation.mutateAsync(userId);
            onUserUpdate();
            dispatch(addNotification({
                type: 'success',
                message: 'User status updated successfully!',
                duration: 5000
            }));
        } catch (error) {
            console.error('Failed to toggle user status:', error);
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to update user status. Please try again.',
                duration: 5000
            }));
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteUserMutation.mutateAsync(userId);
            onUserUpdate();
            dispatch(addNotification({
                type: 'success',
                message: 'User deleted successfully!',
                duration: 5000
            }));
        } catch (error) {
            console.error('Failed to delete user:', error);
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to delete user. Please try again.',
                duration: 5000
            }));
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'vendor':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && user.isActive) ||
            (statusFilter === 'inactive' && !user.isActive);

        return matchesSearch && matchesRole && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Failed to load users. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
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

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Users</option>
                        <option value="vendor">Vendors</option>
                        <option value="admin">Admins</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <div className="text-sm text-gray-600 flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        {filteredUsers.length} of {users.length} users
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user: AdminUser) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-gray-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.email}
                                                </div>
                                                {user.vendor && (
                                                    <div className="text-xs text-purple-600">
                                                        Vendor: {user.vendor.vendorName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.isActive)}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleUserActive(user.id)}
                                                disabled={toggleUserActiveMutation.isPending}
                                                className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                                title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                            >
                                                {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            User Details: {selectedUser.name}
                        </h3>

                        <div className="mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Name:</span> {selectedUser.name}</div>
                                    <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                                    <div><span className="font-medium">Role:</span> {selectedUser.role}</div>
                                    <div><span className="font-medium">Status:</span> {selectedUser.isActive ? 'Active' : 'Inactive'}</div>
                                    <div><span className="font-medium">Joined:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                                    {selectedUser.vendor && (
                                        <div><span className="font-medium">Vendor:</span> {selectedUser.vendor.vendorName}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-2">Change Role</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {(['user', 'vendor', 'admin'] as const).map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => handleUpdateUserRole(selectedUser.id, role)}
                                        disabled={updateUserRoleMutation.isPending || selectedUser.role === role}
                                        className={`px-3 py-2 text-sm rounded-lg border ${selectedUser.role === role
                                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setSelectedUser(null)}
                                disabled={updateUserRoleMutation.isPending}
                                className="flex-1 btn btn-outline"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleDeleteUser(selectedUser.id)}
                                disabled={deleteUserMutation.isPending}
                                className="flex-1 btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
                            >
                                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 