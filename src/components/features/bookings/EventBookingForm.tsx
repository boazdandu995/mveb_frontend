'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Calendar, MapPin, Users, DollarSign, CreditCard } from 'lucide-react';
import { apiRequest } from '../../../lib/api/apiUtils';
import { useAppDispatch } from '../../../redux/store/hooks';
import { addNotification } from '../../../redux/slices/uiSlice';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { BookingSchema, initialBookingValues } from '../../../lib/utils/validations';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    availableTickets: number;
    ticketPrice: number;
    vendor: {
        vendorName: string;
    };
}

interface EventBookingFormProps {
    event: Event;
    onClose: () => void;
    onSuccess: () => void;
}

interface BookingFormData {
    numberOfTickets: number;
    bookingDate: string;
}

export default function EventBookingForm({ event, onClose, onSuccess }: EventBookingFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const handleSubmit = async (values: BookingFormData, { setSubmitting }: any) => {
        setLoading(true);
        setError('');

        // Check if user is authenticated
        if (!isAuthenticated || !user) {
            setError('Please log in to book this event.');
            setLoading(false);
            setSubmitting(false);
            return;
        }

        try {
            const totalAmount = event.ticketPrice * values.numberOfTickets;
            const bookingPayload = {
                eventId: event.id,
                numberOfTickets: values.numberOfTickets,
                totalAmount: totalAmount,
                ...(values.bookingDate && { bookingDate: values.bookingDate }),
            };

            console.log('🔍 Sending booking request:', bookingPayload);
            console.log('🔍 User authenticated:', isAuthenticated);
            console.log('🔍 User:', user);

            const data = await apiRequest('/bookings', {
                method: 'POST',
                body: JSON.stringify(bookingPayload),
            });

            console.log('✅ Booking successful:', data);

            // Skip payment step and go directly to success
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Booking error:', error);

            // Handle specific authentication errors
            if (error.message?.includes('Authentication failed') ||
                error.message?.includes('Unauthorized') ||
                error.message?.includes('401')) {
                const errorMessage = 'Your session has expired. Please log in again.';
                setError(errorMessage);
                dispatch(addNotification({
                    type: 'error',
                    message: errorMessage,
                    duration: 5000
                }));
            } else {
                const errorMessage = error.message || 'Failed to create booking. Please try again.';
                setError(errorMessage);
                dispatch(addNotification({
                    type: 'error',
                    message: errorMessage,
                    duration: 5000
                }));
            }
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const handleLoginRedirect = () => {
        router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Book Event</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Event Details */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {event.location}
                            </div>
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                {event.availableTickets} tickets available
                            </div>
                            <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-2" />
                                ${event.ticketPrice} per ticket
                            </div>
                        </div>
                    </div>

                    {!isAuthenticated ? (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Please log in to book this event</p>
                            <button
                                onClick={handleLoginRedirect}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Log In to Book
                            </button>
                        </div>
                    ) : (
                        <Formik
                            initialValues={initialBookingValues}
                            validationSchema={BookingSchema}
                            onSubmit={handleSubmit}
                            context={{ availableTickets: event.availableTickets }}
                        >
                            {({ values, errors, touched, setFieldValue, isSubmitting }) => {
                                const totalAmount = event.ticketPrice * values.numberOfTickets;

                                return (
                                    <Form className="space-y-4">
                                        {error && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                                {error}
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="numberOfTickets" className="block text-sm font-medium text-gray-700 mb-2">
                                                Number of Tickets
                                            </label>
                                            <Field
                                                type="number"
                                                id="numberOfTickets"
                                                name="numberOfTickets"
                                                min="1"
                                                max={event.availableTickets}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.numberOfTickets && touched.numberOfTickets ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = parseInt(e.target.value) || 1;
                                                    setFieldValue('numberOfTickets', Math.min(value, event.availableTickets));
                                                }}
                                            />
                                            <ErrorMessage name="numberOfTickets" component="p" className="mt-1 text-sm text-red-600" />
                                        </div>

                                        <div>
                                            <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-2">
                                                Booking Date
                                            </label>
                                            <Field
                                                type="date"
                                                id="bookingDate"
                                                name="bookingDate"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bookingDate && touched.bookingDate ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                            />
                                            <ErrorMessage name="bookingDate" component="p" className="mt-1 text-sm text-red-600" />
                                        </div>

                                        {/* Total Amount */}
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                                                <span className="text-lg font-semibold text-blue-600">
                                                    ${totalAmount.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading || isSubmitting}
                                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Processing...' : 'Confirm Booking'}
                                            </button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    )}
                </div>
            </div>
        </div>
    );
} 