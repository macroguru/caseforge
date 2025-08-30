import crypto from "crypto";
import { cookies as cookiesApi } from "next/headers";

export function createServerSeed() {
  const serverSeed = crypto.randomBytes(32).toString("hex");
  const serverSeedHash = crypto.createHash("sha256").update(serverSeed).digest("hex");
  return { serverSeed, serverSeedHash };
}

function hmacSha256(key, message) {
  return crypto.createHmac("sha256", key).update(message).digest("hex");
}

function hexToUnit(hex) {
  const slice = hex.slice(0, 13); // ~52 бита
  const int = parseInt(slice, 16);
  const max = Math.pow(16, slice.length) - 1;
  return int / max;
}

export function rng(serverSeed, clientSeed, nonce) {
  const msg = `${clientSeed}:${nonce}`;
  const hmac = hmacSha256(serverSeed, msg);
  const r = hexToUnit(hmac);
  return { hmac, r };
}

export function pickWeighted(items, r) {
  let acc = 0;
  for (const it of items) {
    acc += it.probability;
    if (r <= acc) return it;
  }
  return items[items.length - 1];
}

// cookies helpers
const COOKIE_KEY = "cf_commit";

export function getCommit(requestCookies) {
  const c = requestCookies?.get?.(COOKIE_KEY) ?? cookiesApi().get(COOKIE_KEY);
  if (!c) return null;
  try {
    return JSON.parse(c.value);
  } catch {
    return null;
  }
}

export function setCommit(commit) {
  // если не передан коммит — создаём новый
  const base = commit ?? { ...createServerSeed(), nonce: 0 };
  cookiesApi().set(COOKIE_KEY, JSON.stringify(base), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return base;
}
