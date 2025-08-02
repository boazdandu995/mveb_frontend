import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

// Import reducers
import authReducer from '../slices/authSlice';
import eventsReducer from '../slices/eventsSlice';
import bookingsReducer from '../slices/bookingsSlice';
import uiReducer from '../slices/uiSlice';

// Import sagas
import { authSaga } from '../sagas/authSaga';
import { eventsSaga } from '../sagas/eventsSaga';
import { bookingsSaga } from '../sagas/bookingsSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Root saga
function* rootSaga() {
  yield all([
    authSaga(),
    eventsSaga(),
    bookingsSaga(),
  ]);
}

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    bookings: bookingsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk since we're using saga
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Run saga
sagaMiddleware.run(rootSaga);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 