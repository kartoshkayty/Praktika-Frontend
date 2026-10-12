export function makeFirstSymbolUpper<T extends string | undefined>(str: T): T {
  if (!str) return str;
  if (str.length < 2) return str.toUpperCase() as T;

  const clone = structuredClone(str).toLowerCase();
  const sym = clone.slice(0, 1)!;
  const final = sym.toUpperCase() + clone.slice(1);

  return final as T;
}
