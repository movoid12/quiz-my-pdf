"use client";

function Backup({
  value,
  size,
  thickness,
}: {
  value: number;
  size: string; // e.g. "100px" or "6rem"
  thickness: string; // e.g. "8px"
}) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const dashoffset = circumference - (progress / 100) * circumference;

  // Color logic (green/yellow/red)
  const getColor = (v: number) => {
    if (v >= 80) return "text-green-500";
    if (v >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Score"
      title={`${progress}%`}
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={thickness}
          fill="none"
        />
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          className={`${getColor(progress)} transition-all duration-500`}
        />
      </svg>
      <span className="absolute text-black font-bold text-sm select-none">
        {progress}%
      </span>
    </div>
  );
}

export default function RadialProgress({
  value,
  size,
  thickness,
}: {
  value: number;
  size: string;
  thickness: string;
}) {
  return (
    <div
      className="radial-progress text-success"
      style={
        {
          "--value": value,
          "--size": size,
          "--thickness": thickness,
        } as React.CSSProperties
      }
      aria-valuenow={value}
      role="progressbar"
    >
      <span className="text-black">{value}%</span>
    </div>
  );
}
