import Link from 'next/link';

export default function ErrorFallback({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <div className="mb-4 text-6xl">❌</div>
      <h2 className="mb-2 font-bold text-2xl">{title}</h2>
      <p className="mb-6 text-base-content/70">{description}</p>
      <Link href="/" className="btn btn-primary">
        Go Back to Upload
      </Link>
    </div>
  );
}
