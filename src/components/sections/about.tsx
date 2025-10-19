export default function About() {
  return (
    <div className="hero-content items-start grid gap-6 md:grid-cols-2 ">
      <div className="space-y-2">
        <h4 className="flex items-center font-semibold">
          <span className="mr-2 text-success">✓</span>
          The App support:
        </h4>
        <ul className="ml-6 list-disc space-y-1 opacity-70">
          <li>Text-based PDFs</li>
          <li>Academic papers</li>
          <li>Textbooks &amp; guides</li>
          <li>Research documents</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h4 className="flex items-center font-semibold">
          <span className="mr-2 text-info">ℹ</span>
          AI will generate:
        </h4>
        <ul className="ml-6 list-disc space-y-1 opacity-70">
          <li>Multiple choice questions</li>
          <li>Difficulty-based scoring</li>
        </ul>
      </div>
    </div>
  );
}
