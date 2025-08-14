'use client';

import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import QuizLevelModal from './quiz-level-modal';

export default function PdfUploadSection() {
  const router = useRouter();

  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const pdfFile = files.find((file) => file.type === 'application/pdf');

      if (pdfFile) {
        console.log('is here', uploadedFile);
        setUploadedFile(pdfFile);
      } else {
        alert('Please upload a PDF file');
      }
    },
    [uploadedFile],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const handleProcessPdfWithLevel = async (level: string) => {
    if (!uploadedFile) {
      return;
    }

    setIsModalOpen(false);
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', uploadedFile);
      formData.append('level', level);

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process PDF');
      }

      if (!data?.questions) {
        throw new Error('Invalid quiz data received from server');
      }

      sessionStorage.setItem('currentQuiz', JSON.stringify(data));

      router.push('/quiz');
    } catch (error) {
      console.error('Processing error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to process PDF',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
    setIsProcessing(false);
  };

  if (uploadedFile) {
    return (
      <div className="space-y-6 text-center mb-8 w-full">
        <div className="alert alert-success flex justify-center">
          <Check />
          <span>
            PDF uploaded successfully:
            <span className="font-bold">{uploadedFile.name}</span>
          </span>
        </div>

        <div className="card mx-auto max-w-md bg-base-200 shadow-md">
          <div className="card-body">
            <div className="mb-4 flex items-center justify-center space-x-4">
              <div className="text-4xl">📄</div>
              <div>
                <h3 className="truncate font-semibold">{uploadedFile.name}</h3>
                <p className="text-sm opacity-70">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4 max-sm:flex-col">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={isProcessing}
                className="btn btn-primary"
              >
                {isProcessing ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Generating Quiz...
                  </>
                ) : (
                  'Generate Quiz'
                )}
              </button>
              <button
                type="button"
                onClick={resetUpload}
                className="btn btn-outline"
              >
                Upload Different PDF
              </button>
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="mx-auto max-w-md space-y-4">
            <progress className="progress progress-primary w-full"></progress>
            <p className="text-sm opacity-70">
              Our AI is analyzing your PDF and creating relevant questions...
            </p>
          </div>
        )}

        {isModalOpen && (
          <QuizLevelModal
            handleProcessPdfWithLevel={handleProcessPdfWithLevel}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="alert alert-error">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Error Icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {/** biome-ignore lint/a11y/useSemanticElements: Using div for drag and drop functionality */}
      <div
        className={`drop-zone cursor-pointer rounded-lg border-2 border-dashed m-2 p-12 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/10'
            : 'border-base-300 hover:border-primary/70'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        role="button"
      >
        <div className="mb-4 text-6xl">📄</div>
        <h3 className="mb-2 font-semibold text-xl">
          Drag & drop your PDF here
        </h3>
        <p className="mb-6 opacity-70">or click to browse files</p>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="file-input file-input-bordered file-input-primary mx-auto w-full max-w-xs"
        />

        <div className="mt-4 text-sm opacity-60">
          Supported format: PDF (max 10MB)
        </div>
      </div>

      <div className="hero-content grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="flex items-center font-semibold">
            <span className="mr-2 text-success">✓</span>
            What we support:
          </h4>
          <ul className="ml-6 list-disc space-y-1 opacity-70">
            <li>Text-based PDFs</li>
            <li>Academic papers</li>
            <li>Textbooks &amp; guides</li>
            <li>Research documents</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center font-semibold">
            <span className="mr-2 text-info">ℹ</span>
            AI will generate:
          </h4>
          <ul className="ml-6 list-disc space-y-1 opacity-70">
            <li>Multiple choice questions</li>
            <li>True/false questions</li>
            <li>Short answer questions</li>
            <li>Difficulty-based scoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
