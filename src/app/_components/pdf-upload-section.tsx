'use client';

import React, { useCallback, useState } from "react";

export default function PdfUploadSection() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");

    if (pdfFile) {
      setUploadedFile(pdfFile);
    } else {
      alert("Please upload a PDF file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleProcessPDF = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    // TODO: Implement AI processing with Vercel AI SDK

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Quiz generated successfully! (This is a demo)");
    }, 3000);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setIsProcessing(false);
  };

  uploadedFile && (
    <div className="text-center space-y-6">
      <div className="alert alert-success flex items-center">
        <svg
          className="w-6 h-6 stroke-success mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          PDF uploaded successfully:{" "}
          <span className="font-bold">{uploadedFile.name}</span>
        </span>
      </div>

      <div className="card bg-base-200 shadow-md max-w-md mx-auto">
        <div className="card-body">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-4xl">📄</div>
            <div>
              <h3 className="font-semibold truncate">{uploadedFile.name}</h3>
              <p className="text-sm opacity-70">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleProcessPDF}
              disabled={isProcessing}
              className="btn btn-primary"
            >
              {isProcessing ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Generating Quiz...
                </>
              ) : (
                "Generate Quiz"
              )}
            </button>
            <button onClick={resetUpload} className="btn btn-outline">
              Upload Different PDF
            </button>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="space-y-4 max-w-md mx-auto">
          <progress className="progress progress-primary w-full"></progress>
          <p className="text-sm opacity-70">
            Our AI is analyzing your PDF and creating relevant questions...
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div
        className={`drop-zone border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
          isDragOver
            ? "border-primary bg-primary/10"
            : "border-base-300 hover:border-primary/70"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        role="button"
      >
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold mb-2">
          Drag & drop your PDF here
        </h3>
        <p className="opacity-70 mb-6">or click to browse files</p>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="file-input file-input-bordered file-input-primary w-full max-w-xs mx-auto"
        />

        <div className="mt-4 text-sm opacity-60">
          Supported format: PDF (max 10MB)
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-sm">
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <span className="text-success mr-2">✓</span>
            What we support:
          </h4>
          <ul className="space-y-1 opacity-70 ml-6 list-disc">
            <li>Text-based PDFs</li>
            <li>Academic papers</li>
            <li>Textbooks &amp; guides</li>
            <li>Research documents</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <span className="text-info mr-2">ℹ</span>
            AI will generate:
          </h4>
          <ul className="space-y-1 opacity-70 ml-6 list-disc">
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
