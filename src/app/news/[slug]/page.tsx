// FILE: src/app/news/[slug]/page.tsx

import { type SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { client } from '../../../sanity/client';
import { urlFor } from '../../../sanity/image';
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

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  publishedAt,
  mainImage,
  body,
  photoGallery
}`;

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Simplified params handling
  const resolvedParams = await params;
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug: resolvedParams.slug });

  if (!post) {
    return <div className="pt-24 text-center">Post not found.</div>;
  }

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{post.title}</h1>
          <p className="text-gray-400 mb-8">
            {new Date(post.publishedAt).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          {post.mainImage && (
            <div className="relative w-full aspect-video mb-8">
              {/* CHANGE 3: Replace main image <img> with <Image> and prioritize it */}
              <Image 
                src={urlFor(post.mainImage).url()} 
                alt={`Image for ${post.title}`}
                fill
                priority // Main post image is critical for LCP
                className="object-cover rounded-lg"
                sizes="(max-width: 896px) 100vw, 768px" // max-w-3xl is roughly 768px
              />
            </div>
          )}

          <div className="prose prose-invert lg:prose-xl max-w-none text-gray-300 leading-relaxed">
            <PortableText value={post.body} />
          </div>

          {/* Photo Gallery Section */}
          {post.photoGallery && post.photoGallery.length > 0 && (
            <section className="mt-12">
              <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* CHANGE 4: Use the GalleryPhoto interface instead of 'any' */}
                {post.photoGallery.map((photo: GalleryPhoto, index: number) => (
                  <div key={photo._key || index} className="aspect-square relative">
                    {/* CHANGE 5: Replace gallery <img> with <Image> */}
                    <Image 
                      src={urlFor(photo).width(800).height(800).url()} 
                      alt={`Gallery photo ${index + 1}`}
                      fill
                      className="object-cover rounded-lg shadow-lg"
                      sizes="(max-width: 768px) 50vw, 33vw"
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