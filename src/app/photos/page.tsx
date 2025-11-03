import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { groq } from 'next-sanity';
import type { ImageAsset } from 'sanity';

// Інтерфейс для даних, які ми запитуємо для картки галереї
interface GalleryCard {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  coverImage: ImageAsset[];
}

// Запит GROQ для отримання всіх галерей, відсортованих за датою
const galleriesQuery = groq`*[_type == "photoGallery"] | order(date desc) {
  _id,
  title,
  slug,
  date,
  coverImage
}`;

// Функція для форматування дати
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const revalidate = 60; // Ревалідація кожні 60 секунд

export default async function PhotoArchivePage() {
  const galleries: GalleryCard[] = await client.fetch(galleriesQuery);

  return (
    <div className="pt-24 sm:pt-32 pb-16 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 uppercase tracking-wider">
          Фото Архів
        </h1>

        {/* Сітка галерей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery) => (
            <Link
              key={gallery._id}
              href={`/photos/${gallery.slug.current}`}
              className="group relative block w-full aspect-[4/5] overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <Image
                src={urlFor(gallery.coverImage).url()}
                alt={gallery.title || 'Обкладинка галереї'}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-75"
              />
              {/* Оверлей з текстом */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-2xl font-bold uppercase">
                  {gallery.title}
                </h2>
                <p className="text-gray-300 text-sm">
                  {formatDate(gallery.date)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {galleries.length === 0 && (
          <p className="text-center text-gray-400 text-lg">
            Наразі фотогалерей немає.
          </p>
        )}
      </div>
    </div>
  );
}
