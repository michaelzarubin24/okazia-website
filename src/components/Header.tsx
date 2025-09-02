'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Menu, Send, X } from 'lucide-react';
import Link from 'next/link';
// import Image from 'next/image';

type NavLink =
  | {
      name: string;
      href: string;
      dropdown?: undefined;
    }
  | {
      name: string;
      href?: undefined;
      dropdown: { name: string; href: string }[];
    };

export const Header = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );

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
    { name: 'ГОЛОВНА', href: '/' },
    {
      name: 'ПРО НАС',
      dropdown: [
        { name: 'КОМАНДА', href: '/about' },
        { name: 'БІОГРАФІЯ', href: '/bio' },
      ],
    },
    { name: 'МУЗИКА', href: '/music' },
    { name: 'ВІДЕО', href: '/videos' },
    { name: 'НОВИНИ', href: '/news' },
    { name: 'МЕРЧ', href: '/merch' },
    {
      name: 'КОНЦЕРТИ',
      dropdown: [
        { name: 'МАЙБУТНІ', href: '/gigs/future' },
        { name: 'АРХІВ', href: '/gigs/past' },
      ],
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
          <div
            className={`absolute transition-opacity duration-300 hidden md:block ${showFullHeader ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full">
              <ChevronDown size={32} className="text-white" />
            </div>
          </div>

          {/* Desktop Full Header Content (visible when header is shown) */}
          <div
            className={`w-full justify-between items-center px-2 sm:px-4 transition-opacity duration-300 hidden md:flex ${showFullHeader ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
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
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(link.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === link.name ? null : link.name
                          )
                        }
                        className="text-white text-base font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors duration-300 flex items-center"
                      >
                        {link.name}
                        <svg
                          className={`w-4 h-4 ml-1 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      {openDropdown === link.name && (
                        <div className="absolute top-full pt-2 w-48">
                          <div className="bg-black/80 backdrop-blur-sm rounded-md shadow-lg">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="block px-4 py-2 text-white hover:bg-gray-700"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-white text-base font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  )
                )}
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
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white text-2xl p-2 rounded-full bg-black/40 backdrop-blur-sm"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/90 backdrop-blur-lg z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white"
          >
            <X size={32} />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-4">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.name} className="text-center">
                <button
                  onClick={() => toggleMobileDropdown(link.name)}
                  className="text-white text-2xl font-bold uppercase flex items-center"
                >
                  {link.name}
                  <ChevronDown
                    className={`w-6 h-6 ml-2 transition-transform ${openMobileDropdown === link.name ? 'rotate-180' : ''}`}
                  />
                </button>
                {openMobileDropdown === link.name && (
                  <div className="flex flex-col items-center space-y-2 mt-2">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-gray-400 text-xl hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-white text-2xl font-bold uppercase hover:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );
};
