'use client';

import React, { useState, useEffect, useRef } from 'react';
import { client } from '../../sanity/client'; // Adjust this path if needed
import html2canvas from 'html2canvas';
import { Loader2, Download, Share2, GripHorizontal } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Types ---
interface Track {
  _id: string;
  title: string;
  artworkUrl: string;
}

const TIERS = [
  { id: 'S', color: 'bg-red-600', label: 'ЛЕГЕНДА' },
  { id: 'A', color: 'bg-orange-500', label: 'СУПЕР' },
  { id: 'B', color: 'bg-yellow-500', label: 'КЛАСНО' },
  { id: 'C', color: 'bg-green-600', label: 'НОРМ' },
];

// --- UI Components ---

// The visual component for a track
const TrackItemUI = ({
  track,
  isDragging,
}: {
  track: Track;
  isDragging?: boolean;
}) => (
  <div
    className={`w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 overflow-hidden relative flex-shrink-0 cursor-grab active:cursor-grabbing border border-gray-700 select-none touch-none ${
      isDragging
        ? 'opacity-50 ring-4 ring-white z-50 scale-105 shadow-2xl'
        : 'hover:scale-105 transition-transform duration-200'
    }`}
  >
    {track.artworkUrl && (
      <img
        src={track.artworkUrl}
        alt={track.title}
        crossOrigin="anonymous"
        decoding="async"
        className="w-full h-full object-cover pointer-events-none"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-center pb-1 px-1 pointer-events-none">
      <span className="text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center leading-tight drop-shadow-md">
        {track.title}
      </span>
    </div>
  </div>
);

// The wrapper that makes a track draggable/sortable
const SortableTrack = ({ track }: { track: Track }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: track._id,
    data: { type: 'Track', track },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TrackItemUI track={track} isDragging={isDragging} />
    </div>
  );
};

// The wrapper that makes a tier or pool a droppable zone
const DroppableZone = ({
  id,
  items,
  className,
  children,
}: {
  id: string;
  items: Track[];
  className?: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext
      id={id}
      items={items.map((i) => i._id)}
      strategy={rectSortingStrategy}
    >
      <div ref={setNodeRef} className={`w-full min-h-[100px] ${className}`}>
        {children}
      </div>
    </SortableContext>
  );
};

// --- Main Page ---
export default function TierListPage() {
  const [tierState, setTierState] = useState<Record<string, Track[]>>({
    S: [],
    A: [],
    B: [],
    C: [],
    UNRANKED: [],
  });
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tierListRef = useRef<HTMLDivElement>(null);

  // Configure sensors for touch and mouse
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch Tracks from Sanity with optimized image loading
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // Appending image API parameters to fetch small, perfectly cropped thumbnails
        const TRACKS_QUERY = `*[_type == "track" && count(*[_type == "musicRelease" && references(^._id)]) > 0]{
          _id,
          title,
          "artworkUrl": *[_type == "musicRelease" && references(^._id)][0].artwork.asset->url + "?w=200&h=200&fit=crop&fm=jpg&q=80"
        }`;
        const data = await client.fetch(TRACKS_QUERY);
        setTierState((prev) => ({ ...prev, UNRANKED: data }));
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTracks();
  }, []);

  // --- Drag and Drop Handlers ---

  const findContainer = (id: string | null) => {
    if (!id) return null;
    if (id in tierState) return id;
    return Object.keys(tierState).find((key) =>
      tierState[key].find((item) => item._id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const containerId = findContainer(active.id as string);
    if (containerId) {
      const track = tierState[containerId].find((t) => t._id === active.id);
      setActiveTrack(track || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(overId as string);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setTierState((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((t) => t._id === active.id);
      const overIndex = overItems.findIndex((t) => t._id === overId);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over && overIndex === overItems.length - 1 && event.delta.y > 0;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: prev[activeContainer].filter(
          (item) => item._id !== active.id
        ),
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          activeItems[activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over?.id as string);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      setActiveTrack(null);
      return;
    }

    const activeIndex = tierState[activeContainer].findIndex(
      (t) => t._id === active.id
    );
    const overIndex = tierState[overContainer].findIndex(
      (t) => t._id === over?.id
    );

    if (activeIndex !== overIndex) {
      setTierState((prev) => ({
        ...prev,
        [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
      }));
    }

    setActiveTrack(null);
  };

  // --- Export Logic ---
  const handleExport = async () => {
    if (!tierListRef.current) return;
    try {
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
      });
      const image = canvas.toDataURL('image/png');
      if (navigator.share) {
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], 'okazia-tierlist.png', {
          type: 'image/png',
        });
        await navigator.share({
          title: 'Мій топ треків OKAZIA',
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'okazia-tierlist.png';
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold uppercase tracking-widest mb-4">
            Рейтинг Треків
          </h1>
          <p className="text-gray-400">
            Розподіліть треки по категоріях. Перетягуйте мишкою або пальцем.
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Screenshot Area */}
          <div
            ref={tierListRef}
            className="bg-black p-4 sm:p-8 border border-gray-800 rounded-xl mb-8"
          >
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className="flex min-h-[100px] border-b border-gray-800 last:border-0 bg-gray-900/50 mb-2"
              >
                <div
                  className={`w-24 sm:w-32 flex-shrink-0 flex items-center justify-center text-black font-black text-xl sm:text-2xl select-none ${tier.color}`}
                >
                  {tier.label}
                </div>

                {/* Droppable Tier Row */}
                <DroppableZone
                  id={tier.id}
                  items={tierState[tier.id]}
                  className="flex-grow flex flex-wrap gap-2 p-2"
                >
                  {tierState[tier.id].map((track) => (
                    <SortableTrack key={track._id} track={track} />
                  ))}
                </DroppableZone>
              </div>
            ))}

            <div className="mt-4 text-right text-gray-500 font-mono text-sm uppercase tracking-widest">
              okazia.com
            </div>
          </div>

          <div className="flex justify-center mb-12">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-full"
            >
              <Download size={20} className="hidden sm:block" />
              <Share2 size={20} className="sm:hidden" />
              <span>Зберегти / Поділитися</span>
            </button>
          </div>

          {/* Droppable Unranked Pool */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6 text-center text-gray-400 flex items-center justify-center gap-2">
              <GripHorizontal size={20} />
              Нерозподілені треки
            </h2>
            <DroppableZone
              id="UNRANKED"
              items={tierState.UNRANKED}
              className="flex flex-wrap justify-center gap-2 sm:gap-4 min-h-[150px] p-4 border border-dashed border-gray-800 rounded-lg"
            >
              {tierState.UNRANKED.map((track) => (
                <SortableTrack key={track._id} track={track} />
              ))}
            </DroppableZone>
          </div>

          {/* Ghost Overlay while dragging */}
          <DragOverlay>
            {activeTrack ? (
              <TrackItemUI track={activeTrack} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
