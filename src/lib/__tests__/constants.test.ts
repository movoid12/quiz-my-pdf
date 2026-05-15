import { describe, expect, it } from 'vitest';
import {
  MAX_FILE_SIZE,
  MAX_TEXT_CHARS,
  MIN_TEXT_CHARS,
  menuItems,
} from '@/lib/constants';

describe('constants', () => {
  it('MAX_FILE_SIZE is 10MB', () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
  });

  it('MAX_TEXT_CHARS is 25000', () => {
    expect(MAX_TEXT_CHARS).toBe(25_000);
  });

  it('MIN_TEXT_CHARS is 100', () => {
    expect(MIN_TEXT_CHARS).toBe(100);
  });

  it('MAX_FILE_SIZE > MAX_TEXT_CHARS', () => {
    expect(MAX_FILE_SIZE).toBeGreaterThan(MAX_TEXT_CHARS);
  });
});

describe('menuItems', () => {
  it('has 4 items', () => {
    expect(menuItems).toHaveLength(4);
  });

  it('has Home as first item', () => {
    expect(menuItems[0].label).toBe('Home');
    expect(menuItems[0].href).toBe('/');
  });

  it('has New Quiz as second item', () => {
    expect(menuItems[1].label).toBe('New Quiz');
    expect(menuItems[1].href).toBe('/dashboard/start');
  });

  it('all items have required fields', () => {
    for (const item of menuItems) {
      expect(item.id).toBeDefined();
      expect(item.label).toBeDefined();
      expect(item.href).toBeDefined();
      expect(typeof item.rotation).toBe('number');
      expect(item.hoverStyles?.bgColor).toBeDefined();
    }
  });
});
