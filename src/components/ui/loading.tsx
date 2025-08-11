

type Loading = {
  title: string;
  description: string;
};

export default function Loading({ title, description }: Loading) {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <span className="loading loading-spinner loading-lg mb-4 text-primary"></span>
      <h2 className="mb-2 font-bold text-2xl">{title}</h2>
      <p className="text-base-content/70">{description}</p>
    </div>
  );
}
