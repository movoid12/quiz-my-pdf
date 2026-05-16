// @vitest-environment jsdom

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useThemeStore } from '@/lib/stores/theme-store';

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

import Confetti from '@/components/ui/confetti';
import ErrorFallback from '@/components/ui/error-fallback';
import FeatureCard from '@/components/ui/feature-card';
import GradientText from '@/components/ui/gradient-text';
import List from '@/components/ui/list';
import Loading from '@/components/ui/loading';
import NavBar from '@/components/ui/navbar';
import RadialProgress from '@/components/ui/radial-progress';
import ThemeChanger from '@/components/ui/theme-changer';
import Timeline from '@/components/ui/timeline';

describe('ThemeChanger', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders moon icon in light mode', () => {
    useThemeStore.setState({ theme: 'light' });
    render(<ThemeChanger />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders sun icon in dark mode', () => {
    useThemeStore.setState({ theme: 'dark' });
    render(<ThemeChanger />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();
    useThemeStore.setState({ theme: 'light' });
    render(<ThemeChanger />);
    expect(useThemeStore.getState().theme).toBe('light');
    await user.click(screen.getByRole('button'));
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('sets data-theme attribute on document', () => {
    useThemeStore.setState({ theme: 'dark' });
    render(<ThemeChanger />);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

describe('NavBar', () => {
  it('renders brand name', () => {
    render(<NavBar />);
    expect(screen.getByText('QuizMyPDF')).toBeInTheDocument();
  });

  it('renders ThemeChanger', () => {
    render(<NavBar />);
    const themeButton = screen.getByRole('button');
    expect(themeButton).toBeInTheDocument();
  });
});

describe('Loading', () => {
  it('renders title and description', () => {
    render(<Loading title="Loading..." description="Please wait" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('renders spinner element', () => {
    const { container } = render(
      <Loading title="Loading..." description="Please wait" />,
    );
    expect(container.querySelector('.loading')).toBeInTheDocument();
  });
});

describe('ErrorFallback', () => {
  it('renders error title and description', () => {
    render(<ErrorFallback title="Error!" description="Something went wrong" />);
    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders go back link pointing to home', () => {
    render(<ErrorFallback title="Error!" description="Something went wrong" />);
    const link = screen.getByText('Go Back to Upload');
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });
});

describe('FeatureCard', () => {
  it('renders emoji, title and description', () => {
    render(
      <FeatureCard emoji="🚀" title="Fast" description="Lightning speed" />,
    );
    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('Fast')).toBeInTheDocument();
    expect(screen.getByText('Lightning speed')).toBeInTheDocument();
  });
});

describe('GradientText', () => {
  it('renders children', () => {
    render(<GradientText>Hello World</GradientText>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <GradientText className="custom-class">Text</GradientText>,
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('custom-class');
  });

  it('renders border when showBorder is true', () => {
    const { container } = render(<GradientText showBorder>Text</GradientText>);
    const borderDivs = container.querySelectorAll('.animate-gradient');
    expect(borderDivs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders without border by default', () => {
    const { container } = render(<GradientText>Text</GradientText>);
    const borderDivs = container.querySelectorAll('.animate-gradient');
    expect(borderDivs.length).toBe(1);
  });
});

describe('List', () => {
  it('renders title', () => {
    render(<List title="Items" items={['A', 'B']} />);
    expect(screen.getByText('Items')).toBeInTheDocument();
  });

  it('renders all items', () => {
    render(<List items={['Apple', 'Banana', 'Cherry']} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders empty heading when no title', () => {
    const { container } = render(<List items={['A']} />);
    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
    expect(heading?.textContent).toBe('');
  });
});

describe('Timeline', () => {
  it('renders title and description', () => {
    render(<Timeline title="Step 1" description="Do something" />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Do something')).toBeInTheDocument();
  });
});

describe('RadialProgress', () => {
  it('renders value percentage', () => {
    render(<RadialProgress value={75} size="100px" thickness="10px" />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('sets aria-valuenow', () => {
    render(<RadialProgress value={42} size="100px" thickness="10px" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('42');
  });
});

describe('Confetti', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders nothing when inactive', () => {
    const { container } = render(<Confetti active={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders particles when active', () => {
    render(<Confetti active={true} />);
    const particles = document.querySelectorAll(
      '[style*="animation: confetti-fall"]',
    );
    expect(particles.length).toBe(150);
  });

  it('clears particles after timeout', () => {
    render(<Confetti active={true} />);
    expect(
      document.querySelectorAll('[style*="animation: confetti-fall"]').length,
    ).toBe(150);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(
      document.querySelectorAll('[style*="animation: confetti-fall"]').length,
    ).toBe(0);
  });

  it('removes particles when active becomes false', () => {
    const { rerender } = render(<Confetti active={true} />);
    expect(
      document.querySelectorAll('[style*="animation: confetti-fall"]').length,
    ).toBe(150);
    rerender(<Confetti active={false} />);
    expect(
      document.querySelectorAll('[style*="animation: confetti-fall"]').length,
    ).toBe(0);
  });
});
