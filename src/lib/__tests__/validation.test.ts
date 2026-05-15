import { describe, expect, it } from 'vitest';
import {
  clientQuestionSchema,
  clientQuizSchema,
  questionSchema,
  questionsSchema,
  quizResultSchema,
  quizResultsSchema,
} from '@/lib/validation';

describe('questionSchema', () => {
  const validQuestion = {
    id: 1,
    question: 'What is the capital of France?',
    type: 'multiple-choice' as const,
    options: ['Berlin', 'Paris', 'London', 'Madrid'],
    correctAnswer: 1,
  };

  it('accepts valid question', () => {
    const result = questionSchema.safeParse(validQuestion);
    expect(result.success).toBe(true);
  });

  it('rejects short question', () => {
    const result = questionSchema.safeParse({
      ...validQuestion,
      question: 'Hi',
    });
    expect(result.success).toBe(false);
  });

  it('rejects wrong number of options', () => {
    const result = questionSchema.safeParse({
      ...validQuestion,
      options: ['A', 'B'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative id', () => {
    const result = questionSchema.safeParse({
      ...validQuestion,
      id: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects correctAnswer out of range', () => {
    const result = questionSchema.safeParse({
      ...validQuestion,
      correctAnswer: 5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-multiple-choice type', () => {
    const result = questionSchema.safeParse({
      ...validQuestion,
      type: 'true-false',
    });
    expect(result.success).toBe(false);
  });
});

describe('questionsSchema', () => {
  const validQuestions = {
    title: 'Geography Quiz',
    category: 'geography',
    questions: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      question: `Question ${i + 1}?`,
      type: 'multiple-choice' as const,
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
    })),
  };

  it('accepts valid quiz data', () => {
    const result = questionsSchema.safeParse(validQuestions);
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = questionsSchema.safeParse({
      ...validQuestions,
      title: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = questionsSchema.safeParse({
      ...validQuestions,
      category: 'astrology',
    });
    expect(result.success).toBe(false);
  });

  it('rejects wrong number of questions', () => {
    const result = questionsSchema.safeParse({
      ...validQuestions,
      questions: validQuestions.questions.slice(0, 3),
    });
    expect(result.success).toBe(false);
  });

  it('rejects title exceeding 200 characters', () => {
    const result = questionsSchema.safeParse({
      ...validQuestions,
      title: 'x'.repeat(201),
    });
    expect(result.success).toBe(false);
  });
});

describe('clientQuestionSchema', () => {
  it('accepts valid client question', () => {
    const result = clientQuestionSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      question: 'What is 2+2?',
      type: 'multiple-choice',
      options: ['3', '4', '5', '6'],
      order: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-uuid id', () => {
    const result = clientQuestionSchema.safeParse({
      id: 'not-a-uuid',
      question: 'What is 2+2?',
      type: 'multiple-choice',
      options: ['3', '4', '5', '6'],
      order: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe('clientQuizSchema', () => {
  it('accepts valid client quiz', () => {
    const result = clientQuizSchema.safeParse({
      quizId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Test Quiz',
      category: 'science',
      difficulty: 'easy',
      questions: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          question: 'Q1?',
          type: 'multiple-choice',
          options: ['A', 'B', 'C', 'D'],
          order: 1,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid difficulty', () => {
    const result = clientQuizSchema.safeParse({
      quizId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Test Quiz',
      category: 'science',
      difficulty: 'expert',
      questions: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = clientQuizSchema.safeParse({
      quizId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Test Quiz',
      category: 'astrology',
      difficulty: 'easy',
      questions: [],
    });
    expect(result.success).toBe(false);
  });
});

describe('quizResultSchema', () => {
  it('accepts valid result', () => {
    const result = quizResultSchema.safeParse({
      questionId: 'q1',
      question: 'What is 2+2?',
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true,
      type: 'multiple-choice',
    });
    expect(result.success).toBe(true);
  });

  it('accepts null userAnswer', () => {
    const result = quizResultSchema.safeParse({
      questionId: 'q1',
      question: 'What is 2+2?',
      userAnswer: null,
      correctAnswer: 1,
      isCorrect: false,
      type: 'multiple-choice',
    });
    expect(result.success).toBe(true);
  });

  it('accepts missing userAnswer', () => {
    const result = quizResultSchema.safeParse({
      questionId: 'q1',
      question: 'What is 2+2?',
      correctAnswer: 1,
      isCorrect: false,
      type: 'multiple-choice',
    });
    expect(result.success).toBe(true);
  });
});

describe('quizResultsSchema', () => {
  it('accepts valid full results', () => {
    const result = quizResultsSchema.safeParse({
      title: 'Test Quiz',
      score: 80,
      totalQuestions: 10,
      correctAnswers: 8,
      completedAt: '2026-05-16T12:00:00Z',
      results: [
        {
          questionId: 'q1',
          question: 'Q1?',
          userAnswer: 0,
          correctAnswer: 0,
          isCorrect: true,
          type: 'multiple-choice',
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-numeric score', () => {
    const result = quizResultsSchema.safeParse({
      title: 'Test Quiz',
      score: 'high',
      totalQuestions: 10,
      correctAnswers: 8,
      completedAt: '2026-05-16T12:00:00Z',
      results: [],
    });
    expect(result.success).toBe(false);
  });
});
