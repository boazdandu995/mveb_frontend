'use client';

import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { Shield, Mail, Calendar, Edit, Save, X, MapPin, Phone, Crown } from 'lucide-react';

export default function AdminProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+1 (555) 123-4567',
        role: 'System Administrator',
        department: 'Platform Management',
        bio: 'Experienced system administrator with expertise in platform management and user support.',
        location: 'San Francisco, CA',
        permissions: ['user_management', 'vendor_management', 'event_moderation', 'system_settings'],
        emergencyContact: {
            name: 'Jane Smith',
            phone: '+1 (555) 987-6543',
            relationship: 'Supervisor',
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
                        <p className="text-gray-600">Manage your administrative account information</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="btn btn-outline flex items-center space-x-2"
                    >
                        {isEditing ? (
                            <>
                                <X className="h-4 w-4" />
                                <span>Cancel</span>
                            </>
                        ) : (
                            <>
                                <Edit className="h-4 w-4" />
                                <span>Edit Profile</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Administrative Information</h2>
                                <p className="card-description">Your administrative details and contact information</p>
                            </div>
                            <div className="card-content">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Department
                                            </label>
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="input"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="input"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            rows={3}
                                            className="input resize-none"
                                        />
                                    </div>
                                    {isEditing && (
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="btn btn-outline"
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Emergency Contact</h2>
                                <p className="card-description">Emergency contact information for administrative purposes</p>
                            </div>
                            <div className="card-content">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emergencyContact.name}
                                            disabled={!isEditing}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.emergencyContact.phone}
                                            disabled={!isEditing}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Relationship
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emergencyContact.relationship}
                                            disabled={!isEditing}
                                            className="input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Summary */}
                    <div className="space-y-6">
                        {/* Admin Card */}
                        <div className="card">
                            <div className="card-content text-center">
                                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Crown className="h-12 w-12 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{formData.name}</h3>
                                <p className="text-purple-600 font-medium mb-2">{formData.role}</p>
                                <p className="text-gray-600 mb-4">{formData.department}</p>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{formData.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Phone className="h-4 w-4" />
                                        <span>{formData.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{formData.location}</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Admin since {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title text-lg">System Permissions</h3>
                            </div>
                            <div className="card-content">
                                <div className="space-y-2">
                                    {formData.permissions.map((permission) => (
                                        <div key={permission} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm text-gray-700">
                                                {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Admin Stats */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title text-lg">Administrative Stats</h3>
                            </div>
                            <div className="card-content space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Users Managed</span>
                                    <span className="font-semibold">1,247</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Vendors Approved</span>
                                    <span className="font-semibold">89</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Events Moderated</span>
                                    <span className="font-semibold">456</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Support Tickets</span>
                                    <span className="font-semibold">23</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title text-lg">Quick Actions</h3>
                            </div>
                            <div className="card-content space-y-2">
                                <button className="w-full btn btn-outline text-left">
                                    View System Logs
                                </button>
                                <button className="w-full btn btn-outline text-left">
                                    Manage Users
                                </button>
                                <button className="w-full btn btn-outline text-left">
                                    Platform Settings
                                </button>
                                <button className="w-full btn btn-outline text-left text-red-600 hover:text-red-700">
                                    Emergency Mode
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 