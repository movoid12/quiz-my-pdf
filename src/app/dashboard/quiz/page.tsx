'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ErrorFallback from '@/components/ui/error-fallback';
import Loading from '@/components/ui/loading';
import { useQuiz } from '@/hooks/use-quiz';

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

  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      handleSubmit();
    }

    return () => window.clearInterval(id);
  }, [timeLeft, handleSubmit]);

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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = generatedQuiz?.questions[currentQuestion];

  const progress = generatedQuiz
    ? ((currentQuestion + 1) / generatedQuiz.questions.length) * 100
    : 0;

  if (isSubmitting) {
    return (
      <Loading
        title="Submitting Your Quiz..."
        description="Please wait while we calculate your results"
      />
    );
  }

  if (isLoading) {
    return (
      <Loading
        title="Loading Quiz..."
        description="Please wait while we load your quiz."
      />
    );
  }

  if (!generatedQuiz?.questions || generatedQuiz.questions.length === 0) {
    return (
      <ErrorFallback
        title="No Quiz Available"
        description="We couldn't find a quiz to display. Please upload a PDF file and generate a quiz first."
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl pt-6 pl-2 pr-2">
      {/* Header */}
      <div className="card m-0.5 border-1 border-base-content/25 border-dashed bg-base-100">
        <div className="card-body">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="card-title font-bold text-lg">
                {generatedQuiz?.title}
              </h1>
              <p className="text-base-content/70">📄 "example.pdf"</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-accent text-lg">
                ⏱️ {formatTime(timeLeft)}
              </div>
              <div className="text-base-content/70 text-xs">
                Question {currentQuestion + 1} of{' '}
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
      <div className="card mb-6 mt-2 bg-base-100  shadow-md border-1 border-base-content/10">
        <div className="card-body">
          <div className="mb-6">
            <div className="badge badge-accent mb-4 font-bold">
              Question {currentQuestion + 1}
            </div>
            <h2 className="card-title font-semibold text-xl">
              {currentQ?.question}
            </h2>
          </div>

          {/* Answer Options */}
          {currentQ?.type === 'multiple-choice' && (
            <div className="form-control flex flex-col gap-6">
              {currentQ.options?.map((option, index) => (
                <label
                  key={option}
                  className="flex cursor-pointer text-base-content/75"
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
      <div className="border-1 border-base-content/10 rounded">
        <div className="m-2 flex items-center justify-between">
          <button
            type="button"
            className="nav-button btn btn-error rounded join-item"
          >
            <Link href="/">Exit Quiz</Link>
          </button>
          <div className="join">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="nav-button btn btn-outline join-item"
            >
              Previous
            </button>
          </div>

          <div className="join">
            {generatedQuiz &&
              (currentQuestion < generatedQuiz.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="nav-button btn btn-primary join-item"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="nav-button btn btn-success join-item"
                  disabled={
                    Object.keys(answers).length < generatedQuiz.questions.length
                  }
                >
                  Submit Quiz
                </button>
              ))}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="card mt-2 items-center bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex flex-wrap gap-2">
              {generatedQuiz?.questions.map((question, index) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentQuestion(index)}
                  className={`nav-button btn ${
                    index === currentQuestion
                      ? 'btn-primary'
                      : answers[generatedQuiz.questions[index].id] !== undefined
                        ? 'btn-success'
                        : 'btn-outline'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
