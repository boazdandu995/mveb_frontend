import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event, SearchFilters } from '../../types/types';

interface EventsState {
  events: Event[];
  featuredEvents: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: EventsState = {
  events: [],
  featuredEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
  filters: {
    query: '',
    category: '',
    location: '',
    dateFrom: '',
    dateTo: '',
    priceMin: undefined,
    priceMax: undefined,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    hasMore: true,
  },
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // Fetch events actions
    fetchEventsRequest: (state, action: PayloadAction<SearchFilters>) => {
      state.loading = true;
      state.error = null;
      state.filters = { ...state.filters, ...action.payload };
    },
    fetchEventsSuccess: (state, action: PayloadAction<{ events: Event[]; total: number }>) => {
      state.loading = false;
      state.events = action.payload.events;
      state.pagination.total = action.payload.total;
      state.pagination.hasMore = action.payload.events.length === state.pagination.limit;
      state.error = null;
    },
    fetchEventsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch featured events actions
    fetchFeaturedEventsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFeaturedEventsSuccess: (state, action: PayloadAction<Event[]>) => {
      state.loading = false;
      state.featuredEvents = action.payload;
      state.error = null;
    },
    fetchFeaturedEventsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single event actions
    fetchEventRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchEventSuccess: (state, action: PayloadAction<Event>) => {
      state.loading = false;
      state.currentEvent = action.payload;
      state.error = null;
    },
    fetchEventFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create event actions
    createEventRequest: (state, action: PayloadAction<Partial<Event>>) => {
      state.loading = true;
      state.error = null;
    },
    createEventSuccess: (state, action: PayloadAction<Event>) => {
      state.loading = false;
      state.events.unshift(action.payload);
      state.error = null;
    },
    createEventFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update event actions
    updateEventRequest: (state, action: PayloadAction<{ id: string; data: Partial<Event> }>) => {
      state.loading = true;
      state.error = null;
    },
    updateEventSuccess: (state, action: PayloadAction<Event>) => {
      state.loading = false;
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
      if (state.currentEvent?.id === action.payload.id) {
        state.currentEvent = action.payload;
      }
      state.error = null;
    },
    updateEventFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete event actions
    deleteEventRequest: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
    },
    deleteEventSuccess: (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.events = state.events.filter(event => event.id !== action.payload);
      if (state.currentEvent?.id === action.payload) {
        state.currentEvent = null;
      }
      state.error = null;
    },
    deleteEventFailure: (state, action: PayloadAction<string>) => {
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

    // Clear current event
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchEventsRequest,
  fetchEventsSuccess,
  fetchEventsFailure,
  fetchFeaturedEventsRequest,
  fetchFeaturedEventsSuccess,
  fetchFeaturedEventsFailure,
  fetchEventRequest,
  fetchEventSuccess,
  fetchEventFailure,
  createEventRequest,
  createEventSuccess,
  createEventFailure,
  updateEventRequest,
  updateEventSuccess,
  updateEventFailure,
  deleteEventRequest,
  deleteEventSuccess,
  deleteEventFailure,
  setPage,
  setLimit,
  clearCurrentEvent,
  clearError,
} = eventsSlice.actions;

export default eventsSlice.reducer; 