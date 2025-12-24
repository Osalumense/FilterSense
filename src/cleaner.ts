/**
 * Cleans text by removing invisible characters, normalizing unicode,
 * and collapsing whitespace.
 */
export function cleanText(text: string): string {
  if (!text) return '';

  // 1. Normalize Unicode (NFKC is good for compatibility)
  let cleaned = text.normalize('NFKC');

  // 2. Remove invisible control characters (keeping newlines for now)
  // Removing ASCII control chars (0-31) except \n (10), \r (13), \t (9)
  // Also removing delete (127)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove other invisible unicode characters like zero-width spaces, etc if needed
  // For now, let's just stick to the basics plus normalization


  // 3. Replace multiple spaces/tabs with a single space
  cleaned = cleaned.replace(/\s+/g, ' ');

  // 4. Trim surrounding whitespace
  return cleaned.trim();
}
