import { TRPCError } from '@trpc/server';
import { and, asc, desc, eq } from 'drizzle-orm';
import z from 'zod';
import { questionAnswers, questions, quizAttempts, quizzes } from '@/db/schema';
import type { ClientQuiz } from '@/lib/validation';
import { db } from '../db';
import { protectedProcedure, router } from '../trpc';

const toClientQuiz = (quiz: {
  id: string;
  title: string;
  category: ClientQuiz['category'];
  difficulty: ClientQuiz['difficulty'];
  questions: Array<{
    id: string;
    question: string;
    type: string;
    options: string[];
    displayOrder: number;
  }>;
}): ClientQuiz => ({
  quizId: quiz.id,
  title: quiz.title,
  category: quiz.category,
  difficulty: quiz.difficulty,
  questions: quiz.questions.map((question) => ({
    id: question.id,
    question: question.question,
    type: 'multiple-choice',
    options: question.options,
    order: question.displayOrder,
  })),
});

export const quizRouter = router({
  saveAttempt: protectedProcedure
    .input(
      z.object({
        quizId: z.uuid(),
        answers: z.array(
          z.object({
            questionId: z.uuid(),
            selectedOption: z.number().int().min(0).max(3),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch quiz metadata and correct answers in parallel — neither depends on the other
      const [quiz, correctAnswerRows] = await Promise.all([
        db.query.quizzes.findFirst({ where: eq(quizzes.id, input.quizId) }),
        db
          .select({
            questionId: questionAnswers.questionId,
            correctAnswer: questionAnswers.correctAnswer,
          })
          .from(questionAnswers)
          .innerJoin(questions, eq(questions.id, questionAnswers.questionId))
          .where(eq(questions.quizId, input.quizId)),
      ]);

      if (!quiz) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      if (quiz.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const answerMap = new Map(
        correctAnswerRows.map((r) => [r.questionId, r.correctAnswer]),
      );

      let correct = 0;

      const scoredAnswers = input.answers.map((a) => {
        const correctAnswer = answerMap.get(a.questionId) ?? -1;
        const isCorrect = correctAnswer === a.selectedOption;
        if (isCorrect) {
          correct++;
        }
        return {
          questionId: a.questionId,
          selectedOption: a.selectedOption,
          isCorrect,
          correctAnswer,
        };
      });

      const total = input.answers.length;

      const score = total > 0 ? Math.round((correct / total) * 100) : 0;

      const [attempt] = await db
        .insert(quizAttempts)
        .values({
          quizId: input.quizId,
          userId: ctx.session.user.id,
          score,
          totalQuestions: total,
          correctAnswers: correct,
          answers: scoredAnswers,
        })
        .returning();

      return {
        attemptId: attempt.id,
        score,
        correct,
        total,
        answers: scoredAnswers,
      };
    }),

  history: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const attempts = await db
        .select({
          attemptId: quizAttempts.id,
          score: quizAttempts.score,
          totalQuestions: quizAttempts.totalQuestions,
          correctAnswers: quizAttempts.correctAnswers,
          completedAt: quizAttempts.completedAt,
          quizId: quizzes.id,
          title: quizzes.title,
          category: quizzes.category,
          difficulty: quizzes.difficulty,
        })
        .from(quizAttempts)
        .innerJoin(quizzes, eq(quizzes.id, quizAttempts.quizId))
        .where(eq(quizAttempts.userId, ctx.session.user.id))
        .orderBy(desc(quizAttempts.completedAt))
        .limit(input.limit)
        .offset(input.offset);

      return attempts;
    }),

  getById: protectedProcedure
    .input(z.object({ quizId: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const quiz = await db.query.quizzes.findFirst({
        where: eq(quizzes.id, input.quizId),
        with: {
          questions: {
            orderBy: (q) => [asc(q.displayOrder)],
          },
        },
      });

      if (!quiz) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      if (quiz.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return toClientQuiz(quiz);
    }),

  getAttemptById: protectedProcedure
    .input(z.object({ attemptId: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const attempt = await db.query.quizAttempts.findFirst({
        where: eq(quizAttempts.id, input.attemptId),
        with: {
          quiz: {
            with: {
              questions: {
                orderBy: (question) => [asc(question.displayOrder)],
              },
            },
          },
        },
      });

      if (!attempt) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      if (attempt.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return {
        attemptId: attempt.id,
        quizId: attempt.quiz.id,
        title: attempt.quiz.title,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        completedAt: attempt.completedAt.toISOString(),
        results: attempt.answers.map((answer) => {
          const question = attempt.quiz.questions.find(
            (item) => item.id === answer.questionId,
          );

          return {
            questionId: answer.questionId,
            question: question?.question ?? '',
            userAnswer:
              answer.selectedOption >= 0 ? answer.selectedOption : null,
            correctAnswer: answer.correctAnswer,
            isCorrect: answer.isCorrect,
            type: question?.type ?? 'multiple-choice',
            options: question?.options ?? [],
          };
        }),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ quizId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await db
        .delete(quizzes)
        .where(
          and(
            eq(quizzes.id, input.quizId),
            eq(quizzes.userId, ctx.session.user.id),
          ),
        )
        .returning({ id: quizzes.id });

      if (!deleted) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return { success: true };
    }),
});
