'use client'; // This enables interactivity for the dropdown menu.
import "./globals.css";
import { useState, useEffect } from 'react';
import { Send, ChevronDown, ChevronUp, Menu, X } from 'lucide-react'; 
import Link from 'next/link';

type NavLink = {
    name: string;
    href: string;
    dropdown?: undefined;
} | {
    name: string;
    href?: undefined;
    dropdown: { name: string; href: string }[];
};

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  // Effect to track scroll position for the header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const navLinks: NavLink[] = [
    { name: 'ГОЛОВНА', href: '/'},
    {
      name: 'ПРО НАС',
      dropdown: [
        { name: 'Команда', href: '/about' },
        { name: 'Біографія', href: '/bio' },
      ]
    },
    { name: 'МУЗИКА', href: '/music' },
    { name: 'ВІДЕО', href: '/videos' },
    { name: 'НОВИНИ', href: '/news' },
    { name: 'МЕРЧ', href: '/merch' },
    {
      name: 'КОНЦЕРТИ',
      dropdown: [
        { name: 'Майбутні', href: '/gigs/future' },
        { name: 'Архів', href: '/gigs/past' },
      ]
    },
    { name: 'КОНТАКТИ', href: '/contacts' },
  ];

  const showFullHeader = !isScrolled || isHeaderHovered;

  const toggleMobileDropdown = (name: string) => {
    setOpenMobileDropdown(openMobileDropdown === name ? null : name);
  };

  return (
    <>
      <header 
        className="fixed top-0 w-full z-20 p-2 sm:p-3"
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
       <div className="w-full h-12 flex justify-center items-center">
          {/* Desktop Arrow Icon (visible when header is hidden) */}
          <div className={`absolute transition-opacity duration-300 hidden md:block ${showFullHeader ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center justify-center w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full">
                <ChevronDown size={32} className="text-white" />
            </div>
          </div>
          
          {/* Desktop Full Header Content (visible when header is shown) */}
          <div className={`w-full justify-between items-center px-2 sm:px-4 transition-opacity duration-300 hidden md:flex ${showFullHeader ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex-1">
                {/* <div className="bg-black/40 backdrop-blur-sm rounded-full p-2 inline-block">
                  <a href="/">
                    <img
                      src="/okazia-white.png"
                      alt="OKAZIA Logo"
                      style={{ width: '150px', height: '36px' }} 
                    />
                  </a>
                </div> */}
              </div>
              <div className="flex justify-center">
                  <nav className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-full p-2">
                    {navLinks.map((link) => (
                      link.dropdown ? (
                        <div 
                          key={link.name} 
                          className="relative"
                          onMouseEnter={() => setOpenDropdown(link.name)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <button 
                            onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                            className="text-white text-base font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors duration-300 flex items-center"
                          >
                            {link.name}
                            <svg className={`w-4 h-4 ml-1 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </button>
                          {openDropdown === link.name && (
                            <div className="absolute top-full pt-2 w-48">
                              <div className="bg-black/80 backdrop-blur-sm rounded-md shadow-lg">
                                {link.dropdown.map((item) => (
                                  <Link key={item.name} href={item.href} className="block px-4 py-2 text-white hover:bg-gray-700">{item.name}</Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link key={link.name} href={link.href} className="text-white text-base font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors duration-300">{link.name}</Link>
                      )
                    ))}
                  </nav>
              </div>
              <div className="flex-1 flex justify-end">
                  {/* <div className="hidden md:flex items-center space-x-3 bg-black/40 backdrop-blur-sm rounded-full p-2">
                      <button className="text-white font-bold text-base px-3 py-1 rounded-full bg-white/10">EN</button>
                      <span className="text-gray-500/50">|</span>
                      <button className="text-gray-400 hover:text-white font-bold text-base px-3 py-1 rounded-full transition-colors">UA</button>
                  </div> */}
              </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden w-full flex justify-end items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-white text-2xl p-2 rounded-full bg-black/40 backdrop-blur-sm">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-black/90 backdrop-blur-lg z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
            <X size={32} />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-4">
          {navLinks.map((link) => (
            link.dropdown ? (
              <div key={link.name} className="text-center">
                <button 
                  onClick={() => toggleMobileDropdown(link.name)}
                  className="text-white text-2xl font-bold uppercase flex items-center"
                >
                  {link.name}
                  <ChevronDown className={`w-6 h-6 ml-2 transition-transform ${openMobileDropdown === link.name ? 'rotate-180' : ''}`} />
                </button>
                {openMobileDropdown === link.name && (
                  <div className="flex flex-col items-center space-y-2 mt-2">
                    {link.dropdown.map(item => (
                      <Link key={item.name} href={item.href} className="text-gray-400 text-xl hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>{item.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.name} href={link.href} className="text-white text-2xl font-bold uppercase hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>{link.name}</Link>
            )
          ))}
        </nav>
      </div>
    </>
  );
};

// --- SOCIAL ICONS (Client Component) ---
const SocialIcons = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isSocialsHovered, setIsSocialsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      setIsAtBottom(isBottom);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showSocials = isAtBottom || isSocialsHovered;

  const InstagramIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> );
  const YoutubeIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> );
  const ThreadsIcon = () => ( <svg aria-label="Threads" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"><path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path></svg> );
  const TikTokIcon = () => ( <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/></svg> );

  const socialLinks = [ { name: "Instagram", href: "https://www.instagram.com/okazia.project/?igshid=YmMyMTA2M2Y%3D", icon: <InstagramIcon /> }, { name: "Telegram", href: "https://t.me/okaziaproject", icon: <Send size={24} /> }, { name: "TikTok", href: "https://www.tiktok.com/@okazia.project?_t=8Vz9Cn8QzjS&_r=1", icon: <TikTokIcon /> }, { name: "YouTube", href: "https://youtube.com/@okazia?si=m18JtVu3-AdMDiuq", icon: <YoutubeIcon /> }, { name: "Threads", href: "https://www.threads.com/@okazia.project", icon: <ThreadsIcon /> }, ];

  return ( <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 h-16 flex items-center justify-center" onMouseEnter={() => setIsSocialsHovered(true)} onMouseLeave={() => setIsSocialsHovered(false)} > <div className={`absolute transition-opacity duration-300 ${showSocials ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}> <div className="flex items-center justify-center w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full"> <ChevronUp size={32} className="text-white" /> </div> </div> <div className={`transition-opacity duration-300 ${showSocials ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}> <div className="flex items-center space-x-4 p-2 bg-black/30 backdrop-blur-sm rounded-full"> {socialLinks.map((social) => ( <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit our ${social.name}`} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300" > {social.icon} </a> ))} </div> </div> </div> );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body 
        className="font-sans text-white bg-black"
      >
        <div 
          className="fixed inset-0 z-[-1] opacity-30"
        />
        <Header />
        <main className="pb-24">{children}</main>
        <SocialIcons />
      </body>
    </html>
  );
}
