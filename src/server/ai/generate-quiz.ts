import 'server-only';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { questionsSchema } from '@/lib/quiz-schema';

function buildPrompt(extractedText: string) {
  const system =
    'You are an expert quiz generator. Return only JSON matching the provided Zod schema. No extra text.';
  const user = `
Create exactly 5 challenging but fair multiple-choice questions based on the provided text and its language.
- Use 4 options per question.
- correctAnswer must be the index (0-based) of the correct option.
- Ensure answers are accurate and derived from the text.

Text:
${extractedText}
  `.trim();
  return { system, user };
}

export async function generateQuizFromText(text: string) {
  const { system, user } = buildPrompt(text);

  const { object } = await generateObject({
    model: google('gemini-2.5-flash-lite'),
    schema: questionsSchema,
    system,
    messages: [{ role: 'user', content: user }],
    temperature: 0.5,
    maxOutputTokens: 1500,
  });

  const parsed = questionsSchema.safeParse(object);

  if (!parsed.success) {
    throw new Error('AI returned invalid data format');
  }

  return parsed.data;
}
