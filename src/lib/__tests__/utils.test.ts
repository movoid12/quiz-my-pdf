import 'dayjs/locale/de';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  errorJson,
  formatFullDate,
  formatRelativeTime,
  isLikelyPdf,
  mapErrorToResponse,
  normalizeText,
} from '@/lib/utils';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-16T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Just now" for less than 60 seconds', () => {
    expect(formatRelativeTime(new Date('2026-05-16T11:59:30Z'))).toBe(
      'Just now',
    );
  });

  it('returns minutes for less than 60 minutes', () => {
    expect(formatRelativeTime(new Date('2026-05-16T11:30:00Z'))).toBe(
      '30 minutes ago',
    );
  });

  it('returns singular minute for 1 minute', () => {
    expect(formatRelativeTime(new Date('2026-05-16T11:59:00Z'))).toBe(
      '1 minute ago',
    );
  });

  it('returns hours for less than 24 hours', () => {
    expect(formatRelativeTime(new Date('2026-05-16T10:00:00Z'))).toBe(
      '2 hours ago',
    );
  });

  it('returns days for less than 7 days', () => {
    expect(formatRelativeTime(new Date('2026-05-14T12:00:00Z'))).toBe(
      '2 days ago',
    );
  });

  it('returns locale string for 7+ days', () => {
    const date = new Date('2026-05-09T12:00:00Z');
    const result = formatRelativeTime(date);
    expect(result).not.toContain('ago');
    expect(result).not.toBe('Just now');
    expect(result.length).toBeGreaterThan(5);
  });

  it('handles null/undefined by returning "Just now"', () => {
    expect(formatRelativeTime(null)).toBe('Just now');
    expect(formatRelativeTime(undefined)).toBe('Just now');
  });

  it('returns "Just now" for exactly 0 seconds difference', () => {
    expect(formatRelativeTime(new Date('2026-05-16T12:00:00Z'))).toBe(
      'Just now',
    );
  });
});

describe('formatFullDate', () => {
  it('formats date in DD.MM.YYYY, HH:mm pattern', () => {
    const date = new Date('2026-05-16T14:30:00Z');
    const result = formatFullDate(date);
    expect(result).toMatch(/^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/);
    expect(result).toContain('16.05.2026');
  });

  it('accepts string input', () => {
    const result = formatFullDate('2026-05-16T14:30:00Z');
    expect(result).toMatch(/^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/);
    expect(result).toContain('16.05.2026');
  });
});

describe('normalizeText', () => {
  it('collapses whitespace and trims', () => {
    expect(normalizeText('  hello   world  ', 50)).toBe('hello world');
  });

  it('slices to limit', () => {
    expect(normalizeText('hello world', 5)).toBe('hello');
  });

  it('handles empty string', () => {
    expect(normalizeText('', 10)).toBe('');
  });

  it('handles newlines and tabs', () => {
    expect(normalizeText('line1\n\tline2', 50)).toBe('line1 line2');
  });

  it('returns empty string for limit 0', () => {
    expect(normalizeText('hello world', 0)).toBe('');
  });
});

describe('isLikelyPdf', () => {
  it('returns true for PDF header', () => {
    const buffer = Buffer.from('%PDF-1.4\n%...');
    expect(isLikelyPdf(buffer)).toBe(true);
  });

  it('returns false for non-PDF content', () => {
    const buffer = Buffer.from('not a pdf');
    expect(isLikelyPdf(buffer)).toBe(false);
  });

  it('returns false for empty buffer', () => {
    const buffer = Buffer.from('');
    expect(isLikelyPdf(buffer)).toBe(false);
  });
});

describe('errorJson', () => {
  it('returns JSON Response with correct status and message', async () => {
    const response = errorJson('Something went wrong', 400);
    expect(response.status).toBe(400);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    const body = await response.json();
    expect(body).toEqual({ error: 'Something went wrong' });
  });

  it('handles empty message string', async () => {
    const response = errorJson('', 500);
    const body = await response.json();
    expect(body).toEqual({ error: '' });
  });

  it('includes custom headers', () => {
    const response = errorJson('Not found', 404, {
      'X-Custom': 'value',
    });
    expect(response.headers.get('X-Custom')).toBe('value');
  });
});

describe('mapErrorToResponse', () => {
  it('maps client abort to 499', async () => {
    const res = mapErrorToResponse('The user aborted a request');
    expect(res.status).toBe(499);
    const body = await res.json();
    expect(body.error).toBe('Client aborted request');
  });

  it('maps multipart error to 415', () => {
    const res = mapErrorToResponse('invalid multipart/form-data');
    expect(res.status).toBe(415);
  });

  it('maps file too large to 400', () => {
    const res = mapErrorToResponse('File too large (max 10MB)');
    expect(res.status).toBe(400);
  });

  it('maps invalid file format to 415', () => {
    const res = mapErrorToResponse('Invalid file format. Please upload a PDF.');
    expect(res.status).toBe(415);
  });

  it('maps failed to read PDF content to 400', () => {
    const res = mapErrorToResponse('Failed to read PDF content');
    expect(res.status).toBe(400);
  });

  it('maps AI invalid data to 502', () => {
    const res = mapErrorToResponse('AI returned invalid data format');
    expect(res.status).toBe(502);
  });

  it('maps malicious content to 400', () => {
    const res = mapErrorToResponse(
      'Potential malicious content detected: JavaScript',
    );
    expect(res.status).toBe(400);
  });

  it('defaults unknown errors to 502', async () => {
    const res = mapErrorToResponse('some unknown error');
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toBe('Upstream AI error or invalid response');
  });
});
