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
            <p className="mb-3 font-semibold text-primary-content/80">
              Study smarter
            </p>
            <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl">
              Your notes, turned into a quiz that sticks.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
