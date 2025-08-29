// FILE: src/app/about/[memberName]/page.tsx
// This template now correctly renders rich text from Sanity.
import { type SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { client } from '../../../sanity/client';
import { urlFor } from '../../../sanity/image';

const MEMBER_QUERY = `*[_type == "bandMember" && slug.current == $slug][0]{
  _id,
  name,
  role,
  image,
  bio
}`;

export default async function MemberPage({ params }: { params: Promise<{ memberName: string }> }) {
  const resolvedParams = await params;
  const member = await client.fetch<SanityDocument>(MEMBER_QUERY, { slug: resolvedParams.memberName });

  if (!member) {
    return <div className="pt-24 text-center">Member not found.</div>;
  }

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="w-full aspect-square">
            <img 
              src={urlFor(member.image).width(800).height(800).url()} 
              alt={`Photo of ${member.name}`}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-wider">{member.name}</h1>
            <p className="text-xl text-gray-400 mt-2 mb-6">{member.role}</p>
            <div className="prose prose-invert lg:prose-xl text-gray-300 leading-relaxed">
              <PortableText value={member.bio} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}