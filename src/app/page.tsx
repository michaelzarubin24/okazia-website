'use client';

import { useState, useEffect, useRef } from 'react';
import { type SanityDocument } from 'next-sanity';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { client } from '../sanity/client';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component

// --- HELPER FUNCTION TO GET YOUTUBE THUMBNAIL ---
const getYouTubeThumbnail = (url: string) => {
  if (!url) return '';
  const videoIdMatch = url.match(/(?:v=|\/embed\/|\/)([\w-]{11})/);
  if (videoIdMatch) {
    return `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
  }
  return '';
};

// --- FUTURE GIGS COMPONENT ---
const FutureGigs = ({ gigs }: { gigs: SanityDocument[] }) => {
  if (!gigs || gigs.length === 0) {
    return null;
  }
  return (
    <section className="py-9 sm:py-12 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">АНОНСИ</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-800/50 rounded-lg"
            >
              {/* REMOVED: aspect-[2/3] and relative from this div */}
              <div className="w-full md:w-1/3 flex-shrink-0">
                {/* Check if posterImage and its dimensions exist before rendering */}
                {gig.posterImage?.metadata?.dimensions && (
                  <Image
                    src={gig.posterImage.url}
                    alt={`Poster for ${gig.title}`}
                    // Provide original dimensions to maintain aspect ratio
                    width={gig.posterImage.metadata.dimensions.width}
                    height={gig.posterImage.metadata.dimensions.height}
                    // This makes the image responsive, just like the original <img>
                    className="w-full h-auto rounded-md shadow-lg"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
              <div className="flex-grow text-center md:text-left">
                {/* ... rest of your component is the same ... */}
                <p className="text-2xl font-bold">{gig.title}</p>
                <p className="text-lg text-gray-400 mt-2">
                  {new Date(gig.date).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-lg text-gray-400">
                  {gig.venue}, {gig.city}
                </p>
                <div className="mt-6">
                  {gig.ticketsUrl ? (
                    <Link
                      href={gig.ticketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full sm:w-auto text-center bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Квитки
                    </Link>
                  ) : (
                    <Link
                      href={`/gigs/archive/${gig.slug}`}
                      className="inline-block w-full sm:w-auto text-center bg-gray-600 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-500 transition-colors"
                    >
                      Деталі
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- LATEST RELEASES CAROUSEL ---
const LatestReleasesCarousel = ({
  releases,
}: {
  releases: SanityDocument[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSlidesToShow(1);
      else if (window.innerWidth < 768) setSlidesToShow(2);
      else setSlidesToShow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const handleNext = () => {
    const lastIndex =
      releases.length > slidesToShow ? releases.length - slidesToShow : 0;
    setCurrentIndex((prev) => (prev < lastIndex ? prev + 1 : lastIndex));
  };

  if (!releases || releases.length === 0) return null;

  return (
    <div className="relative w-full">
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 rounded-full transition-opacity hover:bg-black/80 disabled:opacity-20"
      >
        <ChevronLeft className="text-white" />
      </button>
      <button
        onClick={handleNext}
        disabled={currentIndex >= releases.length - slidesToShow}
        className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 rounded-full transition-opacity hover:bg-black/80 disabled:opacity-20"
      >
        <ChevronRight className="text-white" />
      </button>
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
          }}
        >
          {releases.map((release) => {
            const isSingle = release.trackCount === 1;
            const linkHref = isSingle
              ? `/music/track/${release.firstTrackSlug}`
              : `/music/${release.slug}`;

            return (
              <div
                key={release._id}
                className="flex-shrink-0 px-2 md:px-3 group flex flex-col items-center"
                style={{ width: `${100 / slidesToShow}%` }}
              >
                <Link href={linkHref} className="block w-full">
                  <div className="relative aspect-square w-full bg-gray-800 rounded-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                    {/* FIXED: Replaced <img> with <Image> */}
                    <Image
                      src={release.artworkUrl}
                      alt={release.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <h3 className="text-white font-bold text-center text-lg sm:text-xl">
                        {release.title}
                      </h3>
                    </div>
                  </div>
                </Link>
                <Link
                  href={release.smartLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center space-x-2 w-full text-center bg-white/10 text-white font-bold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors uppercase tracking-wider text-sm"
                >
                  <Play size={16} />
                  <span>Слухати</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- OTHER VIDEOS CAROUSEL ---
const OtherVideosCarousel = ({ videos }: { videos: SanityDocument[] }) => {
  if (!videos || videos.length === 0) return null;
  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {videos.slice(0, 8).map((video) => (
          <Link
            key={video._id}
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
              {/* FIXED: Replaced <img> with <Image> */}
              <Image
                src={getYouTubeThumbnail(video.youtubeUrl)}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              />
            </div>
            <p className="text-white font-semibold mt-2 truncate">
              {video.title}
            </p>
          </Link>
        ))}
      </div>
      {videos.length > 8 && (
        <div className="mt-12 text-center">
          <Link
            href="/videos"
            className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300"
          >
            ПЕРЕГЛЯНУТИ ВСІ
          </Link>
        </div>
      )}
    </div>
  );
};

// --- LATEST NEWS GRID ---
const LatestNewsCarousel = ({ posts }: { posts: SanityDocument[] }) => {
  if (!posts || posts.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link key={post._id} href={`/news/${post.slug}`} className="group">
          <div className="relative aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
            {/* FIXED: Replaced <img> with <Image> */}
            <Image
              src={post.mainImageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <p className="text-gray-400 text-sm mt-4">
            {new Date(post.publishedAt).toLocaleDateString('uk-UA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h3 className="text-white text-xl font-bold mt-2 group-hover:underline">
            {post.title}
          </h3>
        </Link>
      ))}
    </div>
  );
};
// ... (NewsletterForm component remains the same)
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const MAILCHIMP_URL =
    'https://gmail.us15.list-manage.com/subscribe/post?u=4fdcb783d461acf4d88126353&id=c84bd47487&f_id=00d2a2e1f0';
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData();
    formData.append('EMAIL', email);
    formData.append('b_4fdcb783d461acf4d88126353_c84bd47487', '');
    try {
      await fetch(MAILCHIMP_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
      setStatus('success');
      setMessage('Дякуємо за підписку!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Щось пішло не так. Спробуйте ще раз.');
    }
  };
  return (
    <section className="py-16 sm:py-24 bg-black">
      {' '}
      <div className="container mx-auto px-4 text-center">
        {' '}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          {' '}
          Підписуйтесь на наші новини!{' '}
        </h2>{' '}
        <p className="max-w-xl mx-auto text-gray-400 mb-10">
          {' '}
          Будьте першими, хто дізнається про нову музику, дати турів та
          ексклюзивний контент. Без спаму, тільки найкраще.{' '}
        </p>{' '}
        {status === 'success' ? (
          <p className="text-green-400 text-lg">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            {' '}
            <div className="flex flex-col sm:flex-row gap-4">
              {' '}
              <input
                type="email"
                name="EMAIL"
                placeholder="Ваша електронна пошта..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />{' '}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {' '}
                {status === 'sending' ? 'Subscribing...' : 'Підписатися'}{' '}
              </button>{' '}
            </div>{' '}
            {status === 'error' && (
              <p className="text-red-400 mt-4">{message}</p>
            )}{' '}
          </form>
        )}{' '}
      </div>{' '}
    </section>
  );
};

// --- MAIN HOME PAGE ---
const LATEST_RELEASES_QUERY = `*[_type == "musicRelease"]|order(releaseDate desc)[0...10]{
  _id,
  title,
  "slug": slug.current,
  "artworkUrl": artwork.asset->url,
  smartLink,
  "trackCount": count(tracks),
  "firstTrackSlug": tracks[0]->slug.current
}`;
const FUTURE_GIGS_QUERY = `*[_type == "gig" && date >= now()]|order(date asc){
  _id, 
  title, 
  date, 
  venue, 
  city, 
  ticketsUrl, 
  "slug": slug.current, 
  "posterImage": posterImageUrl.asset->{
    url,
    metadata {
      dimensions
    }
  }
}`;
const VIDEOS_QUERY = `*[_type == "video"]|order(order asc){_id, title, youtubeUrl}`;
const LATEST_POSTS_QUERY = `*[_type == "post"]|order(publishedAt desc)[0...3]{_id, title, "slug": slug.current, publishedAt, "mainImageUrl": mainImage.asset->url}`;

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [latestReleases, setLatestReleases] = useState<SanityDocument[]>([]);
  const [futureGigs, setFutureGigs] = useState<SanityDocument[]>([]);
  const [otherVideos, setOtherVideos] = useState<SanityDocument[]>([]);
  const [latestPosts, setLatestPosts] = useState<SanityDocument[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [releases, gigs, videos, posts] = await Promise.all([
        client.fetch<SanityDocument[]>(LATEST_RELEASES_QUERY),
        client.fetch<SanityDocument[]>(FUTURE_GIGS_QUERY),
        client.fetch<SanityDocument[]>(VIDEOS_QUERY),
        client.fetch<SanityDocument[]>(LATEST_POSTS_QUERY),
      ]);
      setLatestReleases(releases);
      setFutureGigs(gigs);
      setOtherVideos(videos);
      setLatestPosts(posts);
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
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* FIXED: Changed mobile height and vertical alignment */}
      <section className="relative w-full pt-12 pb-12 flex items-start justify-center bg-black md:h-screen md:items-center">
        {/* FIXED: Replaced <img> with <Image> */}
        <Image
          src="/images/photo-all-2.png"
          alt="OKAZIA band photo"
          fill
          priority
          className="hidden md:block object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50 md:hidden"></div>
        <div className="absolute inset-0 bg-black opacity-30 hidden md:block"></div>
        <div className="relative z-10 p-4 sm:p-8 flex flex-col items-center text-center text-white">
          {/* FIXED: Replaced <img> with <Image> but used fixed width/height as it's a logo */}
          <Image
            src="/okazia-white.png"
            alt="OKAZIA Logo"
            width={512} // Use actual width of your logo file for better performance
            height={150} // Use actual height
            className="w-full max-w-sm sm:max-w-lg md:max-w-xl h-auto"
            priority
          />
          <p className="text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.1em] sm:tracking-[0.18em] mt-4">
            МУЗИЧНА ОКАЗІЯ З ХАРКОВА
          </p>
        </div>
      </section>

      <FutureGigs gigs={futureGigs} />

      <section className="py-9 sm:py-12 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">МУЗИКА</h2>
          <LatestReleasesCarousel releases={latestReleases} />
        </div>
      </section>

      {/* ... (Rest of the code is the same, just including the fixed full-screen image sections below) ... */}
      <section className="py-9 sm:py-12 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">ВІДЕО</h2>
          <div className="relative h-[60vh] sm:h-[75vh] w-full overflow-hidden rounded-lg">
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
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-4 sm:p-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wider">
                ЦИКЛ (MUSIC VIDEO)
              </h3>
              <Link
                href="https://www.youtube.com/watch?v=bMl_En4wSYo"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block bg-white text-black font-bold text-base sm:text-lg tracking-widest uppercase px-6 py-3 sm:px-8 sm:py-3 hover:bg-gray-200 transition-colors duration-300"
              >
                Дивитись на YouTube
              </Link>
            </div>
          </div>
          <OtherVideosCarousel videos={otherVideos} />
        </div>
      </section>

      <section className="hidden md:block relative w-full h-[100vh]">
        {/* FIXED: Replaced <img> with <Image> */}
        <Image
          src="/images/main-2.png"
          alt="Explore our tour"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 sm:p-8 text-center">
          <div className="text-white w-full max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wider mb-4">
              ПЕРШИЙ ТУР УКРАЇНОЮ
            </h2>
            <p className="mt-4 text-lg sm:text-xl uppercase tracking-widest">
              НА ПІДТРИМКУ БРИТАНСЬКОГО ГУРТУ
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/news/pershii-tur-ukrayinoyu-razom-z-hardwicke-circus"
              className="inline-block bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg tracking-widest uppercase px-8 py-3 sm:px-10 sm:py-4 hover:bg-white hover:text-black transition-colors duration-300"
            >
              ЧИТАТИ
            </Link>
          </div>
        </div>
      </section>

      <section className="hidden md:block relative w-full h-[100vh]">
        {/* FIXED: Replaced <img> with <Image> */}
        <Image
          src="/images/main-4.png"
          alt="Explore our concert"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex items-end justify-center z-10 p-4 sm:p-8 md:p-12">
          <div className="text-center text-white max-w-2xl mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wider">
              СОЛЬНИЙ КОНЦЕРТ В ART AREA ДК
            </h2>
            <p className="mt-4 text-base sm:text-lg">
              Наш перший великий сольний концерт відбувся 6 червня 2025 року в
              культурному просторі ART AREA ДК!
            </p>
            <Link
              href="/news/colnii-koncert-v-art-area-dk"
              className="mt-8 inline-block bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg tracking-widest uppercase px-8 py-3 sm:px-10 sm:py-4 hover:bg-white hover:text-black transition-colors duration-300"
            >
              ЧИТАТИ
            </Link>
          </div>
        </div>
      </section>

      <section className="py-9 sm:py-12 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">НОВИНИ</h2>
          <LatestNewsCarousel posts={latestPosts} />
          <div className="mt-12">
            <Link
              href="/news"
              className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300"
            >
              ПЕРЕГЛЯНУТИ ВСІ
            </Link>
          </div>
        </div>
      </section>

      <NewsletterForm />
    </>
  );
}
