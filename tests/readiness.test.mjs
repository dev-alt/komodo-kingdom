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

test("auth security contract is documented in README", async () => {
  const readme = await readFile("README.md");

  assert.match(readme, /Auth Security Contract/i);
  assert.match(readme, /HttpOnly/i);
  assert.match(readme, /CSRF/i);
  assert.match(readme, /rate-limited/i);
});

test("env example includes telemetry context variables", async () => {
  const envExample = await readFile(".env.example");

  assert.match(envExample, /^VITE_APP_ENV=/m);
  assert.match(envExample, /^VITE_APP_RELEASE=/m);
});

test("monitoring captures release and auth lifecycle events", async () => {
  const monitoring = await readFile("src/lib/monitoring.ts");
  const authContext = await readFile("src/context/AuthContext.tsx");

  assert.match(monitoring, /release/i);
  assert.match(monitoring, /environment/i);
  assert.match(authContext, /trackEvent\("login_success"/);
  assert.match(authContext, /trackEvent\("register_success"/);
  assert.match(authContext, /trackEvent\("logout"/);
});
