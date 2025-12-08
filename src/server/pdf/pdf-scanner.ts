/**
 * Scans a PDF buffer for potentially malicious content using heuristic analysis.
 * Checks for dangerous PDF keywords and structures.
 *
 * @param buffer The PDF file buffer
 * @throws Error if malicious content is detected
 */
export function scanPdfContent(buffer: Buffer): void {
  const content = buffer.toString('latin1'); // PDF is binary, but keywords are ASCII

  // List of suspicious PDF keywords/actions
  const suspiciousKeywords = [
    { pattern: /\/JS\b/i, name: 'JavaScript' },
    { pattern: /\/JavaScript\b/i, name: 'JavaScript' },
    { pattern: /\/AA\b/i, name: 'Auto-Action' },
    { pattern: /\/OpenAction\b/i, name: 'Open-Action' },
    { pattern: /\/Launch\b/i, name: 'Launch Action' },
    // /URI is common, but can be used for phishing. We might want to allow it but be careful.
    // For now, we'll focus on active execution threats.
  ];

  const detectedThreats: string[] = [];

  for (const keyword of suspiciousKeywords) {
    if (keyword.pattern.test(content)) {
      detectedThreats.push(keyword.name);
    }
  }

  if (detectedThreats.length > 0) {
    const uniqueThreats = [...new Set(detectedThreats)];
    throw new Error(
      `Potential malicious content detected: ${uniqueThreats.join(', ')}`,
    );
  }
}
