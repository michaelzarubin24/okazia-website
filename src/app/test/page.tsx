import { client } from '../../sanity/client';
import QuizGame from '../../components/Quiz/QuizGame';

const QUIZ_QUERY = `*[_type == "quiz"][0]{
  title,
  results[]{
    resultId,
    characterName,
    description,
    "imageUrl": image.asset->url
  },
  questions[]{
    questionText,
    answers[]{
      answerText,
      pointsTo
    }
  }
}`;

// Force dynamic rendering so the quiz is always fresh
export const dynamic = 'force-dynamic';

export default async function QuizPage() {
  const quizData = await client.fetch(QUIZ_QUERY);

  if (!quizData) {
    return <div className="pt-32 text-center">Тест ще не створено.</div>;
  }

  return (
    <div
      className="min-h-screen pt-24 pb-12 bg-black text-white"
      style={{
        backgroundImage: "url('/images/texture-bg.png')", // Optional: reuse your texture logic here if you want
        backgroundSize: 'cover',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-400 uppercase tracking-widest mb-2">
            ІНТЕРАКТИВ
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wider">
            {quizData.title}
          </h1>
        </div>

        <QuizGame data={quizData} />
      </div>
    </div>
  );
}
