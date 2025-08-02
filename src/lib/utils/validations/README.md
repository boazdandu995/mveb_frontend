# Form Validation Schemas

This folder contains all Formik validation schemas and initial values for the application forms.

## Structure

```
lib/validations/
├── index.ts              # Main export file
├── eventForm.ts          # Event creation/editing form validation
├── authForms.ts          # Login and register form validation
├── bookingForm.ts        # Event booking form validation
└── README.md            # This documentation
```

## Available Schemas

### 1. Event Form (`eventForm.ts`)
- **Schema**: `EventFormSchema`
- **Initial Values**: `initialEventFormData`
- **Fields**:
  - `title`: 3-100 characters, required
  - `description`: 10-1000 characters, required
  - `date`: Future dates only, required
  - `time`: Required
  - `location`: 3-200 characters, required
  - `category`: Required selection
  - `ticketPrice`: $1-$10,000, required
  - `capacity`: 1-100,000, required
  - `availableTickets`: 1-100,000, cannot exceed capacity
  - `image`: Optional, must be valid URL

### 2. Authentication Forms (`authForms.ts`)
- **Login Schema**: `LoginSchema`
- **Register Schema**: `RegisterSchema`
- **Initial Values**: `initialLoginValues`, `initialRegisterValues`

#### Login Fields:
- `email`: Valid email format, required
- `password`: Minimum 6 characters, required

#### Register Fields:
- `name`: 2-50 characters, required
- `email`: Valid email format, required
- `password`: 6+ characters, must contain uppercase, lowercase, and number
- `confirmPassword`: Must match password
- `role`: Must select user or vendor

### 3. Booking Form (`bookingForm.ts`)
- **Schema**: `BookingSchema`
- **Initial Values**: `initialBookingValues`
- **Fields**:
  - `numberOfTickets`: 1-10, cannot exceed available tickets
  - `bookingDate`: Future dates only, required

## Usage

### Import Schemas
```typescript
import { 
  EventFormSchema, 
  initialEventFormData,
  LoginSchema,
  initialLoginValues,
  RegisterSchema,
  initialRegisterValues,
  BookingSchema,
  initialBookingValues
} from '../lib/validations';
```

### Use in Formik
```typescript
<Formik
  initialValues={initialEventFormData}
  validationSchema={EventFormSchema}
  onSubmit={handleSubmit}
>
  {/* Form content */}
</Formik>
```

### Context for Dynamic Validation
For forms that need dynamic validation (like booking form with available tickets):

```typescript
<Formik
  initialValues={initialBookingValues}
  validationSchema={BookingSchema}
  onSubmit={handleSubmit}
  context={{ availableTickets: event.availableTickets }}
>
  {/* Form content */}
</Formik>
```

## Benefits

1. **Centralized Validation**: All validation rules in one place
2. **Reusability**: Schemas can be reused across components
3. **Maintainability**: Easy to update validation rules
4. **Type Safety**: TypeScript interfaces for all form data
5. **Consistency**: Standardized validation across the application

## Adding New Schemas

1. Create a new file in the `validations` folder
2. Define your Yup schema and initial values
3. Export them from the file
4. Add exports to `index.ts`
5. Import and use in your components

## Example: Adding a New Form Schema

```typescript
// lib/validations/newForm.ts
import * as Yup from 'yup';

export const NewFormSchema = Yup.object().shape({
  field1: Yup.string().required('Field 1 is required'),
  field2: Yup.number().min(1, 'Field 2 must be at least 1'),
});

export const initialNewFormValues = {
  field1: '',
  field2: 0,
};
```

```typescript
// lib/validations/index.ts
export * from './newForm';
```

```typescript
// In your component
import { NewFormSchema, initialNewFormValues } from '../lib/validations';
``` 