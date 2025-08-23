export default function FutureGigsPage() {
  // Placeholder data for your upcoming gigs.
  // Note that 'ticketsUrl' is now optional.
  const futureGigs = [
    {
      date: "September 12, 2025",
      venue: "The Garrison",
      city: "Toronto, ON",
      ticketsUrl: "#",
      slug: "garrison-toronto-2025",
    },
    {
      date: "October 5, 2025",
      venue: "Bar Le Ritz PDB",
      city: "Montreal, QC",
      ticketsUrl: "#",
      slug: "bar-le-ritz-montreal-2025",
    },
    {
      date: "November 21, 2025",
      venue: "The Biltmore Cabaret",
      city: "Vancouver, BC",
      ticketsUrl: "#",
      slug: "biltmore-vancouver-2025",
    },
    {
      date: "December 15, 2025",
      venue: "Local Art Space",
      city: "Kyiv, Ukraine",
      // This gig has no ticketsUrl, so it will show a 'Details' button.
      slug: "art-space-kyiv-2025",
    },
  ];

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center uppercase tracking-wider mb-16">
          Майбутні концерти
        </h1>

        {futureGigs.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {futureGigs.map((gig) => (
              <div key={gig.date + gig.venue} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-800/50 rounded-lg">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <p className="text-xl font-bold">{gig.date}</p>
                  <p className="text-gray-400">{gig.venue}, {gig.city}</p>
                </div>
                {/* Conditionally render the button based on whether a ticketsUrl exists */}
                {gig.ticketsUrl ? (
                  <a 
                    href={gig.ticketsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Tickets
                  </a>
                ) : (
                  <a 
                    href={`/gigs/archive/${gig.slug}`} // This can link to a future details page
                    className="w-full sm:w-auto text-center bg-gray-600 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-500 transition-colors"
                  >
                    Details
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg">
            No upcoming shows scheduled. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}