import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event, SearchFilters, EventFormData, EventAnalytics, PaginationParams, PaginatedResult } from '../../types/types';
import { apiRequest } from '../../lib/api/apiUtils';

// Events API functions
const eventsApi = {
  getAll: (filters?: SearchFilters, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (filters?.query) params.append('query', filters.query);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters?.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    return apiRequest<PaginatedResult<Event>>(`/events?${params.toString()}`);
  },

  search: (filters: {
    title?: string;
    vendor?: string;
    category?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.vendor) params.append('vendor', filters.vendor);
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    return apiRequest<Event[]>(`/events/search?${params.toString()}`);
  },

  getCategories: () => 
    apiRequest<string[]>('/events/categories'),

  getById: (id: number) => 
    apiRequest<Event>(`/events/${id}`),

  getByIdWithUserBooking: (id: number) => 
    apiRequest<Event>(`/events/${id}/user-booking`),

  getUserEvents: () => 
    apiRequest<Event[]>('/events/user-events'),

  getAllForAdmin: () => 
    apiRequest<Event[]>('/events/admin'),

  getVendorEvents: () => 
    apiRequest<Event[]>('/events/vendor'),

  getEventAnalytics: (id: number) => 
    apiRequest<EventAnalytics>(`/events/${id}/analytics`),

  create: (data: EventFormData) => 
    apiRequest<Event>('/events', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        category: data.category,
        ticketPrice: data.ticketPrice,
        image: data.image,
        availableTickets: data.availableTickets,
        featured: data.featured,
      }),
    }),

  update: (id: number, data: Partial<EventFormData>) => 
    apiRequest<Event>(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        category: data.category,
        ticketPrice: data.ticketPrice,
        image: data.image,
        availableTickets: data.availableTickets,
        featured: data.featured,
      }),
    }),

  updateStatus: (id: number, status: 'pending' | 'approved' | 'rejected') => 
    apiRequest<Event>(`/events/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: number) => 
    apiRequest<void>(`/events/${id}`, {
      method: 'DELETE',
    }),
};

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: SearchFilters) => [...eventKeys.lists(), filters] as const,
  search: (filters: any) => [...eventKeys.all, 'search', filters] as const,
  categories: () => [...eventKeys.all, 'categories'] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
  userDetail: (id: number) => [...eventKeys.details(), id, 'user'] as const,
  analytics: (id: number) => [...eventKeys.details(), id, 'analytics'] as const,
  featured: () => [...eventKeys.all, 'featured'] as const,
  userEvents: () => [...eventKeys.all, 'user-events'] as const,
  admin: () => [...eventKeys.all, 'admin'] as const,
  vendor: () => [...eventKeys.all, 'vendor'] as const,
};

// Hooks
export function useEvents(filters: SearchFilters = {}, pagination?: PaginationParams) {
  return useQuery({
    queryKey: [eventKeys.list(filters), pagination],
    queryFn: () => eventsApi.getAll(filters, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSearchEvents(filters: {
  title?: string;
  vendor?: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: eventKeys.search(filters),
    queryFn: () => eventsApi.search(filters),
    enabled: !!(filters.title || filters.vendor || filters.category || filters.location || filters.startDate || filters.endDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useEventCategories() {
  return useQuery({
    queryKey: eventKeys.categories(),
    queryFn: () => eventsApi.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useFeaturedEvents() {
  return useQuery({
    queryKey: eventKeys.featured(),
    queryFn: async () => {
      // Try the featured endpoint first, if it doesn't exist, get first 6 events
      try {
        return await apiRequest<Event[]>('/events/featured');
      } catch (error) {
        // Fallback to getting first 6 events with pagination
        const result = await eventsApi.getAll(undefined, { limit: 6 });
        return result.data;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useEventWithUserBooking(id: number) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  return useQuery({
    queryKey: eventKeys.userDetail(id),
    queryFn: () => eventsApi.getByIdWithUserBooking(id),
    enabled: !!id && !!token, // Only run if user has auth token and id exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUserEvents() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  console.log('🔍 useUserEvents - Token present:', !!token);
  
  return useQuery({
    queryKey: eventKeys.userEvents(),
    queryFn: () => {
      console.log('🔍 useUserEvents - Fetching user events...');
      return eventsApi.getUserEvents();
    },
    enabled: !!token, // Only run if user has auth token
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if it fails
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if disabled
    refetchOnReconnect: false, // Don't refetch on reconnect
  });
}

export function useAdminEvents() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  return useQuery({
    queryKey: eventKeys.admin(),
    queryFn: () => eventsApi.getAllForAdmin(),
    enabled: !!token, // Only run if user has auth token
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useVendorEvents() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  return useQuery({
    queryKey: eventKeys.vendor(),
    queryFn: () => eventsApi.getVendorEvents(),
    enabled: !!token, // Only run if user has auth token
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useEventAnalytics(id: number) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  return useQuery({
    queryKey: eventKeys.analytics(id),
    queryFn: () => eventsApi.getEventAnalytics(id),
    enabled: !!id && !!token, // Only run if user has auth token and id exists
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.featured() });
      queryClient.invalidateQueries({ queryKey: eventKeys.vendor() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Event> }) => eventsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(eventKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.featured() });
      queryClient.invalidateQueries({ queryKey: eventKeys.vendor() });
    },
  });
}

export function useUpdateEventStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'pending' | 'approved' | 'rejected' }) => 
      eventsApi.updateStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(eventKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.admin() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.featured() });
      queryClient.invalidateQueries({ queryKey: eventKeys.vendor() });
    },
  });
} 