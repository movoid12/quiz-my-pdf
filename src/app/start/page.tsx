'use client';

import PdfUploadSection from '@/components/pdf-upload-section';

export default function StartPage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Hero Section */}
      <div className="hero mb-12 min-h-[60vh] rounded-2xl">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold text-5xl text-transparent">
              Quiz My PDF
            </h1>
            <p className="mb-8 text-base-content/70 text-xl">
              Transform any PDF document into an interactive quiz using advanced
              AI
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#upload" className="btn btn-primary btn-lg">
                Upload PDF & Start
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12 grid gap-8 md:grid-cols-3">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <div className="mb-4 text-4xl">🎓</div>
            <h3 className="card-title justify-center">For Students</h3>
            <p className="text-base-content/70">
              Perfect for exam preparation and self-assessment
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <div className="mb-4 text-4xl">👨‍🏫</div>
            <h3 className="card-title justify-center">For Educators</h3>
            <p className="text-base-content/70">
              Create engaging classroom activities effortlessly
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <div className="mb-4 text-4xl">📚</div>
            <h3 className="card-title justify-center">For Learners</h3>
            <p className="text-base-content/70">
              Enhance understanding and retention of any material
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div id="upload" className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-6 justify-center text-2xl">
            Get Started - Upload Your PDF
          </h2>
        </div>
        <PdfUploadSection />
      </div>

      {/* How it Works */}
      <h2 className="mt-16 mb-4 text-center font-bold text-3xl">
        How It Works
      </h2>
      <div className="hero">
        <div className="hero-content">
          <ul className="steps steps-vertical sm:steps-horizontal mb-12 w-full">
            <li className="step step-primary">
              <div>
                <h3 className="font-semibold">Upload PDF</h3>
                <p className="text-base-content/70 text-sm">
                  Choose any PDF document
                </p>
              </div>
            </li>
            <li className="step step-primary">
              <div>
                <h3 className="font-semibold">AI Analysis</h3>
                <p className="text-base-content/70 text-sm">
                  Our AI analyzes the content
                </p>
              </div>
            </li>
            <li className="step step-primary">
              <div>
                <h3 className="font-semibold">Generate Quiz</h3>
                <p className="text-base-content/70 text-sm">
                  Relevant questions are created
                </p>
              </div>
            </li>
            <li className="step step-primary">
              <div>
                <h3 className="font-semibold">Take Quiz</h3>
                <p className="text-base-content/70 text-sm">
                  Test your knowledge
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
