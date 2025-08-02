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

// Query hooks
export function useUserDashboard() {
  return useQuery({
    queryKey: dashboardKeys.user(),
    queryFn: () => dashboardApi.getUserDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useVendorDashboard() {
  return useQuery({
    queryKey: dashboardKeys.vendor(),
    queryFn: () => dashboardApi.getVendorDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: dashboardKeys.admin(),
    queryFn: () => dashboardApi.getAdminDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
} 