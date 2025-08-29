'use client'; // This enables browser-side interactivity for the form and carousel.

import { useState, useEffect, useRef } from 'react';
import { type SanityDocument } from 'next-sanity';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { client } from '../sanity/client'; // Corrected import path

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
    <section className="py-16 sm:py-24 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          ————  АНОНСИ  ————
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {gigs.map((gig) => (
            <div key={gig._id} className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-800/50 rounded-lg">
              <div className="md:w-1/3 flex-shrink-0">
                <img src={gig.posterImageUrl} alt={`Poster for ${gig.title}`} className="w-full h-auto rounded-md shadow-lg" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <p className="text-2xl font-bold">{gig.title}</p>
                <p className="text-lg text-gray-400 mt-2">{new Date(gig.date).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-lg text-gray-400">{gig.venue}, {gig.city}</p>
                <div className="mt-6">
                  {gig.ticketsUrl ? (
                    <a href={gig.ticketsUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto text-center bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors">Квитки</a>
                  ) : (
                    <a href={`/gigs/archive/${gig.slug}`} className="inline-block w-full sm:w-auto text-center bg-gray-600 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-500 transition-colors">Деталі</a>
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
const LatestReleasesCarousel = ({ releases }: { releases: SanityDocument[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const handleNext = () => {
    const lastIndex = releases.length > 4 ? releases.length - 4 : 0;
    setCurrentIndex((prev) => (prev < lastIndex ? prev + 1 : lastIndex));
  };
  if (!releases || releases.length === 0) return null;

  return (
    <div className="relative w-full">
      <button onClick={handlePrev} disabled={currentIndex === 0} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 rounded-full transition-opacity hover:bg-black/80 disabled:opacity-20"><ChevronLeft className="text-white" /></button>
      <button onClick={handleNext} disabled={currentIndex >= releases.length - 4} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 rounded-full transition-opacity hover:bg-black/80 disabled:opacity-20"><ChevronRight className="text-white" /></button>
      <div className="w-full overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}>
          {releases.map((release) => (
            <div key={release._id} className="flex-shrink-0 w-1/4 px-2 md:px-3 group flex flex-col items-center">
              <a href={`/music/${release.slug}`} className="block w-full">
                <div className="relative aspect-square w-full bg-gray-800 rounded-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                  <img src={release.artworkUrl} alt={release.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <h3 className="text-white font-bold text-center text-xl">{release.title}</h3>
                  </div>
                </div>
              </a>
              <a href={release.smartLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center justify-center space-x-2 w-full text-center bg-white/10 text-white font-bold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors uppercase tracking-wider text-sm"><Play size={16} /><span>Слухати</span></a>
            </div>
          ))}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {videos.slice(0, 8).map((video) => (
                    <a key={video._id} href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group">
                        <div className="aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
                            <img src={getYouTubeThumbnail(video.youtubeUrl)} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <p className="text-white font-semibold mt-2 truncate">{video.title}</p>
                    </a>
                ))}
            </div>
            {videos.length > 4 && (
                <div className="mt-12 text-center">
                    <a href="/videos" className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300">
                        ПЕРЕГЛЯНУТИ ВСІ
                    </a>
                </div>
            )}
        </div>
    );
};

// --- LATEST NEWS CAROUSEL ---
const LatestNewsCarousel = ({ posts }: { posts: SanityDocument[] }) => {
    if (!posts || posts.length === 0) return null;
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
                <a key={post._id} href={`/news/${post.slug}`} className="group">
                    <div className="aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
                        <img src={post.mainImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="text-gray-400 text-sm mt-4">{new Date(post.publishedAt).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h3 className="text-white text-xl font-bold mt-2 group-hover:underline">{post.title}</h3>
                </a>
            ))}
        </div>
    );
};


// --- NEWSLETTER FORM ---
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const MAILCHIMP_URL = "https://gmail.us15.list-manage.com/subscribe/post?u=4fdcb783d461acf4d88126353&id=c84bd47487&f_id=00d2a2e1f0";
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setStatus('sending'); const formData = new FormData(); formData.append('EMAIL', email); formData.append('b_4fdcb783d461acf4d88126353_c84bd47487', ''); try { await fetch(MAILCHIMP_URL, { method: 'POST', body: formData, mode: 'no-cors' }); setStatus('success'); setMessage('Дякуємо за підписку!'); setEmail(''); } catch (error) { setStatus('error'); setMessage('Щось пішло не так. Спробуйте ще раз.'); } };
  return ( <section className="py-16 sm:py-24 bg-black"> <div className="container mx-auto px-4 text-center"> <h2 className="text-3xl sm:text-4xl font-bold mb-4"> Підписуйтесь на наші новини! </h2> <p className="max-w-2xl mx-auto text-gray-400 mb-10"> Будьте першими, хто дізнається про нову музику, дати турів та ексклюзивний контент. Без спаму, тільки найкраще. </p> {status === 'success' ? ( <p className="text-green-400 text-lg">{message}</p> ) : ( <form onSubmit={handleSubmit} className="max-w-lg mx-auto"> <div className="flex flex-col sm:flex-row gap-4"> <input type="email" name="EMAIL" placeholder="Ваша електронна пошта..." required value={email} onChange={(e) => setEmail(e.target.value)} className="flex-grow w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white" /> <button type="submit" disabled={status === 'sending'} className="bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"> {status === 'sending' ? 'Subscribing...' : 'Підписатися'} </button> </div> {status === 'error' && <p className="text-red-400 mt-4">{message}</p>} </form> )} </div> </section> );
};


// --- MAIN HOME PAGE ---
const LATEST_RELEASES_QUERY = `*[_type == "musicRelease"]|order(releaseDate desc)[0...10]{_id, title, "slug": slug.current, "artworkUrl": artwork.asset->url, smartLink}`;
const FUTURE_GIGS_QUERY = `*[_type == "gig" && date >= now()]|order(date asc){_id, title, date, venue, city, ticketsUrl, "slug": slug.current, "posterImageUrl": posterImageUrl.asset->url}`;
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
    const handleTimeUpdate = () => { if (video.currentTime >= 60) { video.currentTime = 0; } };
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => { video.removeEventListener('timeupdate', handleTimeUpdate); };
  }, []);

  return (
    <>
      <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
      <section className="relative w-full">
        <img src="/images/photo-all-2.png" alt="OKAZIA band photo" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-end justify-center z-10 p-8 sm:p-12 md:p-24">
          <div className="text-left text-white">
            <img src="/okazia-white.png" alt="OKAZIA Logo" className="mx-auto" style={{ width: '600px', height: 'auto' }} />
            <p className="text-4xl uppercase tracking-widest">МУЗИЧНА ОКАЗІЯ З ХАРКОВА</p>
          </div>
        </div>
      </section>

      <FutureGigs gigs={futureGigs} />

      <section className="py-16 sm:py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12">————  МУЗИКА  ————</h2>
            <LatestReleasesCarousel releases={latestReleases} />
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">————  ВІДЕО  ————</h2>
          <div className="relative h-[50vh] sm:h-[75vh] w-full overflow-hidden rounded-lg">
            <video ref={videoRef} autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
              <source src="/videos/okazia-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-8">
                <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wider">ЦИКЛ (MUSIC VIDEO)</h3>
                <a href="https://www.youtube.com/watch?v=bMl_En4wSYo" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block bg-white text-black font-bold text-lg tracking-widest uppercase px-8 py-3 hover:bg-gray-200 transition-colors duration-300">Дивитись на YouTube</a>
            </div>
          </div>
          <OtherVideosCarousel videos={otherVideos} />
        </div>
      </section>
      
      <section className="relative w-full">
        <img src="/images/main-2.png" alt="Explore our tour" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center z-10 p-8 text-center">
          <div className="text-white w-full max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider mb-4">ПЕРШИЙ ТУР УКРАЇНОЮ</h2>
            <p className="mt-4 text-xl uppercase tracking-widest">НА ПІДТРИМКУ БРИТАНСЬКОГО ГУРТУ</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full flex justify-center z-10 p-8 sm:p-12">
          <a href="/news/pershii-tur-ukrayinoyu-razom-z-hardwicke-circus" className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300">ЧИТАТИ</a>
        </div>
      </section>

      <section className="relative w-full">
        <img src="/images/main-4.png" alt="Explore our concert" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex items-end justify-center z-10 p-8 sm:p-12">
          <div className="text-center text-white max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider">СОЛЬНИЙ КОНЦЕРТ В ART AREA ДК</h2>
            <p className="mt-4 text-lg">Наш перший великий сольний концерт відбувся 6 червня 2025 року в культурному просторі ART AREA ДК!</p>
            <a href="/news/colnii-koncert-v-art-area-dk" className="mt-8 inline-block bg-transparent border-2 border-white text-white font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300">ЧИТАТИ</a>
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">
            ————  ІНШІ НОВИНИ  ————
          </h2>
          <LatestNewsCarousel posts={latestPosts} />
          <div className="mt-12">
            <a href="/news" className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300">
              ПЕРЕГЛЯНУТИ ВСІ
            </a>
          </div>
        </div>
      </section>

      <NewsletterForm />
    </>
  );
}