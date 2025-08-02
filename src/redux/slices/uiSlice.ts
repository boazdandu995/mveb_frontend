import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  modals: {
    loginModal: boolean;
    registerModal: boolean;
    bookingModal: boolean;
    eventModal: boolean;
  };
  loading: {
    global: boolean;
    auth: boolean;
    events: boolean;
    bookings: boolean;
  };
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
  modals: {
    loginModal: false,
    registerModal: false,
    bookingModal: false,
    eventModal: false,
  },
  loading: {
    global: false,
    auth: false,
    events: false,
    bookings: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Sidebar actions
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Notification actions
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
      duration?: number;
    }>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modal actions
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },

    // Loading actions
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.auth = action.payload;
    },
    setEventsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.events = action.payload;
    },
    setBookingsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.bookings = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setGlobalLoading,
  setAuthLoading,
  setEventsLoading,
  setBookingsLoading,
} = uiSlice.actions;

export default uiSlice.reducer; 