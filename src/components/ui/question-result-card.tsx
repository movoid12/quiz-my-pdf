'use client';

import type z from 'zod';
import type { quizResultSchema } from '@/lib/validation';

type QuizResult = z.infer<typeof quizResultSchema>;

export default function QuestionResultCard({
  isCorrect,
  index,
  userLabel,
  correctLabel,
  quizResult,
}: {
  correctLabel: string;
  isCorrect: boolean;
  index: number;
  userLabel: string;
  quizResult: QuizResult;
}) {
  return (
    <div
      key={quizResult.questionId ?? index}
      className={`card bg-base-200 shadow-lg ${
        isCorrect ? 'border border-success' : 'border border-error bg-error/15'
      }`}
    >
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="badge badge-soft mb-2 text-xs">
              Question {index + 1}
            </div>
            <h3 className="card-title text-base md:text-lg">
              {quizResult.question}
            </h3>
          </div>
          <div
            className={`badge ${isCorrect ? 'badge-success' : 'badge-error'} font-semibold`}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-base-200 p-3 shadow-md">
            <div className="mb-1 text-base-content/70 text-sm">Your answer</div>
            <div className="font-medium">
              {userLabel}
              <br />
              <span className="text-base-content/60">
                (#{Number(quizResult.userAnswer) + 1})
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-success/50 p-3 shadow-md">
            <div className="text-base-content text-sm">Correct answer</div>
            <div className="font-medium">
              {correctLabel}
              <br />
              <span className="text-base-content/60">
                (#{Number(quizResult.correctAnswer) + 1})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
