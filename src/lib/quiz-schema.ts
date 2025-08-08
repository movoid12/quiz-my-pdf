import z from "zod";

export const questionSchema = z.object({
  id: z.number().int().nonnegative(),
  question: z.string().min(5, "Question must be at least 5 characters"),
  type: z.literal("multiple-choice"),
  options: z
    .array(z.string().min(1))
    .length(4, "Exactly 4 options are required"),
  correctAnswer: z.number().int().min(0).max(3),
});

export const questionsSchema = z.object({
  title: z.string().min(1).max(200),
  questions: z
    .array(questionSchema)
    .length(5, "Exactly 5 questions are required"),
});

export type GeneratedQuiz = z.infer<typeof questionsSchema>;
