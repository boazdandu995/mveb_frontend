'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Event } from '../../../types/types';
import { formatDate, formatDateTime, formatPrice } from '../../../lib/utils/utils';
import { Calendar, MapPin, Clock, Users, Star, Share2, Heart, ArrowLeft, User, Shield, Car, Utensils, Wifi, Loader2 } from 'lucide-react';
import { useEventWithUserBooking } from '../../../hooks/common/useEvents';
import EventBookingForm from '../../../components/features/bookings/EventBookingForm';
import NotificationModal from '../../../components/shared/NotificationModal';
import { useQueryClient } from '@tanstack/react-query';

interface EventDetailClientProps {
    event: Event;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
    const router = useRouter();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [quantity, setQuantity] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState({ title: '', message: '', type: 'info' as 'success' | 'error' | 'warning' | 'info' });

    // Get user booking status for this event
    const { data: eventWithBooking } = useEventWithUserBooking(event.id);

    // Merge event with booking status if available
    const eventWithUserStatus = eventWithBooking ? { ...event, userHasBooked: eventWithBooking.userHasBooked } : event;

    const handleBooking = async () => {
        if (!user) {
            // Redirect to login page with current page as redirect parameter
            router.replace(`/auth/login?redirect=/events/${event.id}`);
            return;
        }

        setShowBookingForm(true);
    };

