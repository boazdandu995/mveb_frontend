import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/api/apiUtils';

// Users API functions
const usersApi = {
  getAll: () => 
    apiRequest<any[]>('/users'),

  getById: (id: number) => 
    apiRequest<any>(`/users/${id}`),

  update: (id: number, data: any) => 
    apiRequest<any>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateRole: (id: number, role: 'user' | 'vendor' | 'admin') => 
    apiRequest<any>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  toggleActive: (id: number) => 
    apiRequest<any>(`/users/${id}/toggle-active`, {
      method: 'PATCH',
    }),

  delete: (id: number) => 
    apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: () => [...userKeys.lists()] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  admin: () => [...userKeys.all, 'admin'] as const,
};

// Query hooks
export function useAdminUsers() {
  return useQuery({
    queryKey: userKeys.admin(),
    queryFn: () => usersApi.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mutation hooks
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      usersApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(variables.id), data);
      // Invalidate admin users list
      queryClient.invalidateQueries({ queryKey: userKeys.admin() });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: 'user' | 'vendor' | 'admin' }) => 
      usersApi.updateRole(id, role),
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(variables.id), data);
      // Invalidate admin users list
      queryClient.invalidateQueries({ queryKey: userKeys.admin() });
    },
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.toggleActive,
    onSuccess: (data, userId) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(userId), data);
      // Invalidate admin users list
      queryClient.invalidateQueries({ queryKey: userKeys.admin() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the specific user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      // Invalidate admin users list
      queryClient.invalidateQueries({ queryKey: userKeys.admin() });
    },
  });
} 