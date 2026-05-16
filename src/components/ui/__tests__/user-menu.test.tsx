// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authClient } from '@/lib/auth-client';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
    signOut: vi.fn(),
  },
}));

import UserMenu from '@/components/ui/user-menu';

beforeEach(() => {
  vi.clearAllMocks();
});

function mockUseSession(name: string) {
  return {
    data: {
      user: {
        id: '1',
        name,
        email: 'test@test.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: '1',
        userId: '1',
        expiresAt: new Date(),
        token: 'token',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  };
}

function renderMenu() {
  return render(<UserMenu />);
}

describe('UserMenu', () => {
  it('renders user initials when logged in', () => {
    (authClient.useSession as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseSession('Test User'),
    );
    renderMenu();
    expect(screen.getByText('TE')).toBeInTheDocument();
  });

  it('renders single char for single-word name', () => {
    (authClient.useSession as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseSession('Alice'),
    );
    renderMenu();
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('opens dropdown on button click', async () => {
    const user = userEvent.setup();
    (authClient.useSession as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseSession('Test User'),
    );
    renderMenu();
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('closes dropdown on second click', async () => {
    const user = userEvent.setup();
    (authClient.useSession as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseSession('Test User'),
    );
    renderMenu();
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    await user.click(button);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('calls signOut and redirects on sign out click', async () => {
    const user = userEvent.setup();
    (authClient.useSession as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseSession('Test User'),
    );
    (authClient.signOut as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { success: true },
    });
    renderMenu();
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Sign Out'));
    expect(authClient.signOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('navigates to profile on profile link click', async () => {
    const user = userEvent.setup();
    (authClient.useSession as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseSession('Test User'),
    );
    renderMenu();
    await user.click(screen.getByRole('button'));
    const profileLink = screen.getByText('Profile');
    expect(profileLink.closest('a')).toHaveAttribute(
      'href',
      '/dashboard/profile',
    );
  });
});
