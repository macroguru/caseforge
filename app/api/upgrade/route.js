import { NextResponse } from "next/server";
import { getCommit, setCommit, rng } from "../../../lib/fairness.js";

export async function POST(request) {
  const { fromItem, targetValue } = await request.json();
  if (!fromItem || !targetValue) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  let commit = getCommit(request.cookies);
  if (!commit) commit = setCommit();

  const edge = 0.98;
  const probability = Math.max(0.01, Math.min(0.99, (fromItem.value / targetValue) * edge));

  const { hmac, r } = rng(commit.serverSeed, "default", commit.nonce);
  const success = r < probability;

  setCommit({ ...commit, nonce: commit.nonce + 1 });

  return NextResponse.json({
    success,
    probability,
    hmac,
    fairness: { serverSeedHash: commit.serverSeedHash, nonce: commit.nonce, clientSeed: "default" }
  });
}
