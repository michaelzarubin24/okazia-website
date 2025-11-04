import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { groq } from 'next-sanity';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PhotoGalleryClient, { type PhotoGallery } from './PhotoGalleryClient'; // This is the new client file
import type { ImageAsset } from 'sanity';

// Query for metadata (fast)
const METADATA_QUERY = groq`*[_type == "photoGallery" && slug.current == $slug][0]{
  title,
  "excerpt": pt::text(description[0...1]),
  "coverImage": galleryImages[0].asset
}`;

// Query for page content (full)
const PAGE_QUERY = groq`*[_type == "photoGallery" && slug.current == $slug][0] {
  _id,
  title,
  date,
  description,
  galleryImages[] {
    _key,
    asset
  }
}`;

// --- generateMetadata function (using your Promise pattern) ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // Using your news page's pattern
}): Promise<Metadata> {
  const slug = (await params).slug; // Using your news page's pattern

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
    : 'https://www.okazia.com.ua/images/photo-all-2.png';

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

// --- Page Component (using your Promise pattern) ---
export default async function SinglePhotoGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Using your news page's pattern
}) {
  const resolvedParams = await params; // Using your news page's pattern

  const gallery = await client.fetch<PhotoGallery>(
    PAGE_QUERY,
    { slug: resolvedParams.slug }, // Using resolvedParams here
    { next: { revalidate: 60 } }
  );

  if (!gallery) {
    notFound();
  }

  // Pass the server-fetched data to the Client Component
  return <PhotoGalleryClient gallery={gallery} />;
}
