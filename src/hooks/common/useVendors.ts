import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Vendor } from '../../types/types';
import { apiRequest } from '../../lib/api/apiUtils';

// Vendor API functions
const vendorApi = {
  getAll: () => 
    apiRequest<Vendor[]>('/vendors'),

  getById: (id: number) => 
    apiRequest<Vendor>(`/vendors/${id}`),

  create: (data: { userId: number; vendorName: string; description: string }) => 
    apiRequest<Vendor>('/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { vendorName?: string; description?: string }) => 
    apiRequest<Vendor>(`/vendors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: number) => 
    apiRequest<void>(`/vendors/${id}`, {
      method: 'DELETE',
    }),

  verify: (id: number, data: { status: 'verified' | 'rejected'; notes?: string }) => 
    apiRequest<Vendor>(`/vendors/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Query keys
export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  details: () => [...vendorKeys.all, 'detail'] as const,
  detail: (id: number) => [...vendorKeys.details(), id] as const,
};

// Hooks
export function useVendors() {
  return useQuery({
    queryKey: vendorKeys.lists(),
    queryFn: () => vendorApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useVendor(id: number) {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => vendorApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { vendorName?: string; description?: string } }) => 
      vendorApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(vendorKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: vendorKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}

export function useVerifyVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: 'verified' | 'rejected'; notes?: string } }) => 
      vendorApi.verify(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(vendorKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
} 