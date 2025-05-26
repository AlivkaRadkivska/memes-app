import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedPaths = ['/my-profile', '/gallery'];
const authPaths = ['/', '/login', '/signup'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '');
  const token = request.cookies.get('auth_token')?.value;

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-profile/:path*', '/login', '/signup', '/'],
};
