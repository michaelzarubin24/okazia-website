import { type SanityDocument } from "next-sanity";
import { client } from '../../../sanity/client'; 
import { urlFor } from '../../../sanity/image';

// This query fetches the album details and its list of tracks.
const ALBUM_QUERY = `*[_type == "musicRelease" && slug.current == $slug][0]{
  _id,
  title,
  "artworkUrl": artwork.asset->url,
  smartLink,
  // "tracks" is an array of references, so we expand them to get the track details
  "tracks": tracks[]->{
    _id,
    title,
    "slug": slug.current
  }
}`;

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const album = await client.fetch<SanityDocument>(ALBUM_QUERY, { slug: resolvedParams.slug });

  if (!album) {
    return <div className="pt-24 text-center">Альбом не знайдено.</div>;
  }

  return (
    <div>
      {/* Album Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center text-center bg-gray-900">
        {/* Background Artwork */}
        <div className="absolute inset-0">
          <img src={album.artworkUrl} alt={`Artwork for ${album.title}`} className="w-full h-full object-cover opacity-30" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-lg shadow-2xl overflow-hidden">
            <img src={album.artworkUrl} alt={`Artwork for ${album.title}`} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wider mt-8">{album.title}</h1>
          <a 
            href={album.smartLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-6 inline-block bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors uppercase tracking-wider"
          >
            Слухати
          </a>
        </div>
      </section>

      {/* Tracks "Book Spine" Section */}
      <section className="flex flex-col">
        {album.tracks && album.tracks.map((track: any) => (
          <a
            key={track._id}
            href={`/music/track/${track.slug}`}
            className="group relative block w-full h-32 overflow-hidden"
          >
            <div className="relative z-10 h-full flex items-center justify-center bg-black/70">
              <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-widest group-hover:tracking-[.2em] transition-all duration-300">
                {track.title}
              </h2>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}