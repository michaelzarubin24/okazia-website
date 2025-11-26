'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, RefreshCw, ArrowRight } from 'lucide-react';

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

  // CHANGED: Instead of a score object, we keep an array of selected character IDs
  // e.g. ["A", "B", "A", null, null...]
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    Array(data.questions.length).fill(null)
  );

  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState<ResultCharacter | null>(null);

  // 1. Handle clicking an option
  const handleAnswerSelect = (pointsTo: string) => {
    // Create a copy of the answers array
    const newAnswers = [...userAnswers];

    // Record the answer for the current question index
    newAnswers[currentQuestionIndex] = pointsTo;
    setUserAnswers(newAnswers);

    // Auto-advance after a short delay for better UX, or immediately
    handleNextStep(newAnswers);
  };

  // 2. Logic to move forward (used by click and by "Next" button)
  const handleNextStep = (currentAnswersState = userAnswers) => {
    // If it's the last question, calculate winner
    if (currentQuestionIndex === data.questions.length - 1) {
      calculateWinner(currentAnswersState);
    } else {
      // Otherwise, go to next question
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // 3. Logic to move backward
  const handleBackStep = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // 4. Calculate Winner from the array history
  const calculateWinner = (finalAnswers: (string | null)[]) => {
    // Tally up the scores from the array
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
      if (charId && finalScores[charId] !== undefined) {
        finalScores[charId]++;
      }
    });

    // Find highest score
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

  // --- RENDER: RESULT SCREEN ---
  if (showResult && winner) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-gray-900/80 p-8 rounded-xl border border-white/10 animate-fade-in">
        <h2 className="text-3xl font-bold mb-6">Твій результат:</h2>

        {winner.imageUrl && (
          <div className="relative w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-2xl">
            <Image
              src={winner.imageUrl}
              alt={winner.characterName}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-4 uppercase tracking-wider">
          {winner.characterName}
        </h3>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          {winner.description}
        </p>

        <button
          onClick={resetQuiz}
          className="inline-flex items-center bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Пройти знову
        </button>
      </div>
    );
  }

  // --- RENDER: QUESTION SCREEN ---
  const question = data.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / data.questions.length) * 100;

  // Check if we have an answer recorded for this specific question
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
            // Check if this specific button was the selected one
            const isSelected = currentSelectedAnswer === answer.pointsTo;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(answer.pointsTo)}
                className={`w-full text-left p-5 border rounded-xl transition-all duration-200 group flex justify-between items-center
                  ${
                    isSelected
                      ? 'bg-white text-black border-white ring-2 ring-white/50' // Active Style
                      : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-500' // Default Style
                  }
                `}
              >
                <span className="text-lg font-medium">{answer.answerText}</span>
                {/* Show Checkmark if selected, otherwise Chevron */}
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
          {/* BACK BUTTON (Hidden on first question) */}
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

          {/* Question Counter */}
          <span className="text-gray-600 text-sm font-mono">
            {currentQuestionIndex + 1} / {data.questions.length}
          </span>

          {/* NEXT BUTTON (Only visible if they have already answered this question) */}
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
