import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { questionsSchema } from "@/lib/quiz-schema";

// Force Node runtime (pdf-parse requires Node, not Edge)
export const runtime = "nodejs";
// Disable static optimization for this route
export const dynamic = "force-dynamic";
// Allow more time for PDF parsing + LLM call on Vercel
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_CHARS = 25_000; // keep prompt size reasonable

function json(status: number, body: unknown) {
  return NextResponse.json(body, { status });
}

function isLikelyPdf(buffer: Buffer): boolean {
  // Basic magic number check for "%PDF-"
  const header = buffer.subarray(0, 5).toString("utf-8");
  return header === "%PDF-";
}

function normalizeText(input: string): string {
  // Collapse excessive whitespace and trim length
  const cleaned = input.replace(/\s+/g, " ").trim();
  return cleaned.slice(0, MAX_TEXT_CHARS);
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return json(415, {
        error:
          "Unsupported Media Type. Expecting multipart/form-data with 'pdf' file.",
      });
    }

    const formData = await request.formData();
    const file = formData.get("pdf");
    if (!(file instanceof File)) {
      return json(400, { error: "No PDF file provided" });
    }

    if (file.size > MAX_FILE_SIZE) {
      return json(400, { error: "File too large (max 10MB)" });
    }

    // Read file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!isLikelyPdf(buffer)) {
      return json(415, { error: "Invalid file format. Please upload a PDF." });
    }

    // Extract text
    let extractedText = "";
    try {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text || "";
    } catch (err) {
      console.error("PDF parsing failed:", err);
      return json(400, { error: "Failed to read PDF content" });
    }

    extractedText = normalizeText(extractedText);
    if (extractedText.length < 100) {
      return json(400, { error: "Insufficient content in PDF" });
    }

    // Build system + user messages (recommended with Vercel AI SDK)
    const system =
      "You are an expert quiz generator. Return only JSON matching the provided Zod schema. No extra text.";
    const user = `
Create exactly 5 challenging but fair multiple-choice questions based on the provided text.
- Use 4 options per question.
- correctAnswer must be the index (0-based) of the correct option.
- Ensure answers are accurate and derived from the text.

Text:
${extractedText}
    `.trim();

    // If the client disconnects, abort the LLM request
    const signal = request.signal;

    // Use generateObject for schema-validated output (no streaming needed)
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"), // Use a model that supports JSON schema
      schema: questionsSchema,
      system,
      messages: [{ role: "user", content: user }],
      temperature: 0.5,
      maxOutputTokens: 1500,
    });

    // Final safety validation (extra guard)
    const parsed = questionsSchema.safeParse(object);
    if (!parsed.success) {
      console.error("Schema validation failed:", parsed.error.flatten());
      return json(502, { error: "AI returned invalid data format" });
    }

    return json(200, parsed.data);
  } catch (error) {
    // Handle common provider/model mismatch scenario (e.g., gpt-3.5-turbo)
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Error processing PDF:", error);

    if (message.includes("json_schema") || message.includes("gpt-3.5")) {
      return json(502, {
        error:
          "Model does not support structured output. Ensure a compatible model (e.g., gpt-4o-mini).",
      });
    }

    // Respect aborts (client navigated away)
    if (message.includes("The user aborted a request")) {
      return json(499, { error: "Client aborted request" });
    }

    return json(500, { error: "Internal server error" });
  }
}
