"use client";

export default function ResultStats({
  correctAnswers,
  totalQuestions,
}: {
  correctAnswers: number;
  totalQuestions: number;
}) {
  return (
    <div className="stats text-gray-300 shadow border-1 border-dashed">
      <div className="stat">
        <div className="stat-title">Correct</div>
        <div className="stat-value text-success">{correctAnswers}</div>
        <div className="stat-desc">of {totalQuestions}</div>
      </div>
    </div>
  );
}
