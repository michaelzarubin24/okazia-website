export default function MusicPage() {
  // An array for your music releases (singles, EPs, albums).
  const musicReleases = [
    {
      title: "НЕМОВ ТІНЬ",
      imageUrl: "./images/music-covers/shadow.png",
      slug: "shadow",
    },
    {
      title: "НЕ ЧЕКАЮ",
      imageUrl: "./images/music-covers/hourglass.png",
      slug: "hourglass",
    },
    {
      title: "ВІДЬМА",
      imageUrl: "./images/music-covers/witch.png",
      slug: "witch",
    },
    {
      title: "ЦИКЛ",
      imageUrl: "./images/music-covers/cycle.png",
      slug: "cycle",
    },
    {
      title: "НЕ СПИНЯЮСЬ",
      imageUrl: "./images/music-covers/relentless.png",
      slug: "relentless",
    },
    {
      title: "МІЖ СВІТАМИ I",
      imageUrl: "./images/music-covers/mavka.png",
      slug: "mavka",
    },
  ];

  // The header height is approx 56px or 3.5rem.
  const headerHeight = '3.5rem'; 

  return (
    // This container is pushed down to avoid being hidden by the fixed header.
    <div style={{ paddingTop: headerHeight }}>
      {/* This div holds the stack of "book spines" */}
      <div className="flex flex-col">
        {musicReleases.map((release) => (
          <a
            key={release.slug}
            href={`/music/${release.slug}`} // This will link to a specific music page later
            className="group relative block w-full h-48 overflow-hidden" // h-48 gives each spine a fixed height
          >
            {/* The background image with the hover effect */}
            <div
              style={{ backgroundImage: `url(${release.imageUrl})` }}
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            {/* The dark overlay and centered title */}
            <div className="relative z-10 h-full flex items-center justify-center bg-black/50">
              <h2 className="text-white text-3xl md:text-4xl font-extrabold uppercase tracking-widest">
                {release.title}
              </h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
