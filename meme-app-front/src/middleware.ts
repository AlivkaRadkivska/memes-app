import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const protectedPaths = ['/admin', '/profile', '/gallery'];
const authPaths = ['/', '/login', '/signup'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '');
  const token = request.cookies.get('auth_token')?.value;

  const decodeToken = (token: string) => {
    try {
      return jwt.decode(token) as {
        role: 'user' | 'moderator' | 'admin';
        [key: string]: unknown;
      } | null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const isAuthPath = authPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtectedPath && !token) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isProtectedPath && token) {
    const decodedToken = decodeToken(token);

    if (pathname === '/admin' && decodedToken?.role !== 'admin') {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }

    if (pathname === '/profile' && decodedToken?.role === 'user') {
      const url = new URL('/profile/view', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/login', '/signup', '/'],
};
