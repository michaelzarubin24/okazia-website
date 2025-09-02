import type { Metadata } from 'next';
import { client } from '../sanity/client';
import { type SanityDocument } from 'next-sanity';
import HomePageClient from '@/components/HomePageClient';

// This metadata object provides the SEO information for your homepage.
export const metadata: Metadata = {
  title: 'OKAZIA - Офіційний сайт | Музика з Харкова',
  description:
    'Офіційний сайт українського інді-рок гурту з Харкова. Дізнайся першим про нові релізи та концерти!',
};

// --- Sanity GROQ Queries to fetch all necessary data ---
const LATEST_RELEASES_QUERY = `*[_type == "musicRelease"]|order(releaseDate desc)[0...10]{
  _id,
  title,
  "slug": slug.current,
  "artworkUrl": artwork.asset->url,
  smartLink,
  "trackCount": count(tracks),
  "firstTrackSlug": tracks[0]->slug.current
}`;

const FUTURE_GIGS_QUERY = `*[_type == "gig" && date >= now()]|order(date asc){
  _id, 
  title, 
  date, 
  venue, 
  city, 
  ticketsUrl,
  detailsUrl, 
  "slug": slug.current, 
  "posterImage": posterImageUrl.asset->{
    url,
    metadata {
      dimensions
    }
  }
}`;

const VIDEOS_QUERY = `*[_type == "video"]|order(order asc){_id, title, youtubeUrl}`;

const LATEST_POSTS_QUERY = `*[_type == "post"]|order(publishedAt desc)[0...3]{
  _id, 
  title, 
  "slug": slug.current, 
  publishedAt, 
  "mainImageUrl": mainImage.asset->url
}`;

// --- The Server Component for the Homepage ---
export default async function Home() {
  // Fetch all data on the server in parallel for maximum speed
  const [releases, gigs, videos, posts] = await Promise.all([
    client.fetch<SanityDocument[]>(LATEST_RELEASES_QUERY),
    client.fetch<SanityDocument[]>(FUTURE_GIGS_QUERY),
    client.fetch<SanityDocument[]>(VIDEOS_QUERY),
    client.fetch<SanityDocument[]>(LATEST_POSTS_QUERY),
  ]);

  // Render the Client Component and pass the fetched data down as props
  return (
    <HomePageClient
      initialReleases={releases}
      initialGigs={gigs}
      initialVideos={videos}
      initialPosts={posts}
    />
  );
}
