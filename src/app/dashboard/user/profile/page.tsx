'use client';

import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react';

export default function UserProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+1 (555) 123-4567',
        bio: 'Event enthusiast who loves discovering new experiences.',
        location: 'San Francisco, CA',
        preferences: {
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: true,
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsEditing(false);
        // In a real app, this would update the user profile
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePreferenceChange = (key: string) => {
        setFormData({
            ...formData,
            preferences: {
                ...formData.preferences,
                [key]: !formData.preferences[key as keyof typeof formData.preferences],
            },
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
                        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                        <p className="text-gray-600">Manage your account information and preferences</p>
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
                                <h2 className="card-title">Basic Information</h2>
                                <p className="card-description">Your personal details and contact information</p>
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

                        {/* Notification Preferences */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Notification Preferences</h2>
                                <p className="card-description">Choose how you want to receive notifications</p>
                            </div>
                            <div className="card-content">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                            <p className="text-sm text-gray-600">Receive booking confirmations and updates via email</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.preferences.emailNotifications}
                                                onChange={() => handlePreferenceChange('emailNotifications')}
                                                disabled={!isEditing}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                                            <p className="text-sm text-gray-600">Receive urgent updates via text message</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.preferences.smsNotifications}
                                                onChange={() => handlePreferenceChange('smsNotifications')}
                                                disabled={!isEditing}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                                            <p className="text-sm text-gray-600">Receive updates about new events and special offers</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.preferences.marketingEmails}
                                                onChange={() => handlePreferenceChange('marketingEmails')}
                                                disabled={!isEditing}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Summary */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="card">
                            <div className="card-content text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="h-12 w-12 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{formData.name}</h3>
                                <p className="text-gray-600 mb-4">{formData.email}</p>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{formData.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title text-lg">Account Actions</h3>
                            </div>
                            <div className="card-content space-y-2">
                                <button className="w-full btn btn-outline text-left">
                                    Change Password
                                </button>
                                <button className="w-full btn btn-outline text-left">
                                    Download My Data
                                </button>
                                <button className="w-full btn btn-outline text-left text-red-600 hover:text-red-700">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 