'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import { PortableText, PortableTextBlock } from '@portabletext/react';
import { X } from 'lucide-react';
import type { ImageAsset } from 'sanity';

// Define the shape of a single image in the gallery
interface GalleryImage {
  _key: string;
  asset: ImageAsset;
}

// Define the shape of the gallery data passed from the Server Component
export interface PhotoGallery {
  _id: string;
  title: string;
  date: string;
  description: PortableTextBlock[];
  galleryImages: GalleryImage[];
}

// Props for our new client component
interface PhotoGalleryClientProps {
  gallery: PhotoGallery;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function PhotoGalleryClient({
  gallery,
}: PhotoGalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // This hook now only handles the body scroll for the lightbox
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.galleryImages?.map((image, index) => {
              const imageUrl = urlFor(image).url();
              return (
                <div
                  key={image._key || index} // Use the _key from Sanity for a stable React key
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

      {/* Lightbox Modal */}
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
            onClick={(e) => e.stopPropagation()}
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
