import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [ '/admin', '/profile'];

export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get('next-auth.session-token') ||
    req.cookies.get('authjs.session-token');

  const { pathname } = req.nextUrl;

  if (!token && PROTECTED_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*',], 
};
