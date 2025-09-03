'use client';

import { useState, useMemo } from 'react';
import { type SanityDocument } from 'next-sanity';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface PastGigsClientProps {
  initialGigs: SanityDocument[];
  allYears: number[];
}

const GIGS_PER_PAGE = 10;

export default function PastGigsClient({
  initialGigs,
  allYears,
}: PastGigsClientProps) {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // This will filter and sort the gigs only when the dependencies change
  const filteredAndSortedGigs = useMemo(() => {
    let gigs = [...initialGigs];

    // Filter by year
    if (selectedYear !== 'all') {
      gigs = gigs.filter(
        (gig) => new Date(gig.date).getFullYear() === parseInt(selectedYear)
      );
    }

    // Sort by date
    gigs.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return gigs;
  }, [initialGigs, selectedYear, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedGigs.length / GIGS_PER_PAGE);
  const paginatedGigs = filteredAndSortedGigs.slice(
    (currentPage - 1) * GIGS_PER_PAGE,
    currentPage * GIGS_PER_PAGE
  );

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    setCurrentPage(1); // Reset to first page on sort change
  };

  const headerHeight = '3.5rem';

  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center uppercase tracking-wider mb-8">
          АРХІВ КОНЦЕРТІВ
        </h1>

        {/* Filter and Sort Controls */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-row justify-between items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
          <div className="flex items-center gap-2">
            <label
              htmlFor="year-select"
              className="font-semibold text-sm sm:text-base"
            >
              Рік:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={handleYearChange}
              className="bg-gray-800 border border-gray-700 rounded-md px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="all">Всі</option>
              {allYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            <ArrowUpDown size={16} />
            <span className="hidden sm:inline">
              {sortOrder === 'desc' ? 'Спочатку новіші' : 'Спочатку старіші'}
            </span>
          </button>
        </div>

        {/* Gigs List */}
        <div className="max-w-4xl mx-auto">
          {paginatedGigs.length > 0 ? (
            paginatedGigs.map((gig) => (
              <Link
                key={gig._id}
                href={`/gigs/archive/${gig.slug}`}
                className="flex items-center gap-4 sm:gap-6 p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-300"
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                  {gig.posterImage?.url ? (
                    <Image
                      src={gig.posterImage.url}
                      alt={`Poster for ${gig.venue}`}
                      fill
                      className="object-cover rounded-md"
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  {/* TEXTS FLIPPED HERE */}
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {gig.venue}, {gig.city}
                  </p>
                  <p className="text-base sm:text-lg text-gray-400">
                    {new Date(gig.date).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className="text-gray-400 hidden sm:inline ml-auto">
                  →
                </span>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400 py-16">
              Не знайдено концертів за вибраними критеріями.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="max-w-4xl mx-auto mt-8 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              <span>Назад</span>
            </button>
            <span className="font-semibold">
              Сторінка {currentPage} з {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Далі</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
