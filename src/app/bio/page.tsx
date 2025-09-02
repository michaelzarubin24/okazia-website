// FILE: src/app/bio/page.tsx
// This page now fetches and displays live data for the band biography from Sanity.

// src/app/bio/page.tsx

import { type SanityDocument } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import { client } from '../../sanity/client';
import { urlFor } from '../../sanity/image';
import Image from 'next/image'; // CHANGE 1: Import the Next.js Image component

// CHANGE 2: Define a specific type for a photo in the gallery
interface GalleryPhoto {
  _key: string;
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

const BIO_QUERY = `*[_type == "bio"][0]{
  title,
  "mainImageUrl": mainImage.asset->url,
  textContent,
  photoGallery
}`;

export default async function BioPage() {
  // Use a more specific type for the fetched data if you have one, but SanityDocument is a good default
  const bio = await client.fetch<SanityDocument>(
    BIO_QUERY,
    {},
    { next: { revalidate: 3600 } }
  );

  if (!bio) {
    return (
      <div className="pt-24 text-center">
        Біографія не знайдена. Будь ласка, додайте її в Sanity Studio.
      </div>
    );
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
                {/* CHANGE 3: Use the GalleryPhoto interface instead of 'any' */}
                {bio.photoGallery.map((photo: GalleryPhoto, index: number) => (
                  <div
                    key={photo._key || index}
                    className="aspect-square relative"
                  >
                    {/* CHANGE 4: Replace <img> with next/image's <Image> component */}
                    <Image
                      src={urlFor(photo).width(800).height(800).url()}
                      alt={`Gallery photo ${index + 1}`}
                      fill // Makes the image fill the parent div
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                      sizes="(max-width: 768px) 50vw, 33vw" // Helps optimize image loading based on viewport size
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
