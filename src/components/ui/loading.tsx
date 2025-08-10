import React from "react";

type Loading = {
  title: string;
  description: string;
};

export default function Loading({ title, description }: Loading) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-base-content/70">{description}</p>
    </div>
  );
}
