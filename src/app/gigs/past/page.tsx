export default function PastGigsPage() {
  // Placeholder data for your past gigs.
  const pastGigs = [
    {
      date: "June 6, 2025",
      venue: "ARTDACHA",
      city: "Kyiv, Ukraine",
      slug: "artdacha-2025-06-06",
    },
  ];

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center uppercase tracking-wider mb-16">
          Gig Archive
        </h1>

        <div className="max-w-4xl mx-auto border-t border-gray-700">
          {pastGigs.map((gig) => (
            <a 
              key={gig.slug}
              href={`/gigs/archive/${gig.slug}`} // This will link to a specific gig page later
              className="flex justify-between items-center p-6 border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
            >
              <div>
                <p className="text-xl font-bold">{gig.date}</p>
                <p className="text-gray-400">{gig.venue}, {gig.city}</p>
              </div>
              <span className="text-gray-400 hidden sm:inline">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}