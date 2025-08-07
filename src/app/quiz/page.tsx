"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock quiz data - in real app this would come from AI generation
const mockQuizData = {
  title: "Introduction to Machine Learning",
  fileName: "ml-basics.pdf",
  questions: [
    {
      id: 1,
      question: "What is the primary goal of supervised learning?",
      type: "multiple-choice",
      options: [
        "To find hidden patterns in data without labels",
        "To learn from labeled training data to make predictions",
        "To reduce the dimensionality of data",
        "To cluster similar data points together",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "What is the primary goal of supervised learning?",
      type: "multiple-choice",
      options: [
        "To find hidden patterns in data without labels",
        "To learn from labeled training data to make predictions",
        "To reduce the dimensionality of data",
        "To cluster similar data points together",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      question:
        "The process of splitting data into training and testing sets helps to:",
      type: "multiple-choice",
      options: [
        "Increase the size of the dataset",
        "Evaluate model performance on unseen data",
        "Speed up the training process",
        "Reduce computational complexity",
      ],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "What is the primary goal of supervised learning?",
      type: "multiple-choice",
      options: [
        "To find hidden patterns in data without labels",
        "To learn from labeled training data to make predictions",
        "To reduce the dimensionality of data",
        "To cluster similar data points together",
      ],
      correctAnswer: 1,
    },
    {
      id: 5,
      question:
        "The process of splitting data into training and testing sets helps to:",
      type: "multiple-choice",
      options: [
        "Increase the size of the dataset",
        "Evaluate model performance on unseen data",
        "Speed up the training process",
        "Reduce computational complexity",
      ],
      correctAnswer: 1,
    },
  ],
};

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < mockQuizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Calculate score and prepare results
    let score = 0;
    const results = mockQuizData.questions.map((question) => {
      const userAnswer = answers[question.id];
      let isCorrect = false;

      if (
        question.type === "multiple-choice" ||
        question.type === "true-false"
      ) {
        isCorrect = userAnswer === question.correctAnswer;
      }

      if (isCorrect) score++;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        type: question.type,
      };
    });

    // Store results in sessionStorage (in real app would save to database)
    const quizResults = {
      title: mockQuizData.title,
      fileName: mockQuizData.fileName,
      score: Math.round((score / mockQuizData.questions.length) * 100),
      totalQuestions: mockQuizData.questions.length,
      correctAnswers: score,
      results,
      completedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("quizResults", JSON.stringify(quizResults));

    // Simulate processing time
    setTimeout(() => {
      router.push("/result");
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = mockQuizData.questions[currentQuestion];
  const progress =
    ((currentQuestion + 1) / mockQuizData.questions.length) * 100;

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

  return (
    <div className="max-w-4xl mx-auto pt-6">
      {/* Header */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold card-title">
                {mockQuizData.title}
              </h1>
              <p className="text-base-content/70">📄 {mockQuizData.fileName}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-primary">
                ⏱️ {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-base-content/70">
                Question {currentQuestion + 1} of{" "}
                {mockQuizData.questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
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
            <div className="badge badge-primary mb-4">
              Question {currentQuestion + 1}
            </div>
            <h2 className="text-xl font-semibold card-title mb-4">
              {currentQ.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.type === "multiple-choice" && (
              <div className="form-control flex flex-col gap-2">
                {currentQ.options?.map((option, index) => (
                  <label
                    key={index}
                    className="label cursor-pointer justify-start"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={index}
                      checked={answers[currentQ.id] === index}
                      onChange={() => handleAnswer(currentQ.id, index)}
                      className="radio radio-primary mr-3"
                    />
                    <span className="label-text">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
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
          {currentQuestion < mockQuizData.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="nav-button btn btn-outline btn-primary join-item"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="nav-button btn btn-outline btn-success join-item"
              disabled={
                Object.keys(answers).length < mockQuizData.questions.length
              }
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <div className="card bg-base-100 shadow-lg mt-6">
        <div className="card-body">
          <h3 className="card-title mb-3">Question Navigator</h3>
          <div className="flex flex-wrap gap-2">
            {mockQuizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`nav-button btn ${
                  index === currentQuestion
                    ? "btn-primary"
                    : answers[mockQuizData.questions[index].id] !== undefined
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
