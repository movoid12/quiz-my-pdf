"use client";

import { questionsSchema } from "@/lib/quiz-schema";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import z from "zod";

type QuizData = z.infer<typeof questionsSchema>;

export default function PdfUploadSection() {
  const router = useRouter();

  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [error, setError] = useState<string | null>(null);

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
      console.log("is here", uploadedFile);
      setUploadedFile(pdfFile);
    } else {
      alert("Please upload a PDF file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setError(null);
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const handleProcessPDF = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("pdf", uploadedFile);

      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process PDF");
      }

      // Validate the response data structure
      if (!data || !data.questions) {
        throw new Error("Invalid quiz data received from server");
      }

      sessionStorage.setItem("currentQuiz", JSON.stringify(data));

      router.push("/quiz");
    } catch (error) {
      console.error("Processing error:", error);
      setError(error instanceof Error ? error.message : "Failed to process PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDebug = () => {
    const formData = new FormData();

    console.log(formData);
    console.log("Debugging PDF upload section");
    console.log("Uploaded file:", uploadedFile);
    console.log("Is processing:", isProcessing);
    console.log("Is drag over:", isDragOver);
    console.log("Error message:", error);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
    setIsProcessing(false);
  };

  if (uploadedFile) {
    return (
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
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="alert alert-error">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
