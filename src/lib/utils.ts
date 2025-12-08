export function normalizeText(input: string, limit: number): string {
  return input.replace(/\s+/g, ' ').trim().slice(0, limit);
}

export function isLikelyPdf(buffer: Buffer): boolean {
  return buffer.subarray(0, 5).toString('utf-8') === '%PDF-';
}

import { MAX_FILE_SIZE } from '@/lib/constants';

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
