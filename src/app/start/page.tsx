'use client';

import PdfUploadSection from "../_components/pdf-upload-section";

export default function StartPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] rounded-2xl mb-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI PDF Quiz
            </h1>
            <p className="text-xl mb-8 text-base-content/70">
              Transform any PDF document into an interactive quiz using advanced
              artificial intelligence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#upload" className="btn btn-primary btn-lg">
                Upload PDF & Start
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="card-title justify-center">For Students</h3>
            <p className="text-base-content/70">
              Perfect for exam preparation and self-assessment
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="card-title justify-center">For Educators</h3>
            <p className="text-base-content/70">
              Create engaging classroom activities effortlessly
            </p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">📚</div>
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
          <h2 className="card-title text-2xl mb-6 justify-center">
            Get Started - Upload Your PDF
          </h2>
          <PdfUploadSection />
        </div>
      </div>

      {/* How it Works */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <ul className="steps steps-vertical lg:steps-horizontal w-full">
          <li className="step step-primary">
            <div>
              <h3 className="font-semibold">Upload PDF</h3>
              <p className="text-sm text-base-content/70">
                Choose any PDF document
              </p>
            </div>
          </li>
          <li className="step step-primary">
            <div>
              <h3 className="font-semibold">AI Analysis</h3>
              <p className="text-sm text-base-content/70">
                Our AI analyzes the content
              </p>
            </div>
          </li>
          <li className="step step-primary">
            <div>
              <h3 className="font-semibold">Generate Quiz</h3>
              <p className="text-sm text-base-content/70">
                Relevant questions are created
              </p>
            </div>
          </li>
          <li className="step step-primary">
            <div>
              <h3 className="font-semibold">Take Quiz</h3>
              <p className="text-sm text-base-content/70">
                Test your knowledge
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
