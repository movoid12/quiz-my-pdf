import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf } from "@/server/pdf/extract-text";
import { MIN_TEXT_CHARS } from "@/lib/constants";
import { generateQuizFromText } from "@/server/ai/generate-quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          error:
            "Unsupported Media Type. Expecting multipart/form-data with 'pdf' file.",
        },
        { status: 415 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("pdf");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    const text = await extractTextFromPdf(file);
    if (text.length < MIN_TEXT_CHARS) {
      return NextResponse.json(
        { error: "Insufficient content in PDF" },
        { status: 400 }
      );
    }

    const quiz = await generateQuizFromText(text);

    return NextResponse.json(quiz);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("Error processing PDF:", error);

    if (message.includes("multipart/form-data")) {
      return NextResponse.json({ error: message }, { status: 415 });
    }
    if (message.includes("File too large")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.includes("Invalid file format")) {
      return NextResponse.json({ error: message }, { status: 415 });
    }
    if (message.includes("Failed to read PDF content")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.includes("AI returned invalid data format")) {
      return NextResponse.json({ error: message }, { status: 502 });
    }
    if (message.includes("The user aborted a request")) {
      return NextResponse.json(
        { error: "Client aborted request" },
        { status: 499 }
      );
    }

    return NextResponse.json(
      { error: "Upstream AI error or invalid response" },
      { status: 502 }
    );
  }
}
