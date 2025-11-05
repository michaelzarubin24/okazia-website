import { type SanityDocument } from 'next-sanity';
import { client } from '../../sanity/client';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component

// This query fetches all merch products.
const MERCH_QUERY = `*[_type == "merchProduct"]{
  _id,
  name,
  price,
  "imageUrl": imageGallery[0].asset->url // Get the URL of the first image in the gallery
}`;

export default async function MerchPage() {
  const products = await client.fetch<SanityDocument[]>(
    MERCH_QUERY,
    {},
    { next: { revalidate: 300 } }
  );
  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-wider mb-4">
            МЕРЧ
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-16">
            Щоб замовити будь-який з наших товарів, будь ласка, зв&apos;яжіться
            з нами через{' '}
            {/* CHANGE 1: Updated href, text, and added target/rel */}
            <Link
              href="https://www.instagram.com/okazia.project?igsh=MWQ1d3F2aXZ0ODhnNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              наш Instagram
            </Link>
            !
          </p>
        </div>

        {/* Merch Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="group">
              <div className="relative aspect-square w-full bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={`Photo of ${product.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold">{product.name}</h3>
                <p className="text-xl text-gray-400 mt-1">₴{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          {/* CHANGE 2: Updated href and added target/rel */}
          <Link
            href="https://www.instagram.com/okazia.project?igsh=MWQ1d3F2aXZ0ODhnNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-gray-200 transition-colors duration-300"
          >
            ЗАМОВИТИ
          </Link>
        </div>
      </div>
    </div>
  );
}
