import { NextResponse } from "next/server";
import { getCommit, setCommit, createServerSeed } from "../../../../lib/fairness.js";

export async function GET(request) {
  const prev = getCommit(request.cookies);
  if (!prev) {
    const n = setCommit();
    return NextResponse.json({ error: "No previous commit. Created new.", serverSeedHash: n.serverSeedHash, prevMaxNonce: 0 });
  }
  // раскрываем предыдущий seed и создаём новый коммит
  const { serverSeed, serverSeedHash } = prev;
  const { serverSeed: newSeed, serverSeedHash: newHash } = createServerSeed();
  setCommit({ serverSeed: newSeed, serverSeedHash: newHash, nonce: 0 });

  return NextResponse.json({ serverSeed, serverSeedHash, prevMaxNonce: prev.nonce - 1 });
}
