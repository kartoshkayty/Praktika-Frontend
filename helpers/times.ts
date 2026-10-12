export function times(): string[] {
  const times = new Array(24).fill("", 0, 24);
  return times.map((_, index) => `${index.toString().padStart(2, "0")}:00`);
}
