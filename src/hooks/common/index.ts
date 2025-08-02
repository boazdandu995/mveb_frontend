// Auth hooks
export {
  useLogin,
  useRegister,
  useLogout,
} from '../api/useAuthApi';

// Events hooks
export {
  useEvents,
  useEvent,
  useFeaturedEvents,
  useAdminEvents,
  useVendorEvents,
  useCreateEvent,
  useUpdateEvent,
  useUpdateEventStatus,
  useDeleteEvent,
  eventKeys,
} from '../api/useEventsApi';

// Bookings hooks
export {
  useBookings,
  useMyBookings,
  useBooking,
  useEventBookings,
  useCreateBooking,
  useUpdateBooking,
  useDeleteBooking,
  bookingKeys,
} from '../api/useBookingsApi';

// Dashboard hooks
export {
  useUserDashboard,
  useVendorDashboard,
  useAdminDashboard,
  dashboardKeys,
} from '../api/useDashboardApi';

// Legacy hooks (for backward compatibility)
export {
  useUsers,
  useUser,
  useUpdateUser,
  useDeleteUser,
} from './useUsers';

export {
  useVendors,
  useVendor,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
} from './useVendors'; 