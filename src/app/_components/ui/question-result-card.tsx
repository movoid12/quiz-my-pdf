import { quizResultSchema } from "@/lib/quiz-result-schema";
import z from "zod";

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
      className={`card bg-base-100 shadow ${
        isCorrect ? "border border-success" : "border border-error"
      }`}
    >
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="badge badge-primary mb-2">Question {index + 1}</div>
            <h3 className="card-title text-base md:text-lg">
              {quizResult.question}
            </h3>
          </div>
          <div
            className={`badge ${isCorrect ? "badge-success" : "badge-error"}`}
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </div>
        </div>

        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-base-200">
            <div className="text-sm text-base-content/70 mb-1">Your answer</div>
            <div className="font-medium">
              {userLabel}
              {typeof quizResult.userAnswer === "number" && (
                <span className="text-base-content/60">
                  {" "}
                  (#{quizResult.userAnswer + 1})
                </span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-base-200">
            <div className="text-sm text-base-content/70 mb-1">
              Correct answer
            </div>
            <div className="font-medium">
              {correctLabel}
              <span className="text-base-content/60">
                {" "}
                (#{quizResult.correctAnswer + 1})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
