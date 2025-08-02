import * as Yup from 'yup';

// Booking Form Validation Schema
export const BookingSchema = Yup.object().shape({
  numberOfTickets: Yup.number()
    .min(1, 'Must book at least 1 ticket')
    .max(10, 'Cannot book more than 10 tickets at once')
    .required('Number of tickets is required')
    .test('available-tickets', 'Not enough tickets available', function (value) {
      const { availableTickets } = this.options.context || {};
      return !value || !availableTickets || value <= availableTickets;
    }),
  bookingDate: Yup.date()
    .min(new Date(), 'Booking date cannot be in the past')
    .required('Booking date is required'),
});

// Initial values for booking form
export const initialBookingValues = {
  numberOfTickets: 1,
  bookingDate: new Date().toISOString().split('T')[0],
}; 