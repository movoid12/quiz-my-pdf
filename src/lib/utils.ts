import { MAX_TEXT_CHARS } from "./constants";

export function normalizeText(
  input: string,
  limit: number = MAX_TEXT_CHARS
): string {
  return input.replace(/\s+/g, " ").trim().slice(0, limit);
}

export function isLikelyPdf(buffer: Buffer): boolean {
  return buffer.subarray(0, 5).toString("utf-8") === "%PDF-";
}
