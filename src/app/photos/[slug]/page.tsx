'use client'; // Ця сторінка є клієнтським компонентом через лайтбокс (useState)

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { groq } from 'next-sanity';
import { PortableText, PortableTextBlock } from '@portabletext/react';
import { X } from 'lucide-react';

import type { ImageAsset } from 'sanity';

// Повний інтерфейс для однієї фотогалереї
interface PhotoGallery {
  _id: string;
  title: string;
  date: string;
  description: PortableTextBlock[]; // Portable Text
  galleryImages: ImageAsset[];
}

// Запит GROQ для отримання однієї галереї за її slug
const galleryQuery = groq`*[_type == "photoGallery" && slug.current == $slug][0] {
  _id,
  title,
  date,
  description,
  galleryImages[] {
    asset
  }
}`;

// Функція для форматування дати
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function SinglePhotoGalleryPage({
  params,
}: {
  params: { slug: string };
}) {
  const [gallery, setGallery] = useState<PhotoGallery | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await client.fetch(galleryQuery, { slug: params.slug });
        setGallery(data);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [params.slug]);

  // Запобігання прокрутці фону, коли лайтбокс відкритий
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Очистка
    };
  }, [selectedImage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Завантаження галереї...</p>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Не вдалося знайти галерею.</p>
      </div>
    );
  }

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="pt-24 sm:pt-32 pb-16 min-h-screen bg-black text-white">
        <div className="container mx-auto px-4">
          {/* Заголовок та опис */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 uppercase tracking-wider">
              {gallery.title}
            </h1>
            <p className="text-lg text-gray-400 mb-6">
              {formatDate(gallery.date)}
            </p>
            <div className="text-center text-gray-300 prose prose-invert prose-lg max-w-none">
              <PortableText value={gallery.description} />
            </div>
          </div>

          {/* Сітка зображень */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.galleryImages?.map((image, index) => {
              const imageUrl = urlFor(image).url();
              return (
                <div
                  key={index}
                  className="w-full aspect-square relative overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => openLightbox(imageUrl)}
                >
                  <Image
                    src={imageUrl}
                    alt={`Зображення з галереї ${gallery.title} #${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Лайтбокс (модальне вікно) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white z-50"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()} // Зупиняє закриття при кліку на саме зображення
          >
            <Image
              src={selectedImage}
              alt="Зображення в повноекранному режимі"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
