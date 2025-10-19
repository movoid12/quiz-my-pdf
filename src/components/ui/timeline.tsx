export default function Timeline({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <li className="step step-primary">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-base-content/70 text-sm">{description}</p>
      </div>
    </li>
  );
}
