import { type SanityDocument } from "next-sanity";
import { client } from '../../sanity/client'; 

// This query now checks if a release is a single or an album.
const RELEASES_QUERY = `*[_type == "musicRelease"]|order(order asc){
  _id,
  title,
  "slug": slug.current,
  "bannerImageUrl": bannerImage.asset->url,
  // Count how many tracks are in the release
  "trackCount": count(tracks),
  // Get the slug of the first (and only) track if it's a single
  "singleTrackSlug": tracks[0]->slug.current
}`;

export default async function MusicPage() {
  const musicReleases = await client.fetch<SanityDocument[]>(RELEASES_QUERY);

  return (
    <div className="flex flex-col">
      {musicReleases.map((release) => {
        // Determine the correct link based on the number of tracks
        const href = release.trackCount > 1 
          ? `/music/${release.slug}` 
          : `/music/track/${release.singleTrackSlug}`;

        return (
          <a
            key={release._id}
            href={href}
            className="group relative block w-full h-48 overflow-hidden"
          >
            <div
              style={{ backgroundImage: `url(${release.bannerImageUrl})` }}
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="relative z-10 h-full flex items-center justify-center bg-black/50">
              <h2 className="text-white text-3xl md:text-4xl font-extrabold uppercase tracking-widest">
                {release.title}
              </h2>
            </div>
          </a>
        );
      })}
    </div>
  );
}