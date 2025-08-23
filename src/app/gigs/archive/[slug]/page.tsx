// Placeholder data for all your past gigs. This will eventually come from a CMS.
const allPastGigs = [
    {
      slug: "artdacha-2025-06-06",
      title: "Сольний концерт в ART AREA ДК",
      mainImageUrl: "/images/gig-images/solo-concert-1.jpg",
      date: "June 6, 2025",
      venue: "ART AREA ДК",
      city: "Харків, Україна",
      setlist: `1. Мавка
2. Чугайстер
3. Повітруля
4. Сновида
5. Відьма
6. Вовкулака
7. Мольфар
8. Купала
9. Цикл
10. Немов тінь
11. Шрами
12. Не чекаю
13. Осудні софіти
14. Не спиняюсь
15. Твій постріл`,
      interestingFacts: "Наш перший сольний концерт у Харкові в ART AREA ДК, де ми вперше виконали багато нових пісень! ",
      photoGallery: [
        "/images/gig-images/solo-concert-1.jpg",
        "/images/gig-images/solo-concert-2.jpg",
        "/images/gig-images/solo-concert-3.jpg",
        "/images/gig-images/solo-concert-4.jpg",
      ],
      // youtubeUrl: "https://www.youtube.com/embed/GlgQ0SFKyH0", // Optional
    },
    // Add other past gigs here...
];

export default function GigDetailPage({ params }: { params: { slug: string } }) {
  const gig = allPastGigs.find(g => g.slug === params.slug);
  
  // Filter for related gigs (e.g., all other gigs except the current one)
  const relatedGigs = allPastGigs.filter(g => g.slug !== params.slug).slice(0, 3);

  if (!gig) {
    return <div className="pt-24 text-center">Gig not found.</div>;
  }

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      {/* 1. & 2. Gig Title and Main Image */}
      <section 
        className="relative h-[60vh] w-full flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${gig.mainImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-white">
          <p className="text-lg mb-2">{gig.date}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wider">{gig.title}</h1>
        </div>
      </section>

      <div className="container mx-auto px-6 sm:px-8 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Setlist & Facts */}
          <div className="lg:col-span-2">
            {/* 4. Setlist */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Setlist</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <p className="text-gray-300 text-lg leading-loose whitespace-pre-wrap font-mono">
                  {gig.setlist}
                </p>
              </div>
            </section>

            {/* 5. Interesting Facts */}
            <section className="mt-12">
              <h2 className="text-3xl font-bold mb-4">Memories</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {gig.interestingFacts}
              </p>
            </section>
          </div>

          {/* Right Column: Related Gigs */}
          <aside className="lg:sticky lg:top-24 h-fit">
             <h3 className="text-2xl font-bold mb-4">More Gigs</h3>
             <div className="space-y-4">
               {relatedGigs.map(relatedGig => (
                 <a key={relatedGig.slug} href={`/gigs/archive/${relatedGig.slug}`} className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                   <p className="font-bold">{relatedGig.title}</p>
                   <p className="text-sm text-gray-400">{relatedGig.date}</p>
                 </a>
               ))}
             </div>
          </aside>
        </div>

        {/* 6. Photo Carousel */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gig.photoGallery.map((photo, index) => (
              <div key={index} className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-lg">
                {/* UPDATED: Replaced Next.js <Image> with standard <img> tag */}
                <img 
                  src={photo} 
                  alt={`Gig photo ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        </section>

        {/* 7. YouTube Video (Optional) */}
        {/* {gig.youtubeUrl && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8">Live Video</h2>
            <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
              <iframe 
                src={gig.youtubeUrl}
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="border-0 w-full h-full"
              ></iframe>
            </div>
          </section>
        )} */}
      </div>
    </div>
  );
}