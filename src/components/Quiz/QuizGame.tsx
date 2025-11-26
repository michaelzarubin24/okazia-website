'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, RefreshCw } from 'lucide-react';

// 1. Define proper types to remove 'any' errors
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

  const [scores, setScores] = useState<Record<string, number>>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
  });

  const [showResult, setShowResult] = useState(false);
  // Fixed: typed as ResultCharacter or null
  const [winner, setWinner] = useState<ResultCharacter | null>(null);

  const handleAnswer = (pointsTo: string) => {
    const currentScore = scores[pointsTo] || 0;
    const newScores = { ...scores, [pointsTo]: currentScore + 1 };
    setScores(newScores);

    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateWinner(newScores);
    }
  };

  const calculateWinner = (finalScores: Record<string, number>) => {
    const winningKey = Object.keys(finalScores).reduce((a, b) =>
      finalScores[a] > finalScores[b] ? a : b
    );

    const resultData = data.results.find((r) => r.resultId === winningKey);

    // Safety check in case resultData is undefined
    if (resultData) {
      setWinner(resultData);
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setScores({ A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 });
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
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-white/10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center leading-tight">
          {question.questionText}
        </h2>

        <div className="grid gap-4">
          {/* Fixed: Removed 'any' from map arguments, TypeScript infers it now */}
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(answer.pointsTo)}
              className="w-full text-left p-5 bg-gray-800 hover:bg-white hover:text-black border border-gray-700 hover:border-white rounded-xl transition-all duration-200 group flex justify-between items-center"
            >
              <span className="text-lg font-medium">{answer.answerText}</span>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Питання {currentQuestionIndex + 1} з {data.questions.length}
        </div>
      </div>
    </div>
  );
}
