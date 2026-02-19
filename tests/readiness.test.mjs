import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";

const readFile = (relativePath) =>
  fs.readFile(path.resolve(relativePath), "utf8");

test("index.html contains production baseline metadata", async () => {
  const html = await readFile("index.html");

  assert.match(html, /meta\s+name="description"/i);
  assert.match(html, /property="og:title"/i);
  assert.match(html, /name="twitter:card"/i);
  assert.match(html, /rel="canonical"/i);
});

test("auth source no longer contains seeded test credentials", async () => {
  const authContext = await readFile("src/context/AuthContext.tsx");
  const authModal = await readFile("src/components/AuthModal.tsx");

  assert.doesNotMatch(authContext, /test123|testuser/i);
  assert.doesNotMatch(authModal, /Login as Test User|test123|testuser/i);
});

test("SEO support files exist", async () => {
  await assert.doesNotReject(() => readFile("public/robots.txt"));
  await assert.doesNotReject(() => readFile("public/sitemap.xml"));
  await assert.doesNotReject(() => readFile("public/site.webmanifest"));
});
