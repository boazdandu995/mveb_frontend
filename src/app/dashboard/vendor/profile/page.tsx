'use client';

import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { Building, Mail, Calendar, Edit, Save, X, MapPin, Phone, Globe } from 'lucide-react';

export default function VendorProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        businessName: user?.name || '',
        email: user?.email || '',
        phone: '+1 (555) 123-4567',
        website: 'https://www.techevents.com',
        description: 'Leading technology event organizer specializing in conferences, workshops, and networking events.',
        location: 'San Francisco, CA',
        businessType: 'Event Organizer',
        founded: '2020',
        specialties: ['Technology', 'Business', 'Networking'],
        socialMedia: {
            linkedin: 'https://linkedin.com/company/techevents',
            twitter: 'https://twitter.com/techevents',
            facebook: 'https://facebook.com/techevents',
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
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
                        <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
                        <p className="text-gray-600">Manage your business information and branding</p>
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
                                <h2 className="card-title">Business Information</h2>
                                <p className="card-description">Your company details and contact information</p>
                            </div>
                            <div className="card-content">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Business Name
                                            </label>
                                            <input
                                                type="text"
                                                name="businessName"
                                                value={formData.businessName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Business Type
                                            </label>
                                            <input
                                                type="text"
                                                name="businessType"
                                                value={formData.businessType}
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
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Founded Year
                                            </label>
                                            <input
                                                type="text"
                                                name="founded"
                                                value={formData.founded}
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
                                            Business Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            rows={4}
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

                        {/* Social Media */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Social Media</h2>
                                <p className="card-description">Connect your social media accounts</p>
                            </div>
                            <div className="card-content">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            LinkedIn
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.socialMedia.linkedin}
                                            disabled={!isEditing}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Twitter
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.socialMedia.twitter}
                                            disabled={!isEditing}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Facebook
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.socialMedia.facebook}
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
                        {/* Business Card */}
                        <div className="card">
                            <div className="card-content text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Building className="h-12 w-12 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{formData.businessName}</h3>
                                <p className="text-gray-600 mb-4">{formData.businessType}</p>
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
                                        <span>Founded {formData.founded}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Stats */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title text-lg">Business Stats</h3>
                            </div>
                            <div className="card-content space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Events</span>
                                    <span className="font-semibold">24</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Bookings</span>
                                    <span className="font-semibold">1,247</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Revenue</span>
                                    <span className="font-semibold">$45,230</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Rating</span>
                                    <span className="font-semibold">4.8/5</span>
                                </div>
                            </div>
                        </div>

                        {/* Specialties */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title text-lg">Specialties</h3>
                            </div>
                            <div className="card-content">
                                <div className="flex flex-wrap gap-2">
                                    {formData.specialties.map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 