'use client'; // This enables browser-side interactivity for the video.
import { useState, useEffect, useRef } from 'react';
import { type SanityDocument } from 'next-sanity';
import { client } from '../../sanity/client'; // Corrected import path

// --- HELPER FUNCTION TO GET YOUTUBE THUMBNAIL ---
const getYouTubeThumbnail = (url: string) => {
  if (!url) return '';
  const videoIdMatch = url.match(/(?:v=|\/embed\/|\/)([\w-]{11})/);
  if (videoIdMatch) {
    return `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
  }
  return '';
};

// This query fetches all videos, sorted by the 'order' field.
const VIDEOS_QUERY = `*[_type == "video"]|order(order asc){
  _id,
  title,
  youtubeUrl
}`;

export default function VideosPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allVideos, setAllVideos] = useState<SanityDocument[]>([]);

  useEffect(() => {
    async function fetchData() {
      const videos = await client.fetch<SanityDocument[]>(VIDEOS_QUERY);
      setAllVideos(videos);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      if (video.currentTime >= 60) {
        video.currentTime = 0;
      }
    };
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <>
      {/* Main Featured Video Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/videos/okazia-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-8">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider">
              ЦИКЛ (MUSIC VIDEO)
            </h2>
            <p className="mt-4 text-lg max-w-2xl">
              Натисніть нижче, щоб переглянути повну версію на YouTube з найкращою якістю та звуком.
            </p>
            <a
              href="https://www.youtube.com/watch?v=bMl_En4wSYo"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block bg-white text-black font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-gray-200 transition-colors duration-300"
            >
              Дивитись на YouTube
            </a>
        </div>
      </section>

      {/* All Other Videos Section */}
      <section className="py-16 sm:py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">
            ————  ІНШІ ВІДЕО  ————
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allVideos.map((video) => (
              <a key={video._id} href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group">
                <div className="aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={getYouTubeThumbnail(video.youtubeUrl)} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-white font-semibold mt-3">{video.title}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}