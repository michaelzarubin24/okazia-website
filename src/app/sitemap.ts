// FILE: app/sitemap.ts

import { MetadataRoute } from 'next';
import { client } from '../sanity/client'; // Adjust the import path to your sanity client
import { SanityDocument } from 'next-sanity';

// Define a type for the documents we'll fetch from Sanity
interface SanitySlugDocument extends SanityDocument {
  slug: {
    current: string;
  };
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // IMPORTANT: Replace this with your actual website's domain
  const baseUrl = 'https://okazia.com.ua';

  // 1. Add your static pages
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/bio`, lastModified: new Date() },
    { url: `${baseUrl}/music`, lastModified: new Date() },
    { url: `${baseUrl}/videos`, lastModified: new Date() },
    { url: `${baseUrl}/news`, lastModified: new Date() },
    { url: `${baseUrl}/merch`, lastModified: new Date() },
    { url: `${baseUrl}/gigs/future`, lastModified: new Date() },
    { url: `${baseUrl}/gigs/past`, lastModified: new Date() },
    { url: `${baseUrl}/contacts`, lastModified: new Date() },
  ];
  
  // 2. Fetch and add your dynamic pages from Sanity (e.g., News Posts)
  const newsPosts = await client.fetch<SanitySlugDocument[]>(`
    *[_type == "post" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }
  `);

  const postRoutes = newsPosts.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: new Date(post._updatedAt),
  }));

  // YOU CAN REPEAT THIS PATTERN FOR OTHER DYNAMIC CONTENT
  // For example, for individual band members:
  const bandMembers = await client.fetch<SanitySlugDocument[]>(`
    *[_type == "bandMember" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }
  `);
  
  const memberRoutes = bandMembers.map((member) => ({
    url: `${baseUrl}/about/${member.slug}`,
    lastModified: new Date(member._updatedAt),
  }));

    // ADDED: Individual Tracks
  const tracks = await client.fetch<SanitySlugDocument[]>(`
    *[_type == "track" && defined(slug.current)]{"slug": slug.current, _updatedAt}
  `);
  const trackRoutes = tracks.map((track) => ({
    url: `${baseUrl}/music/track/${track.slug}`,
    lastModified: new Date(track._updatedAt),
  }));

  // ADDED: Individual Gigs for the Archive
  const gigs = await client.fetch<SanitySlugDocument[]>(`
    *[_type == "gig" && defined(slug.current)]{"slug": slug.current, _updatedAt}
  `);
  const gigRoutes = gigs.map((gig) => ({
    url: `${baseUrl}/gigs/archive/${gig.slug}`,
    lastModified: new Date(gig._updatedAt),
  }));

  // 3. Combine all routes into a single sitemap
  return [
    ...staticRoutes,
    ...postRoutes,
    ...memberRoutes,
    ...trackRoutes,
    ...gigRoutes,
    // ...add other dynamic routes here (e.g., for gigs, music releases)
  ];
}