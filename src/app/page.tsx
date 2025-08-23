'use client'; // This enables browser-side interactivity for the form.

import { useState } from 'react';

// A new component specifically for the Mailchimp form logic.
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'sending', 'success', 'error'
  const [message, setMessage] = useState('');

  // This is the action URL from your Mailchimp account.
  const MAILCHIMP_URL = "https://gmail.us15.list-manage.com/subscribe/post?u=4fdcb783d461acf4d88126353&id=c84bd47487&f_id=00d2a2e1f0";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData();
    formData.append('EMAIL', email);
    // This hidden field is sometimes required by Mailchimp to prevent bot signups.
    formData.append('b_4fdcb783d461acf4d88126353_c84bd47487', '');

    try {
      // We are using a library to bypass CORS issues that can happen with a direct fetch.
      // This sends the data in a way Mailchimp accepts from client-side forms.
      await fetch(MAILCHIMP_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // Important for this type of request
      });
      setStatus('success');
      setMessage('Дякуємо за підписку!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Щось пішло не так. Спробуйте ще раз.');
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Підписуйтесь на наші новини!
        </h2>
        <p className="max-w-2xl mx-auto text-gray-400 mb-10">
          Будьте першими, хто дізнається про нову музику, дати турів та ексклюзивний контент. Без спаму, тільки найкраще.
        </p>
        
        {status === 'success' ? (
          <p className="text-green-400 text-lg">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email"
                name="EMAIL"
                placeholder="Ваша електронна пошта..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button 
                type="submit"
                disabled={status === 'sending'}
                className="bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? 'Subscribing...' : 'Підписатися'}
              </button>
            </div>
            {status === 'error' && <p className="text-red-400 mt-4">{message}</p>}
          </form>
        )}
      </div>
    </section>
  );
};


export default function Home() {
  return (
    <>
      <section className="relative w-full">
        <img
          src="/images/photo-all.jpg"
          alt="OKAZIA band photo"
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </section>

      <section className="relative w-full">
        <img
          src="/images/main-2.png"
          alt="Explore our tour"
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10 p-8 text-center">
          <div className="text-white w-full max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider mb-4">
              ПЕРШИЙ ТУР УКРАЇНОЮ
            </h2>
            <hr className="border-t-2 border-white" />
            <p className="mt-4 text-xl uppercase tracking-widest">
              НА ПІДТРИМКУ БРИТАНСЬКОГО ГУРТУ
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full flex justify-center z-10 p-8 sm:p-12">
          <a
            href="/explore"
            className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300"
          >
            ЧИТАТИ
          </a>
        </div>
      </section>

      <section className="relative w-full">
        <img
          src="/images/main-4.png"
          alt="Explore our concert"
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex items-end justify-center z-10 p-8 sm:p-12">
          <div className="text-center text-white max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider">
              СОЛЬНИЙ КОНЦЕРТ В ART AREA ДК
            </h2>
            <p className="mt-4 text-lg">
              Наш перший великий сольний концерт відбувся 6 червня 2025 року в культурному просторі ART AREA ДК!
            </p>
            <a
              href="/gigs/archive/artdacha-2025-06-06"
              className="mt-8 inline-block bg-transparent border-2 border-white text-white font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300"
            >
              ЧИТАТИ
            </a>
          </div>
        </div>
      </section>

      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/videos/okazia-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 h-full flex flex-col items-end justify-center text-center text-white p-8">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider">
              ЦИКЛ (MUSIC VIDEO)
            </h2>
            <p className="mt-4 text-lg max-w-2xl">
              Натисніть нижче, щоб переглянути повну версію на YouTube з найкращою якістю та звуком.
            </p>
            <a
              href="https://www.youtube.com/watch?v=bMl_En4wSYo"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block bg-white text-black font-bold text-lg tracking-widest uppercase px-10 py-4 hover:bg-gray-200 transition-colors duration-300"
            >
              Дивитись на YouTube
            </a>
        </div>
      </section>
      
      {/* The new, functional newsletter form is now here */}
      <NewsletterForm />
    </>
  );
}