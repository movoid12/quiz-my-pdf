export default function List({
  title,
  items,
}: {
  title?: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="mb-6 text-xl font-semibold">{title}</h3>
      <ul className="space-y-5">
        {items.map((item, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: ui component
            key={index}
            className="relative ml-9 before:absolute before:-mt-[6px] before:-ml-7 before:-scale-x-100 before:rotate-45 before:text-2xl before:font-semibold before:text-[#40ffaa] before:content-['L'] md:font-medium"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
