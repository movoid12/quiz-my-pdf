"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuiz } from "../../hooks/use-quiz";

export default function QuizPage() {
  const {
    isSubmitting,
    isLoading,
    answers,
    setAnswers,
    generatedQuiz,
    handleSubmit,
    currentQuestion,
    setCurrentQuestion,
  } = useQuiz();

  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  const handleAnswer = (questionId: number, answer: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (generatedQuiz) {
      if (currentQuestion < generatedQuiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = generatedQuiz?.questions[currentQuestion];

  const progress = generatedQuiz
    ? ((currentQuestion + 1) / generatedQuiz.questions.length) * 100
    : 0;

  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <h2 className="text-2xl font-bold mb-2">Submitting Your Quiz...</h2>
        <p className="text-base-content/70">
          Please wait while we calculate your results
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <h2 className="text-2xl font-bold mb-2">Loading Quiz...</h2>
        <p className="text-base-content/70">
          Please wait while we prepare your quiz
        </p>
      </div>
    );
  }

  if (
    !generatedQuiz ||
    !generatedQuiz.questions ||
    generatedQuiz.questions.length === 0
  ) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-2">No Quiz Available</h2>
        <p className="text-base-content/70 mb-6">
          We couldn't find a quiz to display. Please upload a PDF file and
          generate a quiz first.
        </p>
        <Link href="/" className="btn btn-primary">
          Go Back to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-6">
      {/* Header */}
      <div className="card bg-base-100 border-1 border-dashed border-base-content/25 m-0.5">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-lg font-bold card-title">
                {generatedQuiz?.title}
              </h1>
              <p className="text-base-content/70">📄 "example.pdf"</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-accent">
                ⏱️ {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-base-content/70">
                Question {currentQuestion + 1} of{" "}
                {generatedQuiz?.questions.length}
              </div>
            </div>
          </div>

          <progress
            className="progress progress-primary w-full"
            value={progress}
            max="100"
          ></progress>
        </div>
      </div>

      {/* Question Card */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <div className="mb-6">
            <div className="badge badge-accent font-bold mb-4">
              Question {currentQuestion + 1}
            </div>
            <h2 className="text-xl font-semibold card-title">
              {currentQ?.question}
            </h2>
          </div>

          {/* Answer Options */}
          {currentQ?.type === "multiple-choice" && (
            <div className="form-control flex flex-col gap-6">
              {currentQ.options?.map((option, index) => (
                <label
                  key={index}
                  className="cursor-pointer flex text-base-content/75"
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={index}
                    checked={answers[currentQ.id] === index}
                    onChange={() => handleAnswer(currentQ.id, index)}
                    className="radio radio-primary"
                  />
                  <span className="ml-4">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center m-2">
        <button className="nav-button btn btn-error join-item">
          <Link href="/dashboard">Exit Quiz</Link>
        </button>
        <div className="join">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="nav-button btn btn-outline join-item"
          >
            Previous
          </button>
        </div>

        <div className="join">
          {generatedQuiz ? (
            currentQuestion < generatedQuiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="nav-button btn btn-primary join-item"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="nav-button btn btn-success join-item"
                disabled={
                  Object.keys(answers).length < generatedQuiz.questions.length
                }
              >
                Submit Quiz
              </button>
            )
          ) : (
            <button className="nav-button btn btn-outline btn-primary join-item">
              Loading...
            </button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <div className="card bg-base-100 shadow-lg mt-2 items-center">
        <div className="card-body">
          <div className="flex flex-wrap gap-2">
            {generatedQuiz?.questions.map((question, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`nav-button btn ${
                  index === currentQuestion
                    ? "btn-primary"
                    : answers[generatedQuiz.questions[index].id] !== undefined
                    ? "btn-success"
                    : "btn-outline"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
