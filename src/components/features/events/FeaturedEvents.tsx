import React from 'react';
import { useFeaturedEvents, useUserEvents } from '../../../hooks/common/useEvents';
import { useAuth } from '../../../context/AuthContext';
import { Event } from '../../../types/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FeaturedEvents: React.FC = () => {
    const { data: featuredEvents, isLoading, error } = useFeaturedEvents();
    const { user } = useAuth();
    const { data: userEvents = [] } = useUserEvents();
    const router = useRouter();

    console.log('🔍 FeaturedEvents - isLoading:', isLoading);
    console.log('🔍 FeaturedEvents - user:', user);
    console.log('🔍 FeaturedEvents - featuredEvents count:', featuredEvents?.length || 0);

    const handleBookNow = (eventId: number) => {
        if (!user) {
            // Redirect to login page if user is not authenticated
            router.push('/auth/login?redirect=/events/' + eventId);
            return;
        }

        // If authenticated, redirect to event details page
        router.push(`/events/${eventId}`);
    };

    if (isLoading) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Latest Events</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Latest Events</h2>
                    <div className="text-center text-red-600">
                        Failed to load latest events. Please try again later.
                    </div>
                </div>
            </section>
        );
    }

    if (!featuredEvents || featuredEvents.length === 0) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Latest Events</h2>
                    <div className="text-center text-gray-600">
                        No events available at the moment.
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Latest Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    {featuredEvents.map((event: Event) => {
                        const userEvent = userEvents.find(ue => ue.id === event.id);
                        const eventWithBooking = userEvent ? { ...event, userHasBooked: userEvent.userHasBooked } : event;

                        return (
                            <div key={event.id} className="block group">
                                <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative h-32 bg-gray-200 overflow-hidden">
                                        <img
                                            src={event.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop'}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
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
                                    <div className="card-content-compact">
                                        <h3 className="card-title text-base mb-2 group-hover:text-blue-600 transition-colors">
                                            {event.title}
                                        </h3>

                                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                            {event.description}
                                        </p>

                                        <div className="space-y-1 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center space-x-1">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="truncate">{event.location}</span>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                                <span>{event.availableTickets} tickets left</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-blue-600">
                                                ${event.ticketPrice || 0}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                                {event.category}
                                            </span>
                                        </div>

                                        <div className="text-xs text-gray-500 mb-3">
                                            by {event.vendor.vendorName}
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                href={`/events/${event.id}`}
                                                className="btn btn-outline text-xs h-8 px-3 flex-1"
                                            >
                                                View Details
                                            </Link>
                                            {eventWithBooking.userHasBooked ? (
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
                                                    onClick={() => handleBookNow(event.id)}
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
                        );
                    })}
                </div>
                <div className="text-center mt-8">
                    <Link
                        href="/events"
                        className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-200"
                    >
                        View All Events
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedEvents; 