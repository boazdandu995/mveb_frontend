import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../../types/types';

interface BookingsState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: BookingsState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
  },
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    // Fetch bookings actions
    fetchBookingsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action: PayloadAction<{ bookings: Booking[]; total: number }>) => {
      state.loading = false;
      state.bookings = action.payload.bookings;
      state.pagination.total = action.payload.total;
      state.pagination.hasMore = action.payload.bookings.length === state.pagination.limit;
      state.error = null;
    },
    fetchBookingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create booking actions
    createBookingRequest: (state, action: PayloadAction<{ eventId: string; quantity: number }>) => {
      state.loading = true;
      state.error = null;
    },
    createBookingSuccess: (state, action: PayloadAction<Booking>) => {
      state.loading = false;
      state.bookings.unshift(action.payload);
      state.error = null;
    },
    createBookingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update booking actions
    updateBookingRequest: (state, action: PayloadAction<{ id: string; status: string }>) => {
      state.loading = true;
      state.error = null;
    },
    updateBookingSuccess: (state, action: PayloadAction<Booking>) => {
      state.loading = false;
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
      if (state.currentBooking?.id === action.payload.id) {
        state.currentBooking = action.payload;
      }
      state.error = null;
    },
    updateBookingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Cancel booking actions
    cancelBookingRequest: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
    },
    cancelBookingSuccess: (state, action: PayloadAction<number>) => {
      state.loading = false;
      const index = state.bookings.findIndex(booking => booking.id === action.payload);
      if (index !== -1) {
        state.bookings[index].status = 'cancelled';
      }
      if (state.currentBooking?.id === action.payload) {
        state.currentBooking.status = 'cancelled';
      }
      state.error = null;
    },
    cancelBookingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single booking actions
    fetchBookingRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchBookingSuccess: (state, action: PayloadAction<Booking>) => {
      state.loading = false;
      state.currentBooking = action.payload;
      state.error = null;
    },
    fetchBookingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Pagination actions
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },

    // Clear current booking
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchBookingsRequest,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
  updateBookingRequest,
  updateBookingSuccess,
  updateBookingFailure,
  cancelBookingRequest,
  cancelBookingSuccess,
  cancelBookingFailure,
  fetchBookingRequest,
  fetchBookingSuccess,
  fetchBookingFailure,
  setPage,
  setLimit,
  clearCurrentBooking,
  clearError,
} = bookingsSlice.actions;

export default bookingsSlice.reducer; 