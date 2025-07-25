import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Set JSON content type for all API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Content-Type', 'application/json');
  }
  
  return response;
}