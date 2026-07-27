export function createSlug(input: string, prefix: string) {
  const ascii = input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const base = ascii || prefix;
  return `${base}-${Date.now().toString(36)}`;
}

