import { NextResponse } from "next/server";
import { getCommit, setCommit } from "../../../../lib/fairness.js";

export async function GET(request) {
  let commit = getCommit(request.cookies);
  if (!commit) commit = setCommit();
  return NextResponse.json({ serverSeedHash: commit.serverSeedHash, nonce: commit.nonce });
}
