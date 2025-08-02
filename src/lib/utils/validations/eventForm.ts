import * as Yup from 'yup';

export const EventFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .required('Description is required'),
  date: Yup.string()
    .required('Date and time is required')
    .test('future-datetime', 'Event date and time cannot be in the past', function(value) {
      if (!value) return false;
      const selectedDateTime = new Date(value);
      const now = new Date();
      return selectedDateTime > now;
    }),
  location: Yup.string()
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location must be less than 200 characters')
    .required('Location is required'),
  category: Yup.string()
    .required('Category is required'),
  ticketPrice: Yup.number()
    .transform((value, originalValue) => {
      // Allow empty string to be transformed to undefined
      return originalValue === '' ? undefined : value;
    })
    .min(1, 'Ticket price must be at least $1')
    .max(10000, 'Ticket price cannot exceed $10,000')
    .required('Ticket price is required'),
  availableTickets: Yup.number()
    .transform((value, originalValue) => {
      // Allow empty string to be transformed to undefined
      return originalValue === '' ? undefined : value;
    })
    .min(1, 'Available tickets must be at least 1')
    .max(100000, 'Available tickets cannot exceed 100,000')
    .required('Available tickets is required'),
  image: Yup.string()
    .url('Must be a valid URL')
    .optional(),
});

export const initialEventFormData = {
  title: '',
  description: '',
  date: '',
  location: '',
  category: '',
  ticketPrice: 25,
  availableTickets: 100,
  image: '',
}; 