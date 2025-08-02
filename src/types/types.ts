export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'vendor' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: number;
  userId: number;
  vendorName: string;
  description: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  vendorId: number;
  title: string;
  description: string;
  image?: string;
  date: string;
  location: string;
  category: string;
  ticketPrice: number;
  availableTickets: number;
  featured: boolean;
  vendor: Vendor;
  status: 'pending' | 'approved' | 'rejected';
  amenities?: string[];
  createdAt: string;
  updatedAt: string;
  userHasBooked?: boolean;
  userBookingId?: number | null;
}

export interface Booking {
  id: number;
  userId: number;
  eventId: number;
  event: Event;
  user: User;
  bookingDate: string;
  numberOfTickets: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  ticketPrice: number;
  image?: string;
  availableTickets: number;
  featured?: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
  access_token: string;
}



export interface DashboardData {
  user?: User;
  vendor?: Vendor;
  stats?: {
    totalUsers?: number;
    totalVendors?: number;
    totalEvents?: number;
    totalBookings?: number;
    pendingEvents?: number;
    approvedEvents?: number;
    totalRevenue?: number;
    rejectedEvents?: number;
  };
  bookings?: number;
  events?: number;
  pendingEvents?: number;
  approvedEvents?: number;
  totalBookings?: number;
  recentBookings?: Booking[];
  recentEvents?: Event[];
  recentUsers?: User[];
  monthlyStats?: MonthlyStat[];
  topEvents?: TopEvent[];
  bookingTrends?: BookingTrend[];
}

export interface MonthlyStat {
  month: string;
  events: number;
  bookings: number;
  revenue: number;
}

export interface TopEvent {
  event_id: number;
  event_title: string;
  event_ticketPrice: number;
  bookingCount: string;
  totalRevenue: string;
}

export interface BookingTrend {
  date: string;
  bookings: number;
}

export interface EventAnalytics {
  event: {
    id: number;
    title: string;
    status: string;
    ticketPrice: number;
    availableTickets: number;
    date: string;
  };
  stats: {
    totalBookings: number;
    totalRevenue: number;
    totalTickets: number;
    averageTicketsPerBooking: number;
    conversionRate: number;
    remainingTickets: number;
  };
  recentBookings: Booking[];
  bookingTrends: BookingTrend[];
}

export interface BookingAnalytics {
  totalBookings: number;
  totalSpent: number;
  totalTickets: number;
  averageSpentPerBooking: number;
  monthlyBookings: Record<string, number>;
  recentBookings: Booking[];
} 