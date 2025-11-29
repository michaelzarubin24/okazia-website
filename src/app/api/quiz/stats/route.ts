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
  // DEBUG: Check if the route is being hit
  console.log("API: Quiz Stats endpoint called");

  // DEBUG: Check if token exists (don't log the actual token for security)
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("CRITICAL ERROR: SANITY_API_WRITE_TOKEN is missing in environment variables.");
    return NextResponse.json({ error: "Server configuration error: Missing Write Token" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { resultId } = body;
    
    console.log(`API: Received request to update stats for character: ${resultId}`);

    if (!resultId) {
      return NextResponse.json({ error: "Missing resultId" }, { status: 400 });
    }

    // We use a fixed ID for the stats document so all counts go to one place
    const STATS_DOC_ID = "quiz-statistics-main";

    // 1. Ensure the document exists (safe to run every time)
    console.log("API: Ensuring stats document exists...");
    await client.createIfNotExists({
      _id: STATS_DOC_ID,
      _type: "quizStats",
      totalPlays: 0,
      characterCounts: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 }
    });

    // 2. Atomically increment the counters
    // This handles race conditions (e.g. 100 people playing at once)
    console.log("API: Incrementing counters...");
    await client
      .patch(STATS_DOC_ID)
      .inc({ totalPlays: 1 })
      .inc({ [`characterCounts.${resultId}`]: 1 }) // dynamic key update
      .commit();

    console.log("API: Stats successfully updated!");
    return NextResponse.json({ message: "Stats updated" });
  } catch (err: unknown) {
    console.error("Stats Update Error:", err);
    
    // SAFE ERROR HANDLING (Removes 'any')
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}