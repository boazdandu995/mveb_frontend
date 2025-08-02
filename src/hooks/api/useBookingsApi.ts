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

  // Admin endpoints
  getAdminBookings: () => 
    apiRequest<Booking[]>('/bookings'),

  getAdminBookingAnalytics: () => 
    apiRequest<any>('/bookings/admin/analytics'),

  getAdminRevenueAnalytics: () => 
    apiRequest<any>('/bookings/admin/revenue'),
};

// Query keys
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: () => [...bookingKeys.lists()] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: number) => [...bookingKeys.details(), id] as const,
  myBookings: () => [...bookingKeys.all, 'my'] as const,
  eventBookings: (eventId: number) => [...bookingKeys.all, 'event', eventId] as const,
  admin: () => [...bookingKeys.all, 'admin'] as const,
  adminAnalytics: () => [...bookingKeys.all, 'admin', 'analytics'] as const,
  adminRevenue: () => [...bookingKeys.all, 'admin', 'revenue'] as const,
};

// Query hooks
export function useBookings() {
  return useQuery({
    queryKey: bookingKeys.list(),
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

// Admin query hooks
export function useAdminBookings() {
  return useQuery({
    queryKey: bookingKeys.admin(),
    queryFn: () => bookingsApi.getAdminBookings(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAdminBookingAnalytics() {
  return useQuery({
    queryKey: bookingKeys.adminAnalytics(),
    queryFn: () => bookingsApi.getAdminBookingAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAdminRevenueAnalytics() {
  return useQuery({
    queryKey: bookingKeys.adminRevenue(),
    queryFn: () => bookingsApi.getAdminRevenueAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mutation hooks
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: (data, variables) => {
      // Invalidate my bookings
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
      // Invalidate event bookings
      queryClient.invalidateQueries({ queryKey: bookingKeys.eventBookings(variables.eventId) });
      // Invalidate all bookings list
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      // Invalidate admin bookings
      queryClient.invalidateQueries({ queryKey: bookingKeys.admin() });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { bookingDate?: string; numberOfTickets?: number } }) => 
      bookingsApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific booking in cache
      queryClient.setQueryData(bookingKeys.detail(variables.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.admin() });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the specific booking from cache
      queryClient.removeQueries({ queryKey: bookingKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.admin() });
    },
  });
} 