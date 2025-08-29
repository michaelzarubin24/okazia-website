import { type SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { client } from '../../../sanity/client';
import { urlFor } from '../../../sanity/image';


const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  publishedAt,
  mainImage,
  body,
  photoGallery
}`;

// UPDATED: The 'params' prop type is now a Promise.
export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // We first await the params to resolve them...
  const { slug } = await params;
  // ...then we can safely use the slug property.
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug });

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
              <img 
                src={urlFor(post.mainImage).url()} 
                alt={`Image for ${post.title}`}
                className="w-full h-full object-cover rounded-lg"
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
                {post.photoGallery.map((photo: any, index: number) => (
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


