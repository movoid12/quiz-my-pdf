import type { MenuItem } from '@/components/ui/bubble-menu';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_TEXT_CHARS = 25_000;
export const MIN_TEXT_CHARS = 100;

export const menuItems: MenuItem[] = [
  {
    id: 1,
    label: 'Home',
    href: '/',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6' },
  },
  {
    id: 2,
    label: 'New Quiz',
    href: '/dashboard/start',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981' },
  },
  {
    id: 3,
    label: 'GitHub',
    href: 'https://github.com/movoid12',
    rotation: -8,
    hoverStyles: { bgColor: '#f59e0b' },
  },
  {
    id: 4,
    label: 'My Quiz',
    href: '/dashboard/quiz',
    rotation: 8,
    hoverStyles: { bgColor: '#8b5cf6' },
  },
  {
    id: 5,
    label: 'My Result',
    href: '/dashboard/result',
    rotation: -8,
    hoverStyles: { bgColor: '#ec4899' },
  },
  {
    id: 6,
    label: 'History',
    href: '/dashboard/history',
    rotation: 8,
    hoverStyles: { bgColor: '#06b6d4' },
  },
];
