'use client';

import React, { useState, useEffect } from 'react';
import { X, Music, Loader2 } from 'lucide-react';
import { client } from '../../sanity/client'; // Adjust this path if your Sanity client is elsewhere
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';

// Define the types for our Sanity data
interface Track {
  _id: string;
  title: string;
  lyrics: PortableTextBlock[]; // Using the correct type for Portable Text blocks
}

interface Setlist {
  title: string;
  tracks: Track[];
}

export default function ProgramPage() {
  const [setlist, setlistData] = useState<Setlist | null>(null);
  const [selectedSong, setSelectedSong] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the latest setlist from Sanity
  useEffect(() => {
    const fetchSetlist = async () => {
      try {
        // This query fetches the most recently updated Setlist document
        // and expands the track references to get the title and lyrics
        const SETLIST_QUERY = `*[_type == "setlist"] | order(_updatedAt desc)[0]{
          title,
          tracks[]->{
            _id,
            title,
            lyrics
          }
        }`;
        const data = await client.fetch(SETLIST_QUERY);
        setlistData(data);
      } catch (error) {
        console.error('Failed to fetch setlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSetlist();
  }, []);

  // Prevent background scrolling when the lyrics modal is open
  useEffect(() => {
    if (selectedSong) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedSong]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-400 font-mono tracking-widest uppercase text-sm">
          Завантаження...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gray-700 font-sans pb-20">
      {/* Header */}
      <div className="pt-12 pb-8 px-4 text-center border-b border-gray-800">
        <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-2">
          Ексклюзивно для слухачів
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-widest text-white drop-shadow-lg">
          ПРОГРАМА КОНЦЕРТУ
        </h1>
        {setlist?.title && (
          <p className="text-gray-300 mt-2 font-mono uppercase tracking-widest">
            {setlist.title}
          </p>
        )}
        <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-md mx-auto">
          Натискайте на назву пісні, щоб підспівувати разом з нами.
        </p>
      </div>

      {/* Setlist */}
      <div className="container mx-auto px-4 mt-8 max-w-2xl">
        <ul className="space-y-4">
          {setlist?.tracks && setlist.tracks.length > 0 ? (
            setlist.tracks.map((song, index) => (
              <li key={song._id}>
                <button
                  onClick={() => setSelectedSong(song)}
                  className="w-full flex items-center justify-between p-5 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 rounded-xl transition-all duration-300 group text-left"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 font-mono text-lg font-bold group-hover:text-white transition-colors">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-lg sm:text-xl font-bold uppercase tracking-wide">
                      {song.title}
                    </span>
                  </div>
                  <Music className="text-gray-600 group-hover:text-white transition-colors w-5 h-5 flex-shrink-0" />
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              Сетлист ще не сформовано.
            </p>
          )}
        </ul>
      </div>

      {/* Footer Navigation */}
      <div className="mt-16 text-center px-4">
        <Link
          href="/"
          className="inline-block border border-gray-700 text-gray-400 px-6 py-3 rounded-full uppercase text-sm tracking-widest font-bold hover:bg-white hover:text-black hover:border-white transition-colors duration-300"
        >
          На головну
        </Link>
      </div>

      {/* Lyrics Modal Overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          selectedSong
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible translate-y-8'
        }`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800 bg-black/50">
          <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-widest text-white truncate pr-4">
            {selectedSong?.title}
          </h2>
          <button
            onClick={() => setSelectedSong(null)}
            className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors text-white flex-shrink-0"
            aria-label="Закрити тексти пісень"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content (Lyrics) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-2xl mx-auto pb-10">
            {selectedSong?.lyrics ? (
              <div className="prose prose-invert prose-lg mx-auto whitespace-pre-wrap font-sans leading-relaxed text-gray-300 text-center sm:text-left">
                <PortableText value={selectedSong.lyrics} />
              </div>
            ) : (
              <p className="text-center text-gray-500 italic mt-10">
                (Текст для цієї пісні відсутній)
              </p>
            )}
          </div>
        </div>

        {/* Subtle bottom fade for scroll indication */}
        <div className="h-12 bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 w-full pointer-events-none"></div>
      </div>
    </div>
  );
}
