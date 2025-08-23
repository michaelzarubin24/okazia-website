// FILE: src/app/about/page.tsx
// This file controls the content for the "About Us" page.

export default function AboutPage() {
  // An array for your band members. 
  // IMPORTANT: For the hover effect to work, you need to provide color photos.
  const bandMembers = [
    {
      name: "СНІШКА",
      slug: "snishka",
      imageUrl: "/images/members/snishka.png",
    },
    {
      name: "МИХАЙЛО",
      slug: "michael",
      imageUrl: "/images/members/misha.png",
    },
    {
      name: "АЛІНА",
      slug: "alina",
      imageUrl: "/images/members/alina.png",
    },
    {
      name: "МАРІ",
      slug: "mary",
      imageUrl: "/images/members/mary.png",
    },
  ];

return (
    <div>
      {/* First Screen / Row */}
      <section className="flex" style={{ height: '100vh' }}>
        {bandMembers.slice(0, 2).map((member) => (
          // Each member is now a clickable link
          <a key={member.name} href={`/about/${member.slug}`} className="group relative w-1/2 overflow-hidden bg-black border border-black">
            <div
              style={{ backgroundImage: `url(${member.imageUrl})` }}
              // REMOVED: grayscale classes
              className="h-full w-full bg-cover bg-no-repeat bg-center transition-all duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex items-center justify-center">
              <h3 className="text-white text-3xl font-bold uppercase tracking-widest">
                {member.name}
              </h3>
            </div>
          </a>
        ))}
      </section>

      {/* Second Screen / Row */}
      <section className="flex" style={{ height: '100vh' }}>
        {bandMembers.slice(2, 4).map((member) => (
          // Each member is now a clickable link
          <a key={member.name} href={`/about/${member.slug}`} className="group relative w-1/2 overflow-hidden bg-black border border-black">
            <div
              style={{ backgroundImage: `url(${member.imageUrl})` }}
              // REMOVED: grayscale classes
              className="h-full w-full bg-cover bg-no-repeat bg-center transition-all duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex items-center justify-center">
              <h3 className="text-white text-3xl font-bold uppercase tracking-widest">
                {member.name}
              </h3>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}