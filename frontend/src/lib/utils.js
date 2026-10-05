/**
 * Utility to merge class names
 */
export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ');
}
