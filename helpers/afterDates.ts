export function formatDate(date: Date | string): string {
  const final: Date = typeof date === "string" ? new Date(date) : date;

  const day = final.getDate().toString().padStart(2, "0");
  const month = (final.getMonth() + 1).toString().padStart(2, "0");
  const year = final.getFullYear().toString();

  return [day, month, year].join("-");
}
