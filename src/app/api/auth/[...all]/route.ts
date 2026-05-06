import type { NextRequest } from 'next/server';
import { auth } from '@/server/auth';

export function POST(request: NextRequest) {
  return auth.handler(request);
}

export function GET(request: NextRequest) {
  return auth.handler(request);
}
