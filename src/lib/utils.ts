/**
 * Calculate reading time based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
}

/**
 * Get word count from content
 */
export function getWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
