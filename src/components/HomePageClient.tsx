'use client';

import { useState, useEffect, useRef } from 'react';
import { type SanityDocument } from 'next-sanity';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { client } from '../sanity/client';
import Link from 'next/link';
import Image from 'next/image';

// --- HELPER FUNCTION TO GET YOUTUBE THUMBNAIL ---
const getYouTubeThumbnail = (url: string) => {
  if (!url) return '';
  const videoIdMatch = url.match(/(?:v=|\/embed\/|\/)([\w-]{11})/);
  if (videoIdMatch) {
    return `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
  }
  return '';
};

// --- PRE-RELEASE WIDGET ---
const PreReleaseWidget = () => {
  return (
    <section className="py-12 bg-black border-b border-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 uppercase tracking-widest text-white">
          ———— PRE-SAVE ————
        </h2>
        <div className="max-w-3xl mx-auto">
          {/* Container with specific styling to ensure the iframe 
            looks integrated and responsive 
          */}
          <div className="rounded-lg overflow-hidden shadow-2xl bg-[#1a1a1a]">
            <iframe
              src="https://show.co/social-unlock/2EeqDZjhqjKQB5YaGRBwGF/widget"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ display: 'block' }}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FUTURE GIGS COMPONENT ---
const FutureGigs = ({
  gigs,
  title,
  ticketsText,
  detailsText,
}: {
  gigs: SanityDocument[];
  title: string;
  ticketsText: string;
  detailsText: string;
}) => {
  if (!gigs || gigs.length === 0) {
    return null;
  }
  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          {/* Use dynamic title from Sanity */}
          ———— {title} ————
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 bg-gray-800/50 rounded-lg"
            >
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img
                  src={gig.posterImageUrl}
                  alt={`Poster for ${gig.title}`}
                  className="w-full h-auto rounded-md shadow-lg"
                />
              </div>
              <div className="flex-grow text-center md:text-left">
                <p className="text-xl sm:text-2xl font-bold">{gig.title}</p>
                <p className="text-md sm:text-lg text-gray-400 mt-2">
                  {new Date(gig.date).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-md sm:text-lg text-gray-400">
                  {gig.venue}, {gig.city}
                </p>
                <div className="mt-6">
                  {gig.ticketsUrl ? (
                    <a
                      href={gig.ticketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full sm:w-auto text-center bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      {/* Use dynamic button text */}
                      {ticketsText}
                    </a>
                  ) : (
                    <Link
                      href={`/gigs/archive/${gig.slug}`}
                      className="inline-block w-full sm:w-auto text-center bg-gray-600 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-500 transition-colors"
                    >
                      {/* Use dynamic button text */}
                      {detailsText}
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
  title,
}: {
  releases: SanityDocument[];
  title: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const handleNext = () => {
    const lastPossibleIndex =
      releases.length > slidesToShow ? releases.length - slidesToShow : 0;
    setCurrentIndex((prev) =>
      prev < lastPossibleIndex ? prev + 1 : lastPossibleIndex
    );
  };

  if (!releases || releases.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          ———— {title} ————
        </h2>
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
                        <img
                          src={release.artworkUrl}
                          alt={release.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                          <h3 className="text-white font-bold text-center text-lg sm:text-xl">
                            {release.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <a
                      href={release.smartLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center space-x-2 w-full text-center bg-white/10 text-white font-bold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors uppercase tracking-wider text-sm"
                    >
                      <Play size={16} />
                      <span>Слухати</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- OTHER VIDEOS CAROUSEL ---
const OtherVideosCarousel = ({ videos }: { videos: SanityDocument[] }) => {
  if (!videos || videos.length === 0) return null;
  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {videos.slice(0, 8).map((video) => (
          <a
            key={video._id}
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={getYouTubeThumbnail(video.youtubeUrl)}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-white font-semibold mt-2 truncate">
              {video.title}
            </p>
          </a>
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
const LatestNewsCarousel = ({
  posts,
  title,
}: {
  posts: SanityDocument[];
  title: string;
}) => {
  if (!posts || posts.length === 0) return null;
  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          ———— {title} ————
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post._id} href={`/news/${post.slug}`} className="group">
              <div className="aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={post.mainImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
  );
};

// --- NEWSLETTER FORM ---

// Type definition to fix the "Unexpected any" error
interface NewsletterSectionData {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  errorMessage?: string;
}

const NewsletterForm = ({ data }: { data?: NewsletterSectionData }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const MAILCHIMP_URL =
    'https://gmail.us15.list-manage.com/subscribe/post?u=4fdcb783d461acf4d88126353&id=c84bd47487&f_id=00d2a2e1f0';

  // Use data from Sanity or defaults
  const title = data?.title || 'Підписуйтесь на наші новини!';
  const desc =
    data?.description ||
    'Будьте першими, хто дізнається про нову музику, дати турів та ексклюзивний контент. Без спаму, тільки найкраще.';
  const placeholder = data?.placeholder || 'Ваша електронна пошта...';
  const btnText = data?.buttonText || 'Підписатися';
  const successMsg = data?.successMessage || 'Дякуємо за підписку!';
  const errorMsg = data?.errorMessage || 'Щось пішло не так. Спробуйте ще раз.';

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
      setMessage(successMsg);
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(errorMsg);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4"> {title} </h2>
        <p className="max-w-xl mx-auto text-gray-400 mb-10"> {desc} </p>
        {status === 'success' ? (
          <p className="text-green-400 text-lg">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                name="EMAIL"
                placeholder={placeholder}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? '...' : btnText}
              </button>
            </div>
            {status === 'error' && (
              <p className="text-red-400 mt-4">{message}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

// --- MAIN HOME PAGE ---
const LATEST_RELEASES_QUERY = `*[_type == "musicRelease"]|order(releaseDate desc)[0...10]{_id, title, "slug": slug.current, "artworkUrl": artwork.asset->url, smartLink, "trackCount": count(tracks), "firstTrackSlug": tracks[0]->slug.current}`;
const FUTURE_GIGS_QUERY = `*[_type == "gig" && date >= now()]|order(date asc){_id, title, date, venue, city, ticketsUrl, "slug": slug.current, "posterImageUrl": posterImageUrl.asset->url}`;
const VIDEOS_QUERY = `*[_type == "video"]|order(order asc){_id, title, youtubeUrl}`;
const LATEST_POSTS_QUERY = `*[_type == "post"]|order(publishedAt desc)[0...3]{_id, title, "slug": slug.current, publishedAt, "mainImageUrl": mainImage.asset->url}`;
// NEW: Query for Home Page content
const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  heroSection {
    "mainImageUrl": mainImage.asset->url,
    "logoUrl": logo.asset->url,
    tagline,
    supportLink,
    supportButtonText
  },
  sectionTitles,
  videoSection {
    "videoFileUrl": videoUrl.asset->url,
    title,
    subtitle,
    youtubeLink,
    buttonText
  },
  promoSection1 {
    "imageUrl": image.asset->url,
    title,
    subtitle,
    buttonText,
    link
  },
  promoSection2 {
    "imageUrl": image.asset->url,
    title,
    subtitle,
    buttonText,
    link
  },
  newsletterSection
}`;

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [latestReleases, setLatestReleases] = useState<SanityDocument[]>([]);
  const [futureGigs, setFutureGigs] = useState<SanityDocument[]>([]);
  const [otherVideos, setOtherVideos] = useState<SanityDocument[]>([]);
  const [latestPosts, setLatestPosts] = useState<SanityDocument[]>([]);
  const [homeData, setHomeData] = useState<SanityDocument | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [releases, gigs, videos, posts, home] = await Promise.all([
        client.fetch<SanityDocument[]>(LATEST_RELEASES_QUERY),
        client.fetch<SanityDocument[]>(FUTURE_GIGS_QUERY),
        client.fetch<SanityDocument[]>(VIDEOS_QUERY),
        client.fetch<SanityDocument[]>(LATEST_POSTS_QUERY),
        client.fetch<SanityDocument>(HOME_PAGE_QUERY),
      ]);
      setLatestReleases(releases);
      setFutureGigs(gigs);
      setOtherVideos(videos);
      setLatestPosts(posts);
      setHomeData(home);
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

      {/* Hero Section */}
      <section className="relative w-full min-h-[50vh] flex items-center justify-center bg-black md:h-screen">
        {homeData?.heroSection?.mainImageUrl && (
          <img
            src={homeData.heroSection.mainImageUrl}
            alt="Band Photo"
            className="hidden md:block w-full h-full object-cover absolute inset-0"
          />
        )}
        <div className="absolute inset-0 bg-black opacity-50 md:hidden"></div>
        <div className="absolute inset-0 bg-black opacity-30 hidden md:block"></div>
        <div className="relative z-10 p-4 sm:p-8 flex flex-col items-center text-center text-white">
          {homeData?.heroSection?.logoUrl && (
            <img
              src={homeData.heroSection.logoUrl}
              alt="OKAZIA Logo"
              className="w-full max-w-sm sm:max-w-lg md:max-w-xl"
            />
          )}
          <p className="text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.1em] sm:tracking-[0.18em] mt-4">
            {homeData?.heroSection?.tagline || 'МУЗИЧНА ОКАЗІЯ З ХАРКОВА'}
          </p>
          {homeData?.heroSection?.supportLink && (
            <div className="mt-8">
              <Link
                href={homeData.heroSection.supportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300"
              >
                {homeData.heroSection.supportButtonText || 'ПІДТРИМАТИ'}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* --- PRE-RELEASE WIDGET INSERTED HERE --- */}
      <PreReleaseWidget />

      <FutureGigs
        gigs={futureGigs}
        title={homeData?.sectionTitles?.futureGigsTitle || 'АНОНСИ'}
        ticketsText="Квитки" // You can add fields for these too if you want
        detailsText="Деталі"
      />

      <LatestReleasesCarousel
        releases={latestReleases}
        title={homeData?.sectionTitles?.musicTitle || 'МУЗИКА'}
      />

      <section className="py-16 sm:py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">
            ———— {homeData?.sectionTitles?.videoTitle || 'ВІДЕО'} ————
          </h2>
          <div className="relative h-[60vh] sm:h-[75vh] w-full overflow-hidden rounded-lg">
            {homeData?.videoSection?.videoFileUrl && (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
              >
                <source
                  src={homeData.videoSection.videoFileUrl}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-4 sm:p-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wider">
                {homeData?.videoSection?.title || 'ЦИКЛ (MUSIC VIDEO)'}
              </h3>
              {homeData?.videoSection?.youtubeLink && (
                <a
                  href={homeData.videoSection.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block bg-white text-black font-bold text-base sm:text-lg tracking-widest uppercase px-6 py-3 sm:px-8 sm:py-3 hover:bg-gray-200 transition-colors duration-300"
                >
                  {homeData.videoSection.buttonText || 'Дивитись на YouTube'}
                </a>
              )}
            </div>
          </div>
          <OtherVideosCarousel videos={otherVideos} />
        </div>
      </section>

      {/* PROMO SECTION 1 (e.g. Tour) */}
      {homeData?.promoSection1?.imageUrl && (
        <section className="hidden md:block relative w-full h-[70vh]">
          <img
            src={homeData.promoSection1.imageUrl}
            alt={homeData.promoSection1.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 sm:p-8 text-center">
            <div className="text-white w-full max-w-4xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wider mb-4">
                {homeData.promoSection1.title}
              </h2>
              <p className="mt-4 text-lg sm:text-xl uppercase tracking-widest">
                {homeData.promoSection1.subtitle}
              </p>
            </div>
            {homeData.promoSection1.link && (
              <div className="mt-8">
                <Link
                  href={homeData.promoSection1.link}
                  className="inline-block bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg tracking-widest uppercase px-8 py-3 sm:px-10 sm:py-4 hover:bg-white hover:text-black transition-colors duration-300"
                >
                  {homeData.promoSection1.buttonText}
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PROMO SECTION 2 (e.g. Concert) */}
      {homeData?.promoSection2?.imageUrl && (
        <section className="hidden md:block relative w-full h-[70vh]">
          <img
            src={homeData.promoSection2.imageUrl}
            alt={homeData.promoSection2.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 flex items-end justify-center z-10 p-4 sm:p-8 md:p-12">
            <div className="text-center text-white max-w-2xl mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wider">
                {homeData.promoSection2.title}
              </h2>
              <p className="mt-4 text-base sm:text-lg">
                {homeData.promoSection2.subtitle}
              </p>
              {homeData.promoSection2.link && (
                <Link
                  href={homeData.promoSection2.link}
                  className="mt-8 inline-block bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg tracking-widest uppercase px-8 py-3 sm:px-10 sm:py-4 hover:bg-white hover:text-black transition-colors duration-300"
                >
                  {homeData.promoSection2.buttonText}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <LatestNewsCarousel
        posts={latestPosts}
        title={homeData?.sectionTitles?.newsTitle || 'ІНШІ НОВИНИ'}
      />

      <NewsletterForm data={homeData?.newsletterSection} />
    </>
  );
}
