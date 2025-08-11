# Quiz My PDF

A modern web app to generate and take quizzes from your PDF files using AI.

[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

## Techstack

- Next.js v15 (App Router)
- React v19
- Tailwind CSS
- DaisyUI 
- Zod (schema validation)
- Vercel AI SDK
- Google Gemini API
- TypeScript
- Biome (Linter/formatter)

## Prerequires

- Node.js v18+
- pnpm v8+
- Google Gemini API key (for AI quiz generation)

## Get started

- After cloning the repo. Enter your Google Gemini API key in .env

`GOOGLE_GENERATIVE_AI_API_KEY=***********`

- after that you can

```bash
pnpm install
pnpm dev

```

Open http://localhost:3000 in your browser.
