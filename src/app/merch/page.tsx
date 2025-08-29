import { type SanityDocument } from "next-sanity";
import { client } from '../../sanity/client'; 
import { urlFor } from '../../sanity/image';

// This query fetches all merch products.
const MERCH_QUERY = `*[_type == "merchProduct"]{
  _id,
  name,
  price,
  "imageUrl": imageGallery[0].asset->url // Get the URL of the first image in the gallery
}`;

export default async function MerchPage() {
  const products = await client.fetch<SanityDocument[]>(MERCH_QUERY);
  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-wider mb-4">
            МЕРЧ
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Підтримайте гурт і виглядайте добре, роблячи це! 
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-16">Щоб замовити будь-який з наших товарів, будь ласка, зв'яжіться з нами через сторінку контактів!</p>
        </div>

        {/* Merch Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="group">
              <div className="aspect-square w-full bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={`Photo of ${product.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            <a 
                href="/contacts"
                className="inline-block bg-white text-black font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-gray-200 transition-colors duration-300"
            >
                ЗАМОВИТИ
            </a>
        </div>
      </div>
    </div>
  );
}