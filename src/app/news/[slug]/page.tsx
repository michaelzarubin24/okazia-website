import { type SanityDocument } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import { client } from '../../../sanity/client';
import { urlFor } from '../../../sanity/image';
import Image from 'next/image';
import { Metadata } from 'next';

// --- Type definition for the page props ---
type Props = {
  params: { slug: string };
};

// --- This function generates the dynamic metadata for each news post ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;

  // Fetch the specific post from Sanity
  const post = await client.fetch<SanityDocument>(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      excerpt, // Assuming you have an 'excerpt' field for a short summary
      mainImage
    }`,
    { slug }
  );

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This news post could not be found.',
    };
  }

  const pageTitle = `${post.title} | OKAZIA News`;
  // Use the post's excerpt for the description, or create a generic one
  const pageDescription =
    post.excerpt || `Дізнайся більше про: "${post.title}".`;

  // Use the post's main image for social sharing, with a fallback
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : 'https://www.okazia.com.ua/images/photo-all-2.png';

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://www.okazia.com.ua/news/${slug}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
  };
}

// --- Your Existing Page Component (with corrections) ---

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

// CORRECTED: The params prop now uses the correct, modern format
export default async function NewsPostPage({ params }: Props) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, {
    slug: params.slug,
  });

  if (!post) {
    return <div className="pt-24 text-center">Post not found.</div>;
  }

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {post.title}
          </h1>
          <p className="text-gray-400 mb-8">
            {new Date(post.publishedAt).toLocaleDateString('uk-UA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {post.mainImage && (
            <div className="relative w-full aspect-video mb-8">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={`Image for ${post.title}`}
                fill
                priority
                className="object-cover rounded-lg"
                sizes="(max-width: 896px) 100vw, 768px"
              />
            </div>
          )}

          <div className="prose prose-invert lg:prose-xl max-w-none text-gray-300 leading-relaxed">
            <PortableText value={post.body} />
          </div>

          {post.photoGallery && post.photoGallery.length > 0 && (
            <section className="mt-12">
              <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.photoGallery.map((photo: GalleryPhoto, index: number) => (
                  <div
                    key={photo._key || index}
                    className="aspect-square relative"
                  >
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
