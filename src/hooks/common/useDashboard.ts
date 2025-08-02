import { useQuery } from '@tanstack/react-query';
import { DashboardData } from '../../types/types';
import { apiRequest } from '../../lib/api/apiUtils';

// Dashboard API functions
const dashboardApi = {
  getUserDashboard: () => 
    apiRequest<DashboardData>('/dashboard/user'),

  getVendorDashboard: () => 
    apiRequest<DashboardData>('/dashboard/vendor'),

  getAdminDashboard: () => 
    apiRequest<DashboardData>('/dashboard/admin'),
};

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  user: () => [...dashboardKeys.all, 'user'] as const,
  vendor: () => [...dashboardKeys.all, 'vendor'] as const,
  admin: () => [...dashboardKeys.all, 'admin'] as const,
};

// Hooks
export function useUserDashboard() {
  return useQuery({
    queryKey: dashboardKeys.user(),
    queryFn: () => dashboardApi.getUserDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useVendorDashboard() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  return useQuery({
    queryKey: dashboardKeys.vendor(),
    queryFn: () => dashboardApi.getVendorDashboard(),
    enabled: !!token, // Only run if user has auth token
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAdminDashboard() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  return useQuery({
    queryKey: dashboardKeys.admin(),
    queryFn: () => dashboardApi.getAdminDashboard(),
    enabled: !!token, // Only run if user has auth token
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
} 