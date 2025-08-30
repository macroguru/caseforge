import { NextResponse } from "next/server";
import { getCommit, setCommit, rng } from "../../../lib/fairness.js";

export async function POST(request) {
  const { itemValues } = await request.json();
  if (!Array.isArray(itemValues) || itemValues.length < 3) return NextResponse.json({ error: "Pick 3+ items" }, { status: 400 });

  let commit = getCommit(request.cookies);
  if (!commit) commit = setCommit();

  const total = itemValues.reduce((s, v) => s + (v|0), 0);
  const { hmac, r } = rng(commit.serverSeed, "default", commit.nonce);

  // Разброс ±30%
  const minV = Math.floor(total * 0.7);
  const maxV = Math.ceil(total * 1.3);
  const value = Math.max(1, Math.floor(minV + (maxV - minV) * r));

  setCommit({ ...commit, nonce: commit.nonce + 1 });

  return NextResponse.json({
    result: { title: `Контракт • ${value}`, value },
    hmac,
    fairness: { serverSeedHash: commit.serverSeedHash, nonce: commit.nonce, clientSeed: "default" }
  });
}
