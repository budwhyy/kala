import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import {
  COLLECTION_NAMES,
  COLLECTIONS,
  emptyDataset,
  validateDataset,
  type Dataset,
} from "./dataset";

export type LoadIssue = {
  /** Path of the file, relative to the content root. */
  file: string;
  message: string;
};

export type LoadResult = {
  dataset: Dataset;
  /** Parse errors (per file) followed by cross-record issues. Empty means the content is valid. */
  issues: LoadIssue[];
};

const CONTENT_FILE = /\.(ya?ml|json)$/i;

async function listFiles(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true, recursive: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  return entries
    .filter((e) => e.isFile() && CONTENT_FILE.test(e.name))
    .map((e) => join(e.parentPath, e.name))
    .sort();
}

/**
 * Load and validate every collection under `root` (the repo's content/ folder).
 * Each file holds one record or a list of records. Folder name = collection name.
 */
export async function loadContent(root: string): Promise<LoadResult> {
  const dataset = emptyDataset();
  const issues: LoadIssue[] = [];

  for (const collection of COLLECTION_NAMES) {
    const { schema } = COLLECTIONS[collection];
    for (const path of await listFiles(join(root, collection))) {
      const file = relative(root, path).replaceAll("\\", "/");
      let raw: unknown;
      try {
        const text = await readFile(path, "utf8");
        raw = path.toLowerCase().endsWith(".json") ? JSON.parse(text) : parseYaml(text);
      } catch (err) {
        issues.push({ file, message: `could not parse: ${(err as Error).message}` });
        continue;
      }
      const records = Array.isArray(raw) ? raw : [raw];
      records.forEach((record, i) => {
        const result = schema.safeParse(record);
        if (result.success) {
          (dataset[collection] as unknown[]).push(result.data);
        } else {
          const where = records.length > 1 ? `[${i}] ` : "";
          for (const issue of result.error.issues) {
            issues.push({
              file,
              message: `${where}${issue.path.join(".") || "(root)"}: ${issue.message}`,
            });
          }
        }
      });
    }
  }

  for (const issue of validateDataset(dataset)) {
    issues.push({ file: `${issue.collection}/${issue.id}`, message: issue.message });
  }
  return { dataset, issues };
}
