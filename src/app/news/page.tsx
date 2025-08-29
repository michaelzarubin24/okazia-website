import { type SanityDocument } from "next-sanity";
import { client } from '../../sanity/client';
import { urlFor } from '../../sanity/image';

// This query fetches all posts and sorts them by publication date (newest first).
const POSTS_QUERY = `*[_type == "post"]|order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "mainImageUrl": mainImage.asset->url,
}`;

export default async function NewsPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY);
  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center uppercase tracking-wider mb-16">
          Новини
        </h1>

        <div className="max-w-3xl mx-auto space-y-12">
          {posts.map((post) => (
            <a key={post._id} href={`/news/${post.slug}`} className="block group">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Image */}
                {post.mainImageUrl && (
                  <div className="md:col-span-1 aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={post.mainImageUrl} 
                      alt={`Image for ${post.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {/* Text Content */}
                <div className={post.mainImageUrl ? "md:col-span-2" : "md:col-span-3"}>
                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(post.publishedAt).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h2 className="text-2xl font-bold group-hover:underline">{post.title}</h2>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}