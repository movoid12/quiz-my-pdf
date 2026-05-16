import { describe, expect, it } from 'vitest';
import { scanPdfContent } from '@/server/pdf/pdf-scanner';

describe('scanPdfContent', () => {
  it('passes clean PDF content', () => {
    const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n/Type /Catalog\nendobj');
    expect(() => scanPdfContent(buffer)).not.toThrow();
  });

  it('detects /JS keyword', () => {
    const buffer = Buffer.from('%PDF-1.4\n/JS some code');
    expect(() => scanPdfContent(buffer)).toThrow('JavaScript');
  });

  it('detects /JavaScript keyword', () => {
    const buffer = Buffer.from('%PDF-1.4\n/JavaScript');
    expect(() => scanPdfContent(buffer)).toThrow('JavaScript');
  });

  it('detects /AA (Auto-Action) keyword', () => {
    const buffer = Buffer.from('%PDF-1.4\n/AA');
    expect(() => scanPdfContent(buffer)).toThrow('Auto-Action');
  });

  it('detects /OpenAction keyword', () => {
    const buffer = Buffer.from('%PDF-1.4\n/OpenAction');
    expect(() => scanPdfContent(buffer)).toThrow('Open-Action');
  });

  it('detects /Launch keyword', () => {
    const buffer = Buffer.from('%PDF-1.4\n/Launch');
    expect(() => scanPdfContent(buffer)).toThrow('Launch Action');
  });

  it('reports all detected threats', () => {
    const buffer = Buffer.from('%PDF-1.4\n/JS\n/AA\n/Launch');
    expect(() => scanPdfContent(buffer)).toThrow(
      /JavaScript.*Auto-Action.*Launch Action/,
    );
  });

  it('handles empty buffer', () => {
    const buffer = Buffer.from('');
    expect(() => scanPdfContent(buffer)).not.toThrow();
  });

  it('is case-insensitive for keywords', () => {
    const buffer = Buffer.from('/js');
    expect(() => scanPdfContent(buffer)).toThrow('JavaScript');
  });
});
