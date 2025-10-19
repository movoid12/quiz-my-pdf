'use client';

import { useId } from 'react';
import About from '@/components/sections/about';
import PdfUploadSection from '@/components/sections/pdf-upload-section';
import FeatureCard from '@/components/ui/feature-card';
import GradientText from '@/components/ui/gradient-text';
import Timeline from '@/components/ui/timeline';

export default function StartPage() {
  const uploadSectionId = useId();

  return (
    <div className="mx-auto max-w-4xl">
      {/* Hero Section */}
      <div className="hero mb-12 min-h-[60vh] rounded-2xl">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <GradientText
              className="text-5xl mb-4 font-bold"
              animationSpeed={10}
            >
              Quiz My PDF
            </GradientText>
            <p className="mb-8 text-base-content/70 text-xl">
              Transform any PDF document into an interactive quiz using advanced
              AI
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={`#${uploadSectionId}`}
                className="btn btn-primary btn-lg"
              >
                Upload PDF & Start
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12 grid gap-10 sm:grid-cols-3 max-sm:p-4">
        <FeatureCard
          emoji="🎓"
          title="For Students"
          description="Perfect for exam preparation and self-assessment"
        />
        <FeatureCard
          emoji="👨‍🏫"
          title="For Educators"
          description="Create engaging classroom activities effortlessly"
        />
        <FeatureCard
          emoji="📚"
          title="For Learners"
          description="Enhance understanding and retention of any material"
        />
      </div>

      {/* Upload Section */}
      <div
        id={uploadSectionId}
        className="card bg-base-100 border-1 border-base-content/10"
      >
        <div className="card-body">
          <h2 className="card-title mb-6 justify-center text-2xl">
            Get Started - Upload Your PDF
          </h2>
        </div>
        <PdfUploadSection />
      </div>

      {/* About Section */}
      <div className="card bg-base-100 border-1 border-base-content/10 mt-8">
        <div className="card-body">
          <About />
        </div>
      </div>

      {/* How it Works */}
      <h2 className="mt-16 mb-4 text-center font-bold text-3xl">
        How It Works
      </h2>
      <div className="hero">
        <div className="hero-content">
          <ul className="steps steps-vertical sm:steps-horizontal mb-12 w-full">
            <Timeline
              title="Upload PDF"
              description="Choose any PDF document"
            />
            <Timeline
              title="AI Analysis"
              description="Our AI analyzes the content"
            />
            <Timeline
              title="Generate Quiz"
              description="Relevant questions are created"
            />
            <Timeline title="Take Quiz" description="Test your knowledge" />
          </ul>
        </div>
      </div>
    </div>
  );
}
