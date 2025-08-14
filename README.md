# Quiz My PDF

A modern web app to generate and take quizzes from your PDF files using AI.

[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

> [!WARNING]
> This application is currently under continuous development. It uses session storage to store data temporarily. The plan is to integrate it with a PostgreSQL database in the near future.

## TODO

- [ ] Implement user authentication using Better Auth
- [ ] Integrate with a real-time database like PostgreSQL

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
- Biome Extension in your IDE
- Google Gemini API key (for AI quiz generation)

## Get started
- Create a `.env` file from the `.env.example` template.
- Enter your Google Gemini API key in .env

`GOOGLE_GENERATIVE_AI_API_KEY=***********`

- after that you can

```bash
pnpm install
pnpm dev

```

- Open http://localhost:3000 in your browser.



```yml
If you like my app,

please support me with a star ⭐️ on my GitHub repo
 ```