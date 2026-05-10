'use client';

import { useRouter } from 'next/navigation';
import FeatureCard from '@/components/ui/feature-card';
import GradientText from '@/components/ui/gradient-text';

export default function Home() {
  const router = useRouter();

  const navigateToStartPage = () => {
    router.push('/dashboard/start');
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="hero rounded-box border border-base-content/10 bg-base-100 shadow-sm">
          <div className="hero-content py-12 text-center">
            <div className="max-w-3xl space-y-6">
              <div className="badge badge-outline badge-lg">
                📄 AI quiz maker
              </div>
              <GradientText
                className="text-4xl font-bold sm:text-5xl"
                animationSpeed={10}
              >
                Quiz My PDF
              </GradientText>
              <p className="text-base-content/70 text-lg sm:text-xl">
                Turn study notes, textbooks, and research PDFs into a simple
                interactive quiz in just a few clicks.
              </p>
              <div className="card border border-base-content/10 bg-base-200 text-left shadow-xs">
                <div className="card-body gap-3">
                  <h2 className="card-title text-xl">✨ What this app does</h2>
                  <p className="text-base-content/70">
                    Upload a PDF, let AI analyze the content, and get quiz
                    questions that help you review faster and remember more.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={navigateToStartPage}
                className="btn btn-primary btn-lg"
              >
                Start Your PDF Quiz
              </button>
            </div>
          </div>
        </section>

        <section className="card border border-base-content/10 bg-base-100 shadow-sm">
          <div className="card-body gap-8">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold">🧭 Why people use it</h2>
              <p className="mx-auto max-w-2xl text-base-content/70">
                A quick overview for first-time visitors so they know exactly
                what happens next.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard
                emoji="🎓"
                title="For Students"
                description="Practice with quiz questions generated from your own study material."
              />
              <FeatureCard
                emoji="👨‍🏫"
                title="For Educators"
                description="Turn class resources into a fast review activity without manual question writing."
              />
              <FeatureCard
                emoji="⚡"
                title="How It Works"
                description="Upload a PDF, let the AI analyze it, and start answering questions right away."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
