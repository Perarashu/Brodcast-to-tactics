// Lightweight CSV parser — no external dependency needed.
// Handles quoted fields, trims whitespace, and skips blank lines.

export function parseCSV<
  T extends Record<string, string> = Record<string, string>,
>(text: string): T[] {
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row as T;
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchCSV<T extends Record<string, string>>(
  path: string,
): Promise<T[]> {
  const res = await fetch(path);
  if (!res.ok) {
    console.warn(`Failed to load CSV: ${path} (${res.status})`);
    return [];
  }
  const text = await res.text();
  return parseCSV<T>(text);
}
