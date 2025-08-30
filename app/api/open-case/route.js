import { NextResponse } from "next/server";
import { cases } from "../../../lib/cases.js";
import { getCommit, setCommit, rng, pickWeighted } from "../../../lib/fairness.js";

export async function POST(request) {
  const { slug } = await request.json();
  const kase = cases.find((c) => c.slug === slug);
  if (!kase) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const cookies = request.cookies;
  let commit = getCommit(cookies);
  if (!commit) {
    commit = setCommit(); // создаём новый коммит и устанавливаем cookie
  }

  const { hmac, r } = rng(commit.serverSeed, "default", commit.nonce);
  const drop = pickWeighted(kase.items, r);

  // инкремент nonce и записываем cookie обратно
  setCommit({ ...commit, nonce: commit.nonce + 1 });

  return NextResponse.json({
    drop: { title: drop.title, value: drop.value, rarity: drop.rarity },
    hmac,
    fairness: { serverSeedHash: commit.serverSeedHash, nonce: commit.nonce, clientSeed: "default" }
  });
}
