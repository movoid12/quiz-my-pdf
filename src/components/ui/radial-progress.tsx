'use client';

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
          '--value': value,
          '--size': size,
          '--thickness': thickness,
        } as React.CSSProperties
      }
      aria-valuenow={value}
      role="progressbar"
      aria-label="Progress"
    >
      <span className="font-bold text-base-content/70">{value}%</span>
    </div>
  );
}
