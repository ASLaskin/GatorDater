import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/admin',
  '/profile',
  '/preferences',
  '/settings'
];

// Routes with role-based access (optional enhancement)
const ADMIN_ROUTES = [
  '/admin'
];

export async function middleware(req: NextRequest) {
  const token = 
    req.cookies.get('next-auth.session-token')?.value || 
    req.cookies.get('__Secure-next-auth.session-token')?.value ||
    req.cookies.get('authjs.session-token')?.value;

  const { pathname } = req.nextUrl;
  if (!token) {
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );
    
    if (isProtectedRoute) {
      const url = new URL('/', req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/preferences/:path*',
    '/settings/:path*'
  ],
};