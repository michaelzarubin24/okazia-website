import { type SanityDocument } from 'next-sanity';
import { client } from '../../../sanity/client';
import Link from 'next/link';

// This query fetches all gigs with a date before right now,
// and sorts them in descending order (most recent first).
const PAST_GIGS_QUERY = `*[_type == "gig" && date < now()]|order(date desc){
  _id,
  date,
  venue,
  city,
  "slug": slug.current
}`;

export default async function PastGigsPage() {
  const pastGigs = await client.fetch<SanityDocument[]>(PAST_GIGS_QUERY);

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center uppercase tracking-wider mb-16">
          АРХІВ
        </h1>

        <div className="max-w-4xl mx-auto border-t border-gray-700">
          {pastGigs.map((gig) => (
            <Link
              key={gig._id}
              href={`/gigs/archive/${gig.slug}`}
              className="flex justify-between items-center p-6 border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              <div>
                {/* UPDATED: Changed 'en-US' to 'uk-UA' for Ukrainian date format */}
                <p className="text-xl font-bold">
                  {new Date(gig.date).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-400">
                  {gig.venue}, {gig.city}
                </p>
              </div>
              <span className="text-gray-400 hidden sm:inline">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
