import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, AuthResponse, RegisterResponse } from '../../types/types';
import { apiRequest } from '../../lib/api/apiUtils';

// Auth API functions
const authApi = {
  register: (data: { name: string; email: string; password: string; role: 'user' | 'vendor' | 'admin' }) =>
    apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Auth hooks
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store auth data
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Store auth data after successful registration
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}



export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call backend logout endpoint
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all React Query cache
      queryClient.clear();
      // Also remove all queries to ensure they don't refetch
      queryClient.removeQueries();
      // Note: Storage cleanup and navigation are handled by AuthContext
    },
    onError: (error) => {
      console.error('Logout API call failed:', error);
      // Still clear the cache even if API call fails
      queryClient.clear();
      queryClient.removeQueries();
    },
  });
} 