import { type SanityDocument } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import { client } from '../../../../sanity/client';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';

// --- This function generates the dynamic metadata for each track ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;

  // Fetch the specific track data needed for metadata
  const track = await client.fetch<SanityDocument>(
    `*[_type == "track" && slug.current == $slug][0]{
      title,
      "release": *[_type == "musicRelease" && references(^._id)][0]{
        "artworkUrl": artwork.asset->url
      }
    }`,
    { slug }
  );

  if (!track) {
    return {
      title: 'Track Not Found',
    };
  }

  const pageTitle = `${track.title} - OKAZIA | Офіційна сторінка`;
  const pageDescription = `Слухай "${track.title}" від OKAZIA. Досліджуй тексти, інформацію про реліз та відкривай більше музики від українського інді-рок гурту з Харкова!`;
  const imageUrl =
    track.release?.artworkUrl ||
    'https://www.okazia.com.ua/images/photo-all-2.png';

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://www.okazia.com.ua/music/track/${slug}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
  };
}

// This query finds the specific track by its slug, and also finds the release it belongs to.
const TRACK_QUERY = `*[_type == "track" && slug.current == $slug][0]{
  _id,
  title,
  aboutSong,
  aboutInstrumental,
  lyrics,
  // Find the release that references this track
  "release": *[_type == "musicRelease" && references(^._id)][0]{
    title,
    releaseDate,
    "artworkUrl": artwork.asset->url,
    smartLink
  }
}`;

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const track = await client.fetch<SanityDocument>(
    TRACK_QUERY,
    {
      slug: resolvedParams.slug,
    },
    { next: { revalidate: 60 } }
  );

  if (!track || !track.release) {
    return <div className="pt-24 text-center">Трек не знайдено.</div>;
  }

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Column: Artwork and Link */}
          <div>
            <div className="relative w-full aspect-square">
              <Image
                src={track.release.artworkUrl}
                alt={`Artwork for ${track.release.title}`}
                fill
                className="object-cover rounded-lg shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <Link
              href={track.release.smartLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center space-x-2 w-full text-center bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-black transition-colors uppercase tracking-wider text-base"
            >
              <Play size={18} />
              <span>Слухати</span>
            </Link>
          </div>

          {/* Right Column: Details */}
          <div className="md:sticky md:top-24">
            <p className="text-gray-400 mb-2">
              {new Date(track.release.releaseDate).toLocaleDateString('uk-UA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-wider mb-6">
              {track.title}
            </h1>

            <div className="prose prose-invert max-w-none text-lg text-gray-300 leading-relaxed space-y-6">
              <div>
                <h3 className="font-bold text-white mb-2">ПРО ПІСНЮ:</h3>
                <PortableText value={track.aboutSong} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">ПРО ІНСТРУМЕНТАЛ:</h3>
                <PortableText value={track.aboutInstrumental} />
              </div>
            </div>
          </div>
        </section>

        {/* Lyrics Section */}
        <section className="mt-16 md:mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Текст пісні</h2>
          <div className="max-w-2xl mx-auto bg-gray-800/50 p-8 rounded-lg prose prose-invert text-gray-300 text-lg leading-loose font-mono">
            <PortableText value={track.lyrics} />
          </div>
        </section>
      </div>
    </div>
  );
}
