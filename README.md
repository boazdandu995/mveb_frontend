# Multi-Vendor Event Booking Frontend

A modern web application for multi-vendor event booking built with Next.js, React, and TypeScript.

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mveb-frontend
```

2. Install dependencies:
```bash
npm install


3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:5500
```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5500`

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Dashboard pages for different user types
│   │   ├── admin/         # Admin dashboard
│   │   ├── user/          # User dashboard
│   │   └── vendor/        # Vendor dashboard
│   └── events/            # Event-related pages
├── components/            # Reusable React components
│   ├── features/          # Feature-specific components
│   │   ├── admin/         # Admin-specific components
│   │   ├── auth/          # Authentication components
│   │   ├── bookings/      # Booking-related components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── events/        # Event-related components
│   │   └── vendor/        # Vendor-specific components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── shared/            # Shared/common components
│   └── ui/                # UI components
├── config/                # Configuration files
│   ├── middleware.ts      # Next.js middleware
│   └── providers.tsx      # React providers
├── context/               # React context providers
│   └── AuthContext.tsx    # Authentication context
├── hooks/                 # Custom React hooks
│   ├── api/               # API-related hooks
│   └── common/            # Common hooks
├── lib/                   # Utility libraries
│   ├── api/               # API utilities
│   ├── constants/         # Application constants
│   └── utils/             # Utility functions
├── redux/                 # Redux state management
│   ├── sagas/             # Redux sagas
│   ├── slices/            # Redux slices
│   └── store/             # Redux store configuration
├── styles/                # Global styles
│   └── globals.css        # Global CSS
└── types/                 # TypeScript type definitions
    └── types.ts           # Global types
```

## Technology Stack

### Core Technologies
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type-safe JavaScript

### State Management
- **Redux Toolkit 2.8.2** - State management library
- **Redux Saga 1.3.0** - Side effect management
- **React Redux 9.2.0** - React bindings for Redux

### Data Fetching
- **TanStack React Query 5.83.0** - Server state management
- **TanStack React Query DevTools 5.83.0** - Development tools

### Styling
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **PostCSS 8.4.32** - CSS processing
- **Autoprefixer 10.4.16** - CSS vendor prefixing

### Forms and Validation
- **Formik 2.4.6** - Form management
- **Yup 1.7.0** - Schema validation

### UI Components
- **Lucide React 0.460.0** - Icon library
- **clsx 2.0.0** - Conditional CSS classes
- **tailwind-merge 2.0.0** - Tailwind class merging

### Utilities
- **date-fns 2.30.0** - Date manipulation library

## Features

### User Management
- User registration and authentication
- Role-based access control (Admin, User, Vendor)
- User profile management

### Event Management
- Event creation and management for vendors
- Event browsing and search for users
- Event analytics and insights

### Booking System
- Event booking functionality
- Booking management and tracking
- Payment integration (planned)

### Dashboard
- Role-specific dashboards
- Analytics and reporting
- User and vendor management (admin)

### Admin Features
- User management
- Vendor management
- Event oversight
- Revenue analytics
- Booking analytics

## API Integration

The frontend integrates with a NestJS backend API. The API endpoints are organized by feature:

- **Authentication**: `/auth/*`
- **Users**: `/users/*`
- **Events**: `/events/*`
- **Bookings**: `/bookings/*`
- **Vendors**: `/vendors/*`
- **Dashboard**: `/dashboard/*`

API calls are handled through custom hooks in `src/hooks/api/` and Redux sagas in `src/redux/sagas/`.

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write tests for new features

### Component Structure
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the established folder structure
- Use Tailwind CSS for styling

### State Management
- Use Redux for global state
- Use React Query for server state
- Use local state for component-specific data
- Implement proper error handling

### Testing
- Write unit tests for components
- Write integration tests for features
- Maintain good test coverage
- Use React Testing Library for component tests 