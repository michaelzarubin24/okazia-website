// FILE: src/app/about/page.tsx
// This page now dynamically displays all band members from Sanity in full-screen rows.

import { type SanityDocument } from "next-sanity";
import { client } from '../../sanity/client'; 

const MEMBERS_QUERY = `*[_type == "bandMember"]|order(order asc){
  _id,
  name,
  "slug": slug.current,
  "imageUrl": image.asset->url
}`;

export default async function AboutPage() {
  const bandMembers = await client.fetch<SanityDocument[]>(MEMBERS_QUERY);
  
  // Helper function to group members into pairs for each row
  const memberPairs = [];
  for (let i = 0; i < bandMembers.length; i += 2) {
    memberPairs.push(bandMembers.slice(i, i + 2));
  }

  return (
    // UPDATED: Removed the paddingTop style from this container.
    <div>
      {/* We now map over the pairs to create a section for each row */}
      {memberPairs.map((pair, index) => (
        <section 
          key={index} 
          className="flex" 
          // UPDATED: Each section now takes up the full 100vh to go under the header.
          style={{ height: '100vh' }}
        >
          {pair.map((member) => (
            <a 
              key={member._id} 
              href={`/about/${member.slug}`} 
              className="group relative w-1/2 overflow-hidden bg-black border border-black"
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
            </a>
          ))}
          {/* This handles the case where there's an odd number of members */}
          {pair.length === 1 && <div className="w-1/2 bg-black border border-black" />}
        </section>
      ))}
    </div>
  );
}