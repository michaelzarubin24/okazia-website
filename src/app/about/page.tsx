import { type SanityDocument } from 'next-sanity';
import { client } from '../../sanity/client';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/image';

// CORRECTED: Query now fetches the full image object for urlFor
const MEMBERS_QUERY = `*[_type == "bandMember"]|order(order asc){
  _id,
  name,
  "slug": slug.current,
  "image": image // Fetch the full image object, not just the URL
}`;

export default async function AboutPage() {
  const bandMembers = await client.fetch<SanityDocument[]>(
    MEMBERS_QUERY,
    {},
    { next: { revalidate: 3600 } }
  );

  return (
    // Main page container
    <div>
      {/* ADDED: Title and Description Section */}
      <section className="bg-black text-center py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider">
            Команда
          </h1>
          <p className="text-lg text-gray-400 mt-4 leading-relaxed">
            OKAZIA – це більше, ніж просто музика. Це синергія чотирьох
            унікальних особистостей, кожна з яких привносить свою енергію та
            бачення у нашу творчість. Познайомтеся з тими, хто стоїть за її
            звуком.
          </p>
        </div>
      </section>

      {/* MODIFIED: Adjusted grid height for a better scrolling experience */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full">
        {bandMembers.map((member) => (
          <Link
            key={member._id}
            href={`/about/${member.slug}`}
            className="group relative h-[60vh] md:h-[80vh] w-full overflow-hidden"
          >
            {/* Optimized Next.js Image component for the background */}
            <Image
              // CORRECTED: Pass the full image object to urlFor
              src={urlFor(member.image).width(1200).quality(95).url()}
              alt={`Photo of ${member.name}`}
              fill
              className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 100vw"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content container for the name */}
            <div className="absolute inset-0 flex items-end justify-center p-8 transition-all duration-500 ease-in-out">
              <h3 className="text-white text-3xl font-bold uppercase tracking-widest transform transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-4">
                {member.name}
              </h3>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
