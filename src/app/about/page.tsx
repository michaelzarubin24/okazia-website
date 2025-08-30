// FILE: src/app/about/page.tsx
// This page now dynamically displays all band members from Sanity and is mobile-friendly.

import { type SanityDocument } from 'next-sanity';
import { client } from '../../sanity/client';
import Link from 'next/link';

const MEMBERS_QUERY = `*[_type == "bandMember"]|order(order asc){
  _id,
  name,
  "slug": slug.current,
  "imageUrl": image.asset->url
}`;

export default async function AboutPage() {
  const bandMembers = await client.fetch<SanityDocument[]>(MEMBERS_QUERY);

  // The height of your header on desktop (4rem = 16 in Tailwind's spacing scale)
  const headerHeightDesktop = '5rem';
  // Each row on desktop should take up half the viewport height minus half the header height
  const desktopRowHeight = `calc(100vh - (${headerHeightDesktop} / 2))`;

  return (
    // On medium screens and up, we add padding-top to push the content below the header.
    // On mobile, there is no padding, so the content goes under the header.
    <div className="md:pt-[4rem] text-center">
      {/* This is now a single grid container.
        - On mobile (default): It's a single column (grid-cols-1).
        - On medium screens and up (md): It becomes a two-column grid (md:grid-cols-2).
      */}
      {/* <h2 className="text-3xl sm:text-4xl font-bold mt-6 mb-12">КОМАНДА</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {bandMembers.map((member) => (
          <Link
            key={member._id}
            href={`/about/${member.slug}`}
            // On mobile, each item is full screen height.
            // On desktop, it uses the calculated height to fit perfectly.
            className="group relative w-full h-screen md:h-auto overflow-hidden bg-black"
            style={{ height: '100vh' }}
          >
            <div
              style={{ backgroundImage: `url(${member.imageUrl})` }}
              className="h-full w-full bg-cover bg-no-repeat bg-center transition-all duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex items-center justify-center">
              <h3 className="text-white text-3xl font-bold uppercase tracking-widest">
                {member.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
