'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  ArrowRight,
  Share2,
  Download,
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
  // Track user answers
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    Array(data.questions.length).fill(null)
  );

  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState<ResultCharacter | null>(null);

  // NEW: State for share loading
  const [isSharing, setIsSharing] = useState(false);
  // NEW: Ref to capture the specific DOM element
  const resultCardRef = useRef<HTMLDivElement>(null);

  // --- LOGIC ---
  const handleAnswerSelect = (pointsTo: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = pointsTo;
    setUserAnswers(newAnswers);
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

    const winningKey = Object.keys(finalScores).reduce((a, b) =>
      finalScores[a] > finalScores[b] ? a : b
    );

    const resultData = data.results.find((r) => r.resultId === winningKey);
    if (resultData) {
      setWinner(resultData);
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setUserAnswers(Array(data.questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setWinner(null);
  };

  // --- NEW: SHARE FUNCTIONALITY ---
  const handleShare = async () => {
    if (!resultCardRef.current) return;
    setIsSharing(true);

    try {
      // 1. Generate Canvas from the div
      const canvas = await html2canvas(resultCardRef.current, {
        useCORS: true, // Important for loading external images (Sanity)
        backgroundColor: '#111827', // Dark background for the image
        scale: 2, // Higher quality
      });

      // 2. Convert to Blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // 3. Prepare File for sharing
        const file = new File([blob], 'okazia-result.png', {
          type: 'image/png',
        });

        // 4. Try Native Sharing (Mobile)
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
          // 5. Fallback: Download Image (Desktop)
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
      <div className="flex flex-col items-center animate-fade-in">
        {/* THIS DIV IS WHAT GETS PHOTOGRAPHED */}
        <div
          ref={resultCardRef}
          className="max-w-md w-full text-center bg-gray-900 p-8 rounded-xl border border-white/10 relative overflow-hidden"
        >
          {/* Optional: Add a subtle background branding for the screenshot */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>

          <h2 className="text-2xl font-bold mb-6 text-gray-400">
            Мій персонаж:
          </h2>

          {winner.imageUrl && (
            // Note: Use unoptimized or standard img for better html2canvas compatibility if needed
            // But Next/Image usually works with useCORS: true
            <div className="relative w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              {/* Using standard img tag inside the screenshot area often reduces CORS issues */}
              <img
                src={winner.imageUrl}
                alt={winner.characterName}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          )}

          <h3 className="text-4xl font-extrabold text-white mb-4 uppercase tracking-wider">
            {winner.characterName}
          </h3>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            {winner.description}
          </p>

          <div className="mt-4 text-sm text-gray-500 uppercase tracking-widest">
            okazia.com.ua
          </div>
        </div>

        {/* BUTTONS (Outside the screenshot area) */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 inline-flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSharing ? (
              <span className="animate-pulse">Створюю...</span>
            ) : (
              <>
                <Share2 className="mr-2 h-5 w-5" />
                Поділитися
              </>
            )}
          </button>

          <button
            onClick={resetQuiz}
            className="flex-1 inline-flex justify-center items-center bg-gray-800 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-700 border border-gray-600 transition-colors"
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
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-2 rounded-full mb-8">
        <div
          className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-white/10 relative">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center leading-tight">
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
                      ? 'bg-white text-black border-white ring-2 ring-white/50'
                      : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-500'
                  }
                `}
              >
                <span className="text-lg font-medium">{answer.answerText}</span>
                {isSelected ? (
                  <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs">
                    ✓
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            );
          })}
        </div>

        {/* NAVIGATION CONTROLS */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
          <button
            onClick={handleBackStep}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center text-sm font-bold uppercase tracking-widest transition-colors
              ${
                currentQuestionIndex === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Назад
          </button>

          <span className="text-gray-600 text-sm font-mono">
            {currentQuestionIndex + 1} / {data.questions.length}
          </span>

          <button
            onClick={() => handleNextStep()}
            disabled={!currentSelectedAnswer}
            className={`flex items-center text-sm font-bold uppercase tracking-widest transition-colors
              ${
                !currentSelectedAnswer
                  ? 'opacity-0 pointer-events-none'
                  : 'text-gray-400 hover:text-white'
              }
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
