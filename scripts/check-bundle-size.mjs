import { promises as fs } from "node:fs";
import path from "node:path";

const DIST_ASSETS_DIR = path.resolve("dist", "assets");
const MAX_JS_BUDGET_BYTES = Number(process.env.MAX_JS_BUDGET_BYTES ?? 900 * 1024);
const MAX_CSS_BUDGET_BYTES = Number(process.env.MAX_CSS_BUDGET_BYTES ?? 300 * 1024);

const formatKb = (bytes) => `${(bytes / 1024).toFixed(1)}KB`;

const run = async () => {
  const files = await fs.readdir(DIST_ASSETS_DIR);

  const totals = await files.reduce(
    async (pending, file) => {
      const acc = await pending;
      const fullPath = path.join(DIST_ASSETS_DIR, file);
      const stat = await fs.stat(fullPath);

      if (!stat.isFile()) {
        return acc;
      }

      if (file.endsWith(".js")) {
        acc.js += stat.size;
      }

      if (file.endsWith(".css")) {
        acc.css += stat.size;
      }

      return acc;
    },
    Promise.resolve({ js: 0, css: 0 }),
  );

  const failures = [];

  if (totals.js > MAX_JS_BUDGET_BYTES) {
    failures.push(
      `JS bundle budget exceeded: ${formatKb(totals.js)} > ${formatKb(MAX_JS_BUDGET_BYTES)}`,
    );
  }

  if (totals.css > MAX_CSS_BUDGET_BYTES) {
    failures.push(
      `CSS bundle budget exceeded: ${formatKb(totals.css)} > ${formatKb(MAX_CSS_BUDGET_BYTES)}`,
    );
  }

  if (failures.length > 0) {
    failures.forEach((failure) => console.error(failure));
    process.exit(1);
  }

  console.log(`Bundle budgets passed: JS ${formatKb(totals.js)}, CSS ${formatKb(totals.css)}`);
};

run().catch((error) => {
  console.error("Unable to evaluate bundle budgets.", error);
  process.exit(1);
});
