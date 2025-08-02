import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event, EventFormData, SearchFilters, PaginationParams, PaginatedResult } from '../../types/types';
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

  search: (filters: SearchFilters, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (filters.query) params.append('title', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.dateFrom) params.append('startDate', filters.dateFrom);
    if (filters.dateTo) params.append('endDate', filters.dateTo);
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    return apiRequest<PaginatedResult<Event>>(`/events/search?${params.toString()}`);
  },

  getById: (id: number) => 
    apiRequest<Event>(`/events/${id}`),

  getAllForAdmin: () => 
    apiRequest<Event[]>('/events/admin'),

  getVendorEvents: () => 
    apiRequest<Event[]>('/events/vendor'),

  create: (data: EventFormData) => 
    apiRequest<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<EventFormData>) => 
    apiRequest<Event>(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
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
  list: (filters?: SearchFilters) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
  admin: () => [...eventKeys.all, 'admin'] as const,
  vendor: () => [...eventKeys.all, 'vendor'] as const,
};

// Query hooks
export function useEvents(filters?: SearchFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: [...eventKeys.list(filters), pagination],
    queryFn: () => eventsApi.getAll(filters, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useEventsSearch(filters: SearchFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: [...eventKeys.list(filters), 'search', pagination],
    queryFn: () => eventsApi.search(filters, pagination),
    enabled: !!(filters.query || filters.category || filters.location || filters.dateFrom || filters.dateTo),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
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

export function useFeaturedEvents() {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn: () => eventsApi.getAll(undefined, { limit: 6 }), // Get first 6 events for featured
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAdminEvents() {
  return useQuery({
    queryKey: eventKeys.admin(),
    queryFn: () => eventsApi.getAllForAdmin(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useVendorEvents() {
  return useQuery({
    queryKey: eventKeys.vendor(),
    queryFn: () => eventsApi.getVendorEvents(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation hooks
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      // Invalidate all events lists
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.vendor() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EventFormData> }) => 
      eventsApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific event in cache
      queryClient.setQueryData(eventKeys.detail(variables.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
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
      // Update the specific event in cache
      queryClient.setQueryData(eventKeys.detail(variables.id), data);
      // Invalidate admin events
      queryClient.invalidateQueries({ queryKey: eventKeys.admin() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the specific event from cache
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.vendor() });
    },
  });
} 