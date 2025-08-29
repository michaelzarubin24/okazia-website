import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "seggtq72",
  dataset: "production",
  apiVersion: "2025-08-24", // use a UTC date in YYYY-MM-DD format
  useCdn: false, // `false` if you want to ensure fresh data
});