import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking } from '../../types/types';
import { apiRequest } from '../../lib/api/apiUtils';

// Bookings API functions
const bookingsApi = {
  getAll: () => 
    apiRequest<Booking[]>('/bookings'),

  getMyBookings: () => 
    apiRequest<Booking[]>('/bookings/my-bookings'),

  getByEvent: (eventId: number) => 
    apiRequest<Booking[]>(`/bookings/event/${eventId}`),

  getById: (id: number) => 
    apiRequest<Booking>(`/bookings/${id}`),

  create: (data: { eventId: number; bookingDate: string; numberOfTickets: number }) => 
    apiRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { bookingDate?: string; numberOfTickets?: number }) => 
    apiRequest<Booking>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: number) => 
    apiRequest<void>(`/bookings/${id}`, {
      method: 'DELETE',
    }),
};

// Query keys
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: number) => [...bookingKeys.details(), id] as const,
  myBookings: () => [...bookingKeys.all, 'my-bookings'] as const,
  eventBookings: (eventId: number) => [...bookingKeys.all, 'event', eventId] as const,
};

// Hooks
export function useBookings() {
  return useQuery({
    queryKey: bookingKeys.lists(),
    queryFn: () => bookingsApi.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: bookingKeys.myBookings(),
    queryFn: () => bookingsApi.getMyBookings(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBooking(id: number) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingsApi.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useEventBookings(eventId: number) {
  return useQuery({
    queryKey: bookingKeys.eventBookings(eventId),
    queryFn: () => bookingsApi.getByEvent(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { bookingDate?: string; numberOfTickets?: number } }) => 
      bookingsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(bookingKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: bookingKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
    },
  });
} 