import { client } from '../../sanity/client'; // Adjust path to your sanity client
import QuizGame from '../../components/Quiz/QuizGame';

// GROQ Query - Updated to include 'ringtoneUrl'
const QUIZ_QUERY = `*[_type == "quiz"][0]{
  title,
  results[]{
    resultId,
    characterName,
    description,
    "imageUrl": image.asset->url,
    "ringtoneUrl": ringtone.asset->url
  },
  questions[]{
    questionText,
    answers[]{
      answerText,
      pointsTo
    }
  }
}`;

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function QuizPage() {
  const quizData = await client.fetch(QUIZ_QUERY);

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Тест ще не створено. Перевірте Sanity Studio.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-12 bg-black text-white"
      style={{
        // Optional: Add a texture background here if you have one
        // backgroundImage: "url('/images/texture-bg.png')",
        backgroundSize: 'cover',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <p className="text-gray-400 text-sm md:text-base uppercase tracking-[0.3em] mb-3">
            Інтерактив
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wider leading-tight">
            {quizData.title}
          </h1>
        </div>

        {/* Game Component */}
        <QuizGame data={quizData} />
      </div>
    </div>
  );
}
