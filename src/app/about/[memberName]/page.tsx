// FILE: src/app/about/[memberName]/page.tsx

// This template now correctly renders rich text from Sanity and is mobile-friendly.
import { type SanityDocument } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import { client } from '../../../sanity/client';
import { urlFor } from '../../../sanity/image';

const MEMBER_QUERY = `*[_type == "bandMember" && slug.current == $slug][0]{
  _id,
  name,
  role,
  image,
  bio
}`;

export default async function MemberPage({
  params,
}: {
  params: Promise<{ memberName: string }>;
}) {
  const resolvedParams = await params;
  const member = await client.fetch<SanityDocument>(
    MEMBER_QUERY,
    { slug: resolvedParams.memberName },
    { next: { revalidate: 3600 } }
  );

  if (!member) {
    return <div className="pt-24 text-center">Member not found.</div>;
  }

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* The grid is 1 column on mobile, 2 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Member Image */}
          <div className="w-full max-w-md mx-auto md:max-w-none">
            <div className="aspect-square">
              <img
                src={urlFor(member.image).width(800).height(800).url()}
                alt={`Photo of ${member.name}`}
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Member Info */}
          <div className="text-center md:text-left">
            {/* Responsive font sizes for the name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-wider">
              {member.name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mt-2 mb-6">
              {member.role}
            </p>
            {/* The prose classes handle responsive typography for the bio */}
            <div className="prose prose-invert md:prose-lg lg:prose-xl text-gray-300 leading-relaxed max-w-none">
              <PortableText value={member.bio} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
