import { type SanityDocument } from 'next-sanity';
import { client } from '../../../sanity/client';
import PastGigsClient from '@/components/PastGigsClient'; // We will create this component
import { Metadata } from 'next';

// SEO Metadata for the page
export const metadata: Metadata = {
  title: 'Архів Концертів | OKAZIA',
  description:
    'Перегляньте архів минулих концертів гурту OKAZIA. Знайдіть сетлисти, фотографії та спогади з наших минулих виступів.',
};

// This query fetches all the necessary data for every past gig
const ALL_PAST_GIGS_QUERY = `*[_type == "gig" && date < now()]|order(date desc){
  _id,
  date,
  venue,
  city,
  "slug": slug.current,
  "posterImage": posterImageUrl.asset->{
    url,
    metadata {
      dimensions
    }
  }
}`;

export default async function PastGigsPage() {
  const allPastGigs = await client.fetch<SanityDocument[]>(
    ALL_PAST_GIGS_QUERY,
    {},
    // Revalidate the data at most once an hour
    { next: { revalidate: 3600 } }
  );

  // Calculate all unique years from the gigs to populate the filter dropdown
  const allYears = [
    ...new Set(allPastGigs.map((gig) => new Date(gig.date).getFullYear())),
  ].sort((a, b) => b - a); // Sort years descending

  return <PastGigsClient initialGigs={allPastGigs} allYears={allYears} />;
}
