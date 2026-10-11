'use client';

import { useEffect, useRef } from 'react';

export default function ScrollExpand() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!(section && frame)) {
      return;
    }

    const update = () => {
      const range = section.offsetHeight - window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, -section.getBoundingClientRect().top / range),
      );
      const inset = 32 * (1 - progress);
      const radius = 24 * (1 - progress);
      frame.style.clipPath = `inset(${inset}% round ${radius}px)`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="A more engaging way to study"
      className="relative h-[125vh] min-h-162.5"
    >
      <div className="sticky top-6 flex h-[70vh] min-h-105 items-center justify-center">
        <div
          ref={frameRef}
          className="relative h-full w-full overflow-hidden bg-neutral-900"
          style={{ clipPath: 'inset(32% round 24px)' }}
        >
          {/* improve-start-page-ui.HOMEPAGE.1 */}
          <img
            src="/study-desk.jpg"
            alt="Open study materials laid out on a desk"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-8 pb-10 text-white sm:px-12 sm:pb-14">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm font-medium text-white/80">
              <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
                Study smarter
              </span>
              <span>Built from what you already know</span>
            </div>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              Turn passive reading into active recall.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Upload your material, practice the ideas that matter, and see
              where you need another look — all in one focused study flow.
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-sm text-white/90">
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-sm">
                Personalised questions
              </span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-sm">
                Instant feedback
              </span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-sm">
                Learn at your pace
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
