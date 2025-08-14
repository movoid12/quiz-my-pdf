'use client';

export default function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="card bg-base-100 border-1 border-base-content/10">
      <div className="card-body items-center text-center">
        <div className="mb-4 text-4xl">{emoji}</div>
        <h3 className="card-title justify-center">{title}</h3>
        <p className="text-base-content/70">{description}</p>
      </div>
    </div>
  );
}
