import dayjs from 'dayjs';
import { MAX_FILE_SIZE } from '@/lib/constants';

export function formatRelativeTime(
  date: Date | string | number | null | undefined,
): string {
  const start = date ? dayjs(date) : dayjs();
  const end = dayjs();

  const diffInSeconds = end.diff(start, 'second');
  const diffInMinutes = end.diff(start, 'minute');
  const diffInHours = end.diff(start, 'hour');
  const diffInDays = end.diff(start, 'day');

  if (diffInSeconds < 60) {
    return 'Just now';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return start.toDate().toLocaleString();
}

export function formatFullDate(date: Date | string | number): string {
  //in german locale, only date and time without seconds
  return dayjs(date).locale('de').format('DD.MM.YYYY, HH:mm');
}

// ai-quiz-generation.TEXT.3
export function normalizeText(input: string, limit: number): string {
  return input.replace(/\s+/g, ' ').trim().slice(0, limit);
}

// ai-quiz-generation.TEXT.1
export function isLikelyPdf(buffer: Buffer): boolean {
  return buffer.subarray(0, 5).toString('utf-8') === '%PDF-';
}

export function errorJson(
  message: string,
  status: number,
  headers?: Record<string, string>,
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...(headers ?? {}) },
  });
}

export async function validatePdfUpload(file: File): Promise<void> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large (max 10MB)');
  }

  const headerBuffer = Buffer.from(
    new Uint8Array(await file.slice(0, 5).arrayBuffer()),
  );
  if (!isLikelyPdf(headerBuffer)) {
    throw new Error('Invalid file format. Please upload a PDF.');
  }
}

export function mapErrorToResponse(message: string): Response {
  if (message.includes('The user aborted a request')) {
    return errorJson('Client aborted request', 499);
  }
  if (message.includes('multipart/form-data')) {
    return errorJson(message, 415);
  }
  if (message.includes('File too large')) {
    return errorJson(message, 400);
  }
  if (message.includes('Invalid file format')) {
    return errorJson(message, 415);
  }
  if (message.includes('Failed to read PDF content')) {
    return errorJson(message, 400);
  }
  if (message.includes('AI returned invalid data format')) {
    return errorJson(message, 502);
  }
  if (message.includes('Potential malicious content detected')) {
    return errorJson(message, 400);
  }
  return errorJson('Upstream AI error or invalid response', 502);
}
