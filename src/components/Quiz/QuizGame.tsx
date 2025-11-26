'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  ArrowRight,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import html2canvas from 'html2canvas';

// --- TYPES ---
type Answer = {
  answerText: string;
  pointsTo: string;
};

type Question = {
  questionText: string;
  answers: Answer[];
};

type ResultCharacter = {
  resultId: string;
  characterName: string;
  description: string;
  imageUrl?: string;
  ringtoneUrl?: string;
};

type QuizProps = {
  data: {
    title: string;
    results: ResultCharacter[];
    questions: Question[];
  };
};

export default function QuizGame({ data }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Track user answers as an array of IDs (e.g. ['A', 'B', 'A', ...])
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    Array(data.questions.length).fill(null)
  );

  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState<ResultCharacter | null>(null);

  // UI States
  const [isSharing, setIsSharing] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  // Audio States
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- AUDIO EFFECT ---
  useEffect(() => {
    // When a winner is decided and they have a ringtone
    if (showResult && winner?.ringtoneUrl) {
      const audio = new Audio(winner.ringtoneUrl);
      audio.volume = 0.5; // 50% volume
      audioRef.current = audio;

      // Try to auto-play (browser might block if no interaction occurred)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Auto-play prevented by browser:', error);
        });
      }

      // Cleanup: Stop sound if user leaves
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [showResult, winner]);

  // --- AUDIO TOGGLE ---
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  // --- QUIZ NAVIGATION LOGIC ---
  const handleAnswerSelect = (pointsTo: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = pointsTo;
    setUserAnswers(newAnswers);

    // Optional: Auto-advance after small delay
    // setTimeout(() => handleNextStep(newAnswers), 300);
    handleNextStep(newAnswers);
  };

  const handleNextStep = (currentAnswersState = userAnswers) => {
    if (currentQuestionIndex === data.questions.length - 1) {
      calculateWinner(currentAnswersState);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateWinner = (finalAnswers: (string | null)[]) => {
    // 1. Tally scores
    const finalScores: Record<string, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
    };
    finalAnswers.forEach((charId) => {
      if (charId && finalScores[charId] !== undefined) finalScores[charId]++;
    });

    // 2. Find highest score
    const winningKey = Object.keys(finalScores).reduce((a, b) =>
      finalScores[a] > finalScores[b] ? a : b
    );

    // 3. Get result object
    const resultData = data.results.find((r) => r.resultId === winningKey);
    if (resultData) {
      setWinner(resultData);
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setUserAnswers(Array(data.questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setWinner(null);
    setIsMuted(false);
  };

  // --- SHARE LOGIC (html2canvas) ---
  const handleShare = async () => {
    if (!resultCardRef.current) return;
    setIsSharing(true);
    try {
      const canvas = await html2canvas(resultCardRef.current, {
        useCORS: true, // Crucial for Sanity images
        backgroundColor: '#111827',
        scale: 2, // Retine quality
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], 'okazia-result.png', {
          type: 'image/png',
        });

        // Mobile Native Share
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              files: [file],
              title: 'Мій результат OKAZIA',
              text: `Я - ${winner?.characterName}! Пройди тест на сайті OKAZIA.`,
            });
          } catch (error) {
            console.log('Share dismissed', error);
          }
        } else {
          // Desktop Download Fallback
          const link = document.createElement('a');
          link.download = 'okazia-result.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
        setIsSharing(false);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to generate image', err);
      setIsSharing(false);
    }
  };

  // --- RENDER: RESULT SCREEN ---
  if (showResult && winner) {
    return (
      <div className="flex flex-col items-center animate-fade-in relative max-w-2xl mx-auto">
        {/* Audio Control (Top Right) */}
        {winner.ringtoneUrl && (
          <button
            onClick={toggleAudio}
            className="absolute top-4 right-4 z-10 p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors border border-gray-600"
            title={isMuted ? 'Ввімкнути звук' : 'Вимкнути звук'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-green-400 animate-pulse" />
            )}
          </button>
        )}

        {/* --- SNAPSHOT AREA START --- */}
        <div
          ref={resultCardRef}
          className="w-full text-center bg-gray-900 p-8 rounded-xl border border-white/10 relative overflow-hidden shadow-2xl"
        >
          {/* Decorative Top Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>

          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-400 tracking-wide mt-4">
            Мій персонаж:
          </h2>

          {winner.imageUrl && (
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {/* Use standard img for better html2canvas CORS compatibility */}
              <img
                src={winner.imageUrl}
                alt={winner.characterName}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          )}

          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 uppercase tracking-wider">
            {winner.characterName}
          </h3>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg mx-auto">
            {winner.description}
          </p>

          <div className="mt-4 text-xs text-gray-600 uppercase tracking-[0.2em]">
            okazia.com.ua
          </div>
        </div>
        {/* --- SNAPSHOT AREA END --- */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md px-4">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 inline-flex justify-center items-center bg-blue-600 text-white font-bold py-4 px-6 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-900/20"
          >
            {isSharing ? (
              <span className="animate-pulse">Створюю...</span>
            ) : (
              <>
                <Share2 className="mr-2 h-5 w-5" /> Поділитися
              </>
            )}
          </button>

          <button
            onClick={resetQuiz}
            className="flex-1 inline-flex justify-center items-center bg-gray-800 text-white font-bold py-4 px-6 rounded-full hover:bg-gray-700 border border-gray-600 transition-colors"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Ще раз
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: QUESTION SCREEN ---
  const question = data.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / data.questions.length) * 100;
  const currentSelectedAnswer = userAnswers[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-2 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-white h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-gray-900/60 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/10 relative shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center leading-tight min-h-[4rem] flex items-center justify-center">
          {question.questionText}
        </h2>

        <div className="grid gap-4">
          {question.answers.map((answer, index) => {
            const isSelected = currentSelectedAnswer === answer.pointsTo;
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(answer.pointsTo)}
                className={`w-full text-left p-5 border rounded-xl transition-all duration-200 group flex justify-between items-center
                  ${
                    isSelected
                      ? 'bg-white text-black border-white ring-2 ring-white/50 scale-[1.02]'
                      : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-500 hover:translate-x-1'
                  }
                `}
              >
                <span className="text-lg font-medium">{answer.answerText}</span>
                {isSelected ? (
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                ) : (
                  <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
          <button
            onClick={handleBackStep}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center text-sm font-bold uppercase tracking-widest transition-colors 
              ${currentQuestionIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white'}
            `}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Назад
          </button>

          <span className="text-gray-600 text-xs font-mono tracking-widest">
            {currentQuestionIndex + 1} / {data.questions.length}
          </span>

          <button
            onClick={() => handleNextStep()}
            disabled={!currentSelectedAnswer}
            className={`flex items-center text-sm font-bold uppercase tracking-widest transition-colors 
              ${!currentSelectedAnswer ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white'}
            `}
          >
            Далі
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
