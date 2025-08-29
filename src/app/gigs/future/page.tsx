// FILE: src/app/gigs/future/page.tsx
// This page now fetches and displays a live list of upcoming shows from Sanity.

import { type SanityDocument } from "next-sanity";
import { client } from '../../../sanity/client'; 
import Link from 'next/link';

// UPDATED: The query now also fetches the 'detailsUrl'.
const FUTURE_GIGS_QUERY = `*[_type == "gig" && date >= now()]|order(date asc){
  _id,
  date,
  venue,
  city,
  ticketsUrl,
  detailsUrl, // Added this field
  "slug": slug.current
}`;

export default async function FutureGigsPage() {
  const futureGigs = await client.fetch<SanityDocument[]>(FUTURE_GIGS_QUERY);

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center uppercase tracking-wider mb-16">
          Майбутні концерти
        </h1>

        {futureGigs.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {futureGigs.map((gig) => (
              <div key={gig._id} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-800/50 rounded-lg">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <p className="text-xl font-bold">{new Date(gig.date).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-gray-400">{gig.venue}, {gig.city}</p>
                </div>
                
                {/* UPDATED: New logic for the button */}
                {gig.ticketsUrl ? (
                  // If there's a ticket link, show the "Tickets" button
                  <Link
                    href={gig.ticketsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Квитки
                  </Link>
                ) : gig.detailsUrl ? (
                  // Otherwise, if there's a details link, show the "Details" button linking to it
                  <Link
                    href={gig.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-gray-600 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-500 transition-colors"
                  >
                    Деталі
                  </Link>
                ) : (
                  // As a fallback, if neither link exists, link to the archive page
                  <Link
                    href={`/gigs/archive/${gig.slug}`}
                    className="w-full sm:w-auto text-center bg-gray-600 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-500 transition-colors"
                  >
                    Деталі
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg">
            Запланованих концертів немає. Залишайтеся на зв'язку!
          </p>
        )}
      </div>
    </div>
  );
}