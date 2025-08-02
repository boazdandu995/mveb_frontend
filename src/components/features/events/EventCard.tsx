'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Event } from '../../../types/types';
import { formatDate, formatPrice } from '../../../lib/utils/utils';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import EventBookingForm from '../bookings/EventBookingForm';
import { useAuth } from '../../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../../../redux/store/hooks';
import { addNotification } from '../../../redux/slices/uiSlice';

interface EventCardProps {
    event: Event;
    className?: string;
}

export default function EventCard({ event, className = '' }: EventCardProps) {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    const handleBookingSuccess = () => {
        setShowBookingForm(false);

        // Show success toast notification
        dispatch(addNotification({
            type: 'success',
            message: 'Event booked successfully! Email confirmation sent.',
            duration: 5000 // 5 seconds
        }));

        // Invalidate and refetch the events data to show updated booking status
        // This will update the UI without a page refresh
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['userEvents'] });
        queryClient.invalidateQueries({ queryKey: ['event', event.id] });
        queryClient.invalidateQueries({ queryKey: ['eventWithUserBooking', event.id] });
    };

    const handleBookNow = () => {
        if (!user) {
            // Redirect to login page if user is not authenticated
            router.push('/auth/login?redirect=/events/' + event.id);
            return;
        }

        // If authenticated, show booking form
        setShowBookingForm(true);
    };

    return (
        <>
            <div className={`block group h-full ${className}`}>
                <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative h-32 bg-gray-200 overflow-hidden">
                        <img
                            src={event.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop'}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                // Fallback to default image if the original image fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop';
                            }}
                        />
                        {event.status === 'pending' && (
                            <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                Pending
                            </div>
                        )}
                        {event.status === 'rejected' && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                Rejected
                            </div>
                        )}
                    </div>

                    <div className="card-content-compact flex-1 flex flex-col">
                        <h3 className="card-title text-base mb-2 group-hover:text-blue-600 transition-colors">
                            {event.title}
                        </h3>

                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                            {event.description}
                        </p>

                        <div className="space-y-1 text-xs text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(event.date)}</span>
                            </div>

                            <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{event.location}</span>
                            </div>

                            <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{event.availableTickets} tickets left</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-blue-600">
                                {formatPrice(event.ticketPrice || 0)}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                {event.category}
                            </span>
                        </div>

                        <div className="text-xs text-gray-500 mb-3">
                            by {event.vendor.vendorName}
                        </div>

                        <div className="flex gap-2 mt-auto">
                            <Link
                                href={`/events/${event.id}`}
                                className="btn btn-outline text-xs h-8 px-3 flex-1"
                            >
                                View Details
                            </Link>
                            {event.userHasBooked ? (
                                <button
                                    className="btn btn-success text-xs h-8 px-3 flex-1"
                                    disabled
                                >
                                    ✓ Booked
                                </button>
                            ) : user && (user.role === 'vendor' || user.role === 'admin') ? (
                                // Hide booking button for vendors and admins
                                null
                            ) : (
                                <button
                                    className="btn btn-primary text-xs h-8 px-3 flex-1"
                                    onClick={handleBookNow}
                                    disabled={event.status !== 'approved'}
                                >
                                    {event.status === 'approved'
                                        ? 'Book Now'
                                        : 'Not Available'
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showBookingForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <EventBookingForm
                        event={event}
                        onClose={() => setShowBookingForm(false)}
                        onSuccess={handleBookingSuccess}
                    />
                </div>
            )}
        </>
    );
} 