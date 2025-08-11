import pdf from "pdf-parse";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { isLikelyPdf, normalizeText } from "@/lib/utils";

export async function extractTextFromPdf(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large (max 10MB)");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (!isLikelyPdf(buffer)) {
    throw new Error("Invalid file format. Please upload a PDF.");
  }

  try {
    const parsed = await pdf(buffer);
    return normalizeText(parsed.text || "");
  } catch {
    throw new Error("Failed to read PDF content");
  }
}
