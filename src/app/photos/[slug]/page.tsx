import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { groq } from 'next-sanity';
import { Metadata } from 'next';
import { notFound } from 'next/navigation'; // Import notFound

// Import the new client component and its types
import PhotoGalleryClient, { type PhotoGallery } from './PhotoGalleryClient';
import type { ImageAsset } from 'sanity';

// This query is for metadata: gets title, text excerpt, and first image
const METADATA_QUERY = groq`*[_type == "photoGallery" && slug.current == $slug][0]{
  title,
  "excerpt": pt::text(description[0...1]), // Get plain text from the first block
  "coverImage": galleryImages[0].asset
}`;

// This is the full query for the page content
const PAGE_QUERY = groq`*[_type == "photoGallery" && slug.current == $slug][0] {
  _id,
  title,
  date,
  description,
  galleryImages[] {
    _key, // Added _key for React keys
    asset
  }
}`;

// --- PRINCIPLE 1: Add generateMetadata (just like the news page) ---
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  const gallery = await client.fetch<{
    title: string;
    excerpt: string;
    coverImage: ImageAsset;
  }>(METADATA_QUERY, { slug });

  if (!gallery) {
    return {
      title: 'Gallery Not Found',
    };
  }

  const pageTitle = `${gallery.title} | Photo Gallery`;
  const pageDescription = gallery.excerpt || `Photo gallery: ${gallery.title}.`;

  const imageUrl = gallery.coverImage
    ? urlFor(gallery.coverImage).width(1200).height(630).url()
    : 'https://www.okazia.com.ua/images/photo-all-2.png'; // Fallback

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://www.okazia.com.ua/photos/${slug}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
  };
}

// --- PRINCIPLE 2: Make the page an 'async' Server Component ---
export default async function SinglePhotoGalleryPage({
  params,
}: {
  params: { slug: string }; // Use standard Next.js App Router params
}) {
  // Fetch data directly on the server
  const gallery = await client.fetch<PhotoGallery>(
    PAGE_QUERY,
    { slug: params.slug },
    { next: { revalidate: 60 } } // Added revalidation (like news page)
  );

  // Handle "not found" state on the server
  if (!gallery) {
    notFound(); // Use Next.js notFound helper
  }

  // Render the Client Component and pass the fetched data as props
  // All client-side logic (useState/useEffect) is now in PhotoGalleryClient
  return <PhotoGalleryClient gallery={gallery} />;
}
