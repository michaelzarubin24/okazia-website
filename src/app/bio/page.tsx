// FILE: src/app/bio/page.tsx
// This page now fetches and displays live data for the band biography from Sanity.

import { type SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { client } from '../../sanity/client';
import { urlFor } from '../../sanity/image';

// UPDATED: Query now fetches the photoGallery
const BIO_QUERY = `*[_type == "bio"][0]{
  title,
  "mainImageUrl": mainImage.asset->url,
  textContent,
  photoGallery
}`;

export default async function BioPage() {
  const bio = await client.fetch<SanityDocument>(BIO_QUERY);

  if (!bio) {
    return <div className="pt-24 text-center">Біографія не знайдена. Будь ласка, додайте її в Sanity Studio.</div>;
  }

  const headerHeight = '4.2rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      {/* Hero Image Section */}
      <section 
        className="relative h-[50vh] w-full flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bio.mainImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-white p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wider">
            {bio.title}
          </h1>
        </div>
      </section>

      {/* Biography Content Section */}
      <div className="bg-black">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-lg text-gray-300 leading-relaxed">
              <PortableText value={bio.textContent} />
            </div>
          </div>

          {/* NEW: Photo Gallery Section */}
          {bio.photoGallery && bio.photoGallery.length > 0 && (
            <section className="mt-16 md:mt-24">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bio.photoGallery.map((photo: any, index: number) => (
                  <div key={index} className="aspect-square relative">
                    <img 
                      src={urlFor(photo).width(800).height(800).url()} 
                      alt={`Gallery photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}