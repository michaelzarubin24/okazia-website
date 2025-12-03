import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/Header';
import { SocialIcons } from '@/components/SocialIcons';

export const metadata: Metadata = {
  title: {
    template: '%s | OKAZIA',
    default: 'OKAZIA - Офіційний сайт',
  },
  description:
    'Офіційний сайт українського інді-рок гурту з Харкова. Дізнайся першим про нові релізи та концерти!',
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
  twitter: {
    card: 'summary_large_image',
    title: 'OKAZIA - Офіційний сайт',
    description: 'Офіційний сайт українського інді-рок гурту з Харкова.',
    images: ['https://www.okazia.com.ua/images/photo-all-2.png'],
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
        {/* Google Analytics 4 Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZPNRRRVK1X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-ZPNRRRVK1X');
          `}
        </Script>

        <div className="fixed inset-0 z-[-1] opacity-30" />
        <Header />
        <main className="pb-24">{children}</main>
        <SocialIcons />
      </body>
    </html>
  );
}
