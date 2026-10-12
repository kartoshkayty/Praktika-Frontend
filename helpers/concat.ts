export function concat(...classNames: (string | undefined)[]): string {
  return classNames.filter((c) => !!c).join(" ");
}
