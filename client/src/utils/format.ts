export function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function splitTags(tags: string): string[] {
  return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
}