    const handleBookingSuccess = () => {
        setShowBookingForm(false);

        // Show success toast notification
        setNotificationData({
            title: 'Success',
            message: 'Event booked successfully! Email confirmation sent.',
            type: 'success'
        });
        setShowNotification(true);

        // Invalidate and refetch the event data to show updated booking status
        // This will update the UI without a page refresh
        queryClient.invalidateQueries({ queryKey: ['event', event.id] });
        queryClient.invalidateQueries({ queryKey: ['eventWithUserBooking', event.id] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event?.title,
                text: event?.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            setNotificationData({
                title: 'Success',
                message: 'Link copied to clipboard!',
                type: 'success'
            });
            setShowNotification(true);
        }
    };

    const getSimilarEvents = () => {
        // This would typically fetch similar events from the API
        // For now, we'll return an empty array and handle this in the UI
        return [];
    };

    const similarEvents: Event[] = getSimilarEvents();

    const getAmenityIcon = (amenity: string) => {
        switch (amenity.toLowerCase()) {
            case 'parking':
                return <Car className="h-5 w-5" />;
            case 'food':
                return <Utensils className="h-5 w-5" />;
            case 'wifi':
                return <Wifi className="h-5 w-5" />;
            default:
                return <Shield className="h-5 w-5" />;
        }
    };

    const getAmenityLabel = (amenity: string) => {
        return amenity.charAt(0).toUpperCase() + amenity.slice(1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to Events</span>
                        </button>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleShare}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Share2 className="h-5 w-5" />
                                <span>Share</span>
                            </button>
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`flex items-center space-x-2 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                                <span>{isFavorite ? 'Saved' : 'Save'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event Image */}
                        <div className="relative h-96 rounded-xl overflow-hidden">
                            <img
                                src={event.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop'}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop';
                                }}
                            />
                            <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {event.availableTickets > 0 ? `${event.availableTickets} tickets left` : 'Sold Out'}
                            </div>
                            <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {event.category}
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="font-medium text-gray-900">{formatDateTime(event.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium text-gray-900">{event.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Users className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Organizer</p>
                                        <p className="font-medium text-gray-900">{event.vendor.vendorName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-medium text-gray-900">3 hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Event</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                            </div>

                            {/* Amenities */}
                            {event.amenities && event.amenities.length > 0 && (
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {event.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                {getAmenityIcon(amenity)}
                                                <span className="text-gray-700">{getAmenityLabel(amenity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Organizer Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Organizer</h3>
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="h-8 w-8 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{event.vendor.vendorName}</h4>
                                    <p className="text-gray-600 text-sm mb-2">{event.vendor.description || 'Professional event organizer'}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>⭐ 4.8 (120 reviews)</span>
                                        <span>•</span>
                                        <span>50+ events hosted</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Similar Events */}
                        {similarEvents.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Events</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {similarEvents.map((similarEvent) => (
                                        <div key={similarEvent.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="relative h-32 mb-3">
                                                <img
                                                    src={similarEvent.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop'}
                                                    alt={similarEvent.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop';
                                                    }}
                                                />
                                                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                                    available
                                                </div>
                                                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                                                    {similarEvent.category}
                                                </div>
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-2">{similarEvent.title}</h4>
                                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{formatDate(similarEvent.date)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="truncate">{similarEvent.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-3 w-3" />
                                                    <span>{similarEvent.vendor.vendorName}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-lg font-semibold text-blue-600">
                                                    {similarEvent.ticketPrice > 0 ? formatPrice(similarEvent.ticketPrice) : 'Free'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => router.replace(`/events/${similarEvent.id}`)}
                                                    className="flex-1 btn btn-outline text-sm py-2"
                                                >
                                                    View Details
                                                </button>
                                                {user && (user.role === 'vendor' || user.role === 'admin') ? (
                                                    null
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (!user) {
                                                                router.replace(`/auth/login?redirect=/events/${similarEvent.id}`);
                                                                return;
                                                            }
                                                            router.replace(`/events/${similarEvent.id}`);
                                                        }}
                                                        className="flex-1 btn btn-primary text-sm py-2"
                                                    >
                                                        Book Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 border">
                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {event.ticketPrice > 0 ? formatPrice(event.ticketPrice) : 'Free'}
                                    </div>
                                    <p className="text-gray-600">per ticket</p>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Available Tickets</span>
                                        <span className="font-medium">{event.availableTickets}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Event Date</span>
                                        <span className="font-medium">{formatDate(event.date)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Category</span>
                                        <span className="font-medium">{event.category}</span>
                                    </div>
                                </div>

                                {eventWithUserStatus.userHasBooked ? (
                                    <div className="text-center">
                                        <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4">
                                            <p className="font-medium">✓ You're booked for this event!</p>
                                            <p className="text-sm">Check your email for confirmation details.</p>
                                        </div>
                                        <button
                                            onClick={() => router.replace('/dashboard/user')}
                                            className="w-full btn btn-outline"
                                        >
                                            View My Bookings
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                                Number of Tickets:
                                            </label>
                                            <select
                                                id="quantity"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                            >
                                                {[...Array(Math.min(10, event.availableTickets))].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-lg font-semibold text-gray-900 mb-2">
                                                Total: {event.ticketPrice > 0 ? formatPrice(event.ticketPrice * quantity) : 'Free'}
                                            </div>
                                        </div>

                                        {user && (user.role === 'vendor' || user.role === 'admin') ? (
                                            <div className="text-center text-gray-500 text-sm">
                                                Vendors and admins cannot book events
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleBooking}
                                                disabled={event.availableTickets === 0 || bookingLoading}
                                                className={`w-full btn btn-primary ${event.availableTickets === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {bookingLoading ? (
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span>Processing...</span>
                                                    </div>
                                                ) : event.availableTickets === 0 ? (
                                                    'Sold Out'
                                                ) : (
                                                    'Book Now'
                                                )}
                                            </button>
                                        )}

                                        <p className="text-xs text-gray-500 text-center">
                                            Secure booking powered by our trusted payment system
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showBookingForm && event && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <EventBookingForm
                        event={event}
                        onClose={() => setShowBookingForm(false)}
                        onSuccess={handleBookingSuccess}
                    />
                </div>
            )}

            <NotificationModal
                isOpen={showNotification}
                onClose={() => setShowNotification(false)}
                title={notificationData.title}
                message={notificationData.message}
                type={notificationData.type}
            />
        </div>
    );
} 