import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Add CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  // Rate limiting per user
  const userId = req.headers.get('x-user-id');
  if (userId) {
    // Implement user-based rate limiting
  }
  
  return response;
}
