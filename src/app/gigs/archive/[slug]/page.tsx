// FILE: src/app/gigs/archive/[slug]/page.tsx
// This is the template for an individual past gig page, connected to Sanity.

import { type SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { client } from '../../../../sanity/client';
import { urlFor } from '../../../../sanity/image';
import Link from 'next/link';

// This query fetches all the details for a specific gig.
const GIG_DETAIL_QUERY = `*[_type == "gig" && slug.current == $slug][0]{
  _id,
  title,
  date,
  venue,
  city,
  "mainImageUrl": mainImageUrl.asset->url,
  "posterImageUrl": posterImageUrl.asset->url,
  setlist,
  interestingFacts,
  photoGallery,
  youtubeUrl
}`;

// This query fetches all gigs to create the "related gigs" list.
const ALL_GIGS_QUERY = `*[_type == "gig" && defined(slug.current)]|order(date desc){
  _id,
  title,
  date,
  "slug": slug.current
}`;


export default async function GigDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const gig = await client.fetch<SanityDocument>(GIG_DETAIL_QUERY, { slug: resolvedParams.slug });
  const allGigs = await client.fetch<SanityDocument[]>(ALL_GIGS_QUERY);
  
  // Exclude the current gig and take the next 3 for the "related" section.
  const relatedGigs = allGigs.filter(g => g.slug !== resolvedParams.slug).slice(0, 3);

  if (!gig) {
    return <div className="pt-24 text-center">Концерт не знайдено.</div>;
  }

  const headerHeight = '4.4rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <section 
        className="relative h-[60vh] w-full flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${gig.mainImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-white p-4">
          <p className="text-lg mb-2">{new Date(gig.date).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wider">{gig.title}</h1>
        </div>
      </section>

      <div className="container mx-auto px-6 sm:px-8 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-3xl font-bold mb-4">Сетлист</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <p className="text-gray-300 text-lg leading-loose whitespace-pre-wrap font-mono">
                  {gig.setlist}
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl font-bold mb-4">Цікаві факти</h2>
              <div className="prose prose-invert lg:prose-xl text-gray-300 leading-relaxed">
                <PortableText value={gig.interestingFacts} />
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
             {gig.posterImageUrl && (
                <div>
                    <h3 className="text-2xl font-bold mb-4">Постер</h3>
                    <div className="relative aspect-[2/3] w-full bg-gray-800/50 rounded-lg">
                        <img 
                            src={gig.posterImageUrl} 
                            alt={`Poster for ${gig.title}`}
                            className="object-contain rounded-lg shadow-2xl w-full h-full"
                        />
                    </div>
                </div>
             )}
          </aside>
        </div>

        {gig.photoGallery && gig.photoGallery.length > 0 && (
            <section className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8">Фотогалерея</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gig.photoGallery.map((photo: any, index: number) => (
                <div key={index} className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-lg">
                    <img 
                    src={urlFor(photo).url()} 
                    alt={`Gig photo ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    />
                </div>
                ))}
            </div>
            </section>
        )}

        {gig.youtubeUrl && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8">Відео</h2>
            <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
              <iframe 
                src={gig.youtubeUrl}
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="border-0 w-full h-full"
              ></iframe>
            </div>
          </section>
        )}

        <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Більше концертів</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
               {relatedGigs.map((relatedGig: SanityDocument) => (
                 <Link key={relatedGig.slug} href={`/gigs/archive/${relatedGig.slug}`} className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-center">
                   <p className="font-bold">{relatedGig.title}</p>
                   <p className="text-sm text-gray-400">{new Date(relatedGig.date).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 </Link>
               ))}
            </div>
        </section>
      </div>
    </div>
  );
}