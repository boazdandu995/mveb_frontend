import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies or headers
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Get user data from cookies if available
  let user = null;
  try {
    const userData = request.cookies.get('user_data')?.value;
    if (userData) {
      user = JSON.parse(decodeURIComponent(userData));
    }
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
  }

  // Debug logging
  console.log('🔍 Middleware - Pathname:', pathname);
  console.log('🔍 Middleware - Token exists:', !!token);
  console.log('🔍 Middleware - User:', user);

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/admin',
    '/dashboard/vendor', 
    '/dashboard/user',
    '/profile',
    '/bookings',
    '/my-events'
  ];

  // Define auth routes that should redirect authenticated users
  const authRoutes = [
    '/auth/login',
    '/auth/register'
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If user is not authenticated and trying to access protected route
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth routes
  if (token && isAuthRoute) {
    // Check if there's a redirect parameter (user just logged in)
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    
    if (redirectParam) {
      // User just logged in, redirect them back to where they were
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
    
    // No redirect parameter, redirect authenticated users to their appropriate dashboard
    if (user && user.role) {
      switch (user.role) {
        case 'admin':
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        case 'vendor':
          return NextResponse.redirect(new URL('/dashboard/vendor', request.url));
        default:
          return NextResponse.redirect(new URL('/dashboard/user', request.url));
      }
    }
    // Fallback to home page if user role is not available
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is authenticated and trying to access protected routes
  if (token && isProtectedRoute) {
    // Allow access to protected routes for authenticated users
    return NextResponse.next();
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 