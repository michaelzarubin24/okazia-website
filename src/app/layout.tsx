import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header'; // Import the new Header component
import { SocialIcons } from '@/components/SocialIcons'; // Import the new SocialIcons component
export const metadata: Metadata = {
  title: {
    template: '%s | OKAZIA', // Appends "| OKAZIA" to all page titles
    default: 'OKAZIA - Офіційний сайт', // Default title for homepage
  },
  description:
    'Офіційний сайт українського інді-рок гурту з Харкова. Дізнайся першим про нові релізи та концерти!',
  // Metadata for social media sharing (Open Graph)
  keywords: [
    'OKAZIA',
    'Оказія',
    'Okazia band',
    'Okazia music',
    'український рок-гурт',
    'рок-гурт з Харкова',
    'українська музика',
    'сучасна українська музика',
    'indie rock Ukraine',
    'нова українська музика',
  ],

  openGraph: {
    title: 'OKAZIA - Офіційний сайт',
    description: 'Офіційний сайт українського інді-рок гурту з Харкова.',
    url: 'https://www.okazia.com.ua',
    siteName: 'OKAZIA',
    images: [
      {
        url: 'https://www.okazia.com.ua/images/photo-all-2.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
  // Metadata for Twitter sharing
  twitter: {
    card: 'summary_large_image',
    title: 'OKAZIA - Офіційний сайт',
    description: 'Офіційний сайт українського інді-рок гурту з Харкова.',
    images: ['https://www.okazia.com.ua/og-image.png'], // URL to your social sharing image
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="font-sans text-white bg-black">
        <div className="fixed inset-0 z-[-1] opacity-30" />
        <Header />
        <main className="pb-24">{children}</main>
        <SocialIcons />
      </body>
    </html>
  );
}
