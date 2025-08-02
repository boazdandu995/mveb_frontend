'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { X, Calendar, MapPin, DollarSign, Users, Image } from 'lucide-react';
import { useCreateEvent, useUpdateEvent } from '../../../hooks/api/useEventsApi';
import { useAppDispatch } from '../../../redux/store/hooks';
import { addNotification } from '../../../redux/slices/uiSlice';
import { EventFormData } from '../../../types/types';
import { EventFormSchema, initialEventFormData } from '../../../lib/utils/validations';

interface EventFormProps {
  event?: EventFormData & { id?: number; status?: string };
  onSuccess?: () => void;
  onCancel?: () => void;
  mode: 'create' | 'edit';
}

const categories = [
  'Music',
  'Technology',
  'Food & Drink',
  'Arts & Culture',
  'Sports',
  'Business',
  'Education',
  'Entertainment',
  'Health & Wellness',
  'Networking'
];

export default function EventForm({ event, onSuccess, onCancel, mode }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const dispatch = useAppDispatch();

  // Prepare initial values
  const getInitialValues = (): EventFormData => {
    if (event) {
      return {
        title: event.title || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        category: event.category || '',
        ticketPrice: event.ticketPrice || 25,
        availableTickets: event.availableTickets || 100,
        image: event.image || '',
      };
    }
    return initialEventFormData;
  };

  const handleSubmit = async (values: EventFormData, { setSubmitting }: any) => {
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await createEventMutation.mutateAsync(values);
        dispatch(addNotification({
          type: 'success',
          message: 'Event created successfully!',
          duration: 5000
        }));
      } else if (event?.id) {
        await updateEventMutation.mutateAsync({ id: event.id, data: values });
        dispatch(addNotification({
          type: 'success',
          message: 'Event updated successfully!',
          duration: 5000
        }));
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving event:', error);
      let errorMessage = mode === 'create' ? 'Failed to create event. Please try again.' : 'Failed to update event. Please try again.';

      // Handle specific backend error messages
      if (error.message?.includes('Cannot update approved events')) {
        errorMessage = 'Cannot update approved events. Please contact admin for changes.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(addNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000
      }));
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {mode === 'create' ? 'Create New Event' : 'Edit Event'}
            </h2>
            {mode === 'edit' && event?.status === 'approved' && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ This event is approved and cannot be modified. Contact admin for changes.
              </p>
            )}
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={EventFormSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
          <Form className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title && touched.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Enter event title"
              />
              <ErrorMessage name="title" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description && touched.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Describe your event..."
              />
              <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Date and Time */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Event Date & Time *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Field
                  type="datetime-local"
                  id="date"
                  name="date"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date && touched.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
              </div>
              <ErrorMessage name="date" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Location and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Field
                    type="text"
                    id="location"
                    name="location"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location && touched.location ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter event location"
                  />
                </div>
                <ErrorMessage name="location" component="p" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Field
                  as="select"
                  id="category"
                  name="category"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category && touched.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            {/* Pricing and Available Tickets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Field
                    type="number"
                    id="ticketPrice"
                    name="ticketPrice"
                    min="1"
                    step="0.01"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ticketPrice && touched.ticketPrice ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="25.00"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const inputValue = e.target.value;
                      // Allow empty string for clearing
                      if (inputValue === '') {
                        setFieldValue('ticketPrice', '');
                        return;
                      }

                      const value = parseFloat(inputValue);
                      // Only set if it's a valid number
                      if (!isNaN(value)) {
                        setFieldValue('ticketPrice', value);
                      }
                    }}
                  />
                </div>
                <ErrorMessage name="ticketPrice" component="p" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="availableTickets" className="block text-sm font-medium text-gray-700 mb-2">
                  Available Tickets
                </label>
                <div className="relative">
                  <Field
                    type="number"
                    id="availableTickets"
                    name="availableTickets"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.availableTickets && touched.availableTickets ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const inputValue = e.target.value;
                      // Allow empty string for clearing
                      if (inputValue === '') {
                        setFieldValue('availableTickets', '');
                        return;
                      }

                      const value = parseInt(inputValue);
                      // Only set if it's a valid number
                      if (!isNaN(value)) {
                        setFieldValue('availableTickets', value);
                      }
                    }}
                  />
                </div>
                <ErrorMessage name="availableTickets" component="p" className="mt-1 text-sm text-red-600" />
              </div>


            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Event Image URL
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Field
                  type="url"
                  id="image"
                  name="image"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.image && touched.image ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <ErrorMessage name="image" component="p" className="mt-1 text-sm text-red-600" />
              <p className="mt-1 text-sm text-gray-500">
                Optional: Provide a URL to an image for your event
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Update Event'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
} 