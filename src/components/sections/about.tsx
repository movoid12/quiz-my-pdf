import List from '../ui/list';

const supportList = [
  'Text-based PDFs',
  'Academic papers',
  'Textbooks & guides',
  'Research documents',
];

const generateList = ['Multiple choice questions', 'Difficulty-based scoring'];

export default function About() {
  return (
    <div className="hero-content items-start grid gap-6 md:grid-cols-2 ">
      <div className="space-y-2 justify-self-center">
        <List title="📄 Supported document types:" items={supportList} />
      </div>
      <div className="space-y-2 md:justify-self-center">
        <List title="🤖 AI will generate:" items={generateList} />
      </div>
    </div>
  );
}
