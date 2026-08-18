/** Server-only writer for the shared CMS JSON files. Import this module via
 *  `@unseen-gadget/cms-data/writer` from route handlers ONLY — it uses the
 *  filesystem and must never be imported from a client component. */

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function findDataDir(): string {
  let dir = process.cwd();
  for (let i = 0; i < 8; i += 1) {
    const candidate = path.join(dir, "packages", "cms-data", "src", "data");
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    "Could not locate packages/cms-data/src/data — run this from within the monorepo."
  );
}

const DATA_DIR = findDataDir();

export const cmsDataDir = (): string => DATA_DIR;

export async function readJson<T>(file: string): Promise<T> {
  const raw = await readFile(path.join(/* turbopackIgnore: true */ DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJson(file: string, value: unknown): Promise<void> {
  await writeFile(path.join(/* turbopackIgnore: true */ DATA_DIR, file), `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

export async function updateCollection<T extends { id: string }>(
  file: string,
  op: "create" | "update" | "delete",
  payload: T,
  id?: string
): Promise<T[]> {
  const items = await readJson<T[]>(file);
  let next: T[];
  if (op === "create") {
    next = [...items, payload];
  } else if (op === "update") {
    next = items.map((item) => (item.id === payload.id ? payload : item));
  } else {
    next = items.filter((item) => item.id !== id);
  }
  await writeJson(file, next);
  return next;
}