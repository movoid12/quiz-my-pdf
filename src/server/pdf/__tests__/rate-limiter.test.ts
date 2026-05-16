import { describe, expect, it } from 'vitest';
import { checkRateLimit, getIp } from '@/server/pdf/rate-limiter';

function makeRequest(ip?: string): Request {
  const headers: Record<string, string> = {};
  if (ip) {
    headers['x-forwarded-for'] = ip;
  }
  return new Request('http://localhost', { headers });
}

describe('getIp', () => {
  it('extracts IP from x-forwarded-for', () => {
    const req = makeRequest('203.0.113.42');
    expect(getIp(req)).toBe('203.0.113.42');
  });

  it('takes first IP from comma-separated list', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '203.0.113.42, 10.0.0.1, 192.168.1.1' },
    });
    expect(getIp(req)).toBe('203.0.113.42');
  });

  it('returns "unknown" when no header present', () => {
    const req = makeRequest();
    expect(getIp(req)).toBe('unknown');
  });
});

describe('checkRateLimit', () => {
  it('allows first request', () => {
    const result = checkRateLimit(makeRequest('10.0.0.1'));
    expect(result).toEqual({ allowed: true });
  });

  it('blocks second request from same IP within minute', () => {
    const ip = '10.0.0.2';
    checkRateLimit(makeRequest(ip));
    const result = checkRateLimit(makeRequest(ip));
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('allows requests from different IPs', () => {
    expect(checkRateLimit(makeRequest('10.0.0.3'))).toEqual({
      allowed: true,
    });
    expect(checkRateLimit(makeRequest('10.0.0.4'))).toEqual({
      allowed: true,
    });
  });

  it('returns retryAfter in seconds for blocked requests', () => {
    const ip = '10.0.0.5';
    checkRateLimit(makeRequest(ip));
    const result = checkRateLimit(makeRequest(ip));
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThanOrEqual(1);
    expect(result.retryAfter).toBeLessThanOrEqual(60);
  });
});
