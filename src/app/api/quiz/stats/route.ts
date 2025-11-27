import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

// We create a separate client here because we need the WRITE token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-11-27",
  token: process.env.SANITY_API_WRITE_TOKEN, // <--- MUST BE IN .env.local
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const { resultId } = await req.json();

    if (!resultId) {
      return NextResponse.json({ error: "Missing resultId" }, { status: 400 });
    }

    // We use a fixed ID for the stats document so all counts go to one place
    const STATS_DOC_ID = "quiz-statistics-main";

    // 1. Ensure the document exists (safe to run every time)
    await client.createIfNotExists({
      _id: STATS_DOC_ID,
      _type: "quizStats",
      totalPlays: 0,
      characterCounts: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 }
    });

    // 2. Atomically increment the counters
    // This handles race conditions (e.g. 100 people playing at once)
    await client
      .patch(STATS_DOC_ID)
      .inc({ totalPlays: 1 })
      .inc({ [`characterCounts.${resultId}`]: 1 }) // dynamic key update
      .commit();

    return NextResponse.json({ message: "Stats updated" });
  } catch (err: unknown) {
    console.error("Stats Update Error:", err);
    
    // SAFE ERROR HANDLING (Removes 'any')
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}