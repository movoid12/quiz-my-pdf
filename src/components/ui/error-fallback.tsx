import Link from "next/link";
import React from "react";

export default function ErrorFallback({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="text-6xl mb-4">❌</div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-base-content/70 mb-6">{description}</p>
      <Link href="/" className="btn btn-primary">
        Go Back to Upload
      </Link>
    </div>
  );
}
