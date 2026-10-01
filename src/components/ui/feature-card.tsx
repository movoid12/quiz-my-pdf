'use client';

import { handleSpotlightPointerMove } from '@/lib/utils';

export default function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-box border border-base-content/10 bg-base-100 transition-colors duration-300 before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] before:[background:radial-gradient(320px_circle_at_var(--x,50%)_var(--y,50%),color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_70%)] hover:before:opacity-100 cursor-default"
      onPointerMove={handleSpotlightPointerMove}
    >
      {/* improve-start-page-ui.HOMEPAGE_CARDS.1 */}
      <div className="relative z-10 flex h-full flex-col items-center p-6 text-center">
        {/* improve-start-page-ui.HOMEPAGE_CARDS.2 */}
        <div className="mb-4 text-4xl">{emoji}</div>
        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        <p className="text-base-content/70">{description}</p>
      </div>
    </div>
  );
}
