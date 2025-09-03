import { type SanityDocument } from 'next-sanity';
import { client } from '../../../sanity/client';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

// SEO Metadata for the page
export const metadata: Metadata = {
  title: 'Анонси | OKAZIA',
  description:
    'Анонси майбутніх концертів гурту OKAZIA. Дізнайтеся, де і коли ми виступатимемо наступного разу, та купуйте квитки!',
};

// UPDATED: Query now fetches the poster image with its dimensions
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

export default async function FutureGigsPage() {
  const futureGigs = await client.fetch<SanityDocument[]>(
    FUTURE_GIGS_QUERY,
    {},
    { next: { revalidate: 60 } }
  );

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center uppercase tracking-wider mb-16">
          АНОНСИ
        </h1>

        {futureGigs.length > 0 ? (
          // UPDATED: The whole list structure is now the same as the homepage's "Анонси"
          <div className="max-w-4xl mx-auto space-y-8">
            {futureGigs.map((gig) => (
              <div
                key={gig._id}
                className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-800/50 rounded-lg"
              >
                <div className="w-full md:w-1/3 flex-shrink-0">
                  {gig.posterImage?.metadata?.dimensions ? (
                    <Image
                      src={gig.posterImage.url}
                      alt={`Poster for ${gig.title}`}
                      width={gig.posterImage.metadata.dimensions.width}
                      height={gig.posterImage.metadata.dimensions.height}
                      className="w-full h-auto rounded-md shadow-lg"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-auto aspect-[2/3] bg-gray-900 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">No Poster</p>
                    </div>
                  )}
                </div>
                <div className="flex-grow text-center md:text-left">
                  <p className="text-2xl font-bold">{gig.title}</p>
                  <p className="text-lg text-gray-400 mt-2">
                    {new Date(gig.date).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-lg text-gray-400">
                    {gig.venue}, {gig.city}
                  </p>
                  <div className="mt-6">
                    {gig.ticketsUrl ? (
                      <Link
                        href={gig.ticketsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full sm:w-auto text-center bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Квитки
                      </Link>
                    ) : gig.detailsUrl ? (
                      <Link
                        href={gig.detailsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full sm:w-auto text-center bg-gray-600 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-500 transition-colors"
                      >
                        Деталі
                      </Link>
                    ) : (
                      <Link
                        href={`/gigs/archive/${gig.slug}`}
                        className="inline-block w-full sm:w-auto text-center bg-gray-600 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-500 transition-colors"
                      >
                        Деталі
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg">
            Запланованих концертів немає. Залишайтеся на зв&apos;язку!
          </p>
        )}
      </div>
    </div>
  );
}
