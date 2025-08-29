// FILE: src/app/contacts/page.tsx
// This page will display contact information and a contact form.

import { Mail } from 'lucide-react'; // Importing an icon

export default function ContactsPage() {
  const headerHeight = '3.5rem';

  return (
    // This main container holds the background image and the content.
    <div 
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ 
        backgroundImage: "url('/images/contacts/contacts.jpg')", // <-- IMPORTANT: Add your background image path here
        paddingTop: headerHeight 
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        
        {/* Semi-transparent card for the content */}
        {/* UPDATED: Changed max-w-4xl to max-w-3xl to make the entire card smaller */}
        <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-8 sm:p-12 rounded-lg">
          <div className="text-center">
            <h1 className="text-2xl sm:text-6xl font-extrabold uppercase tracking-wider mb-4">
              КОНТАКТИ
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
              Якщо у вас є питання, запит на бронювання або ви просто хочете привітатися, ми будемо раді вас вислухати.
            </p>
          </div>

          {/* Direct Email Section */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold mb-2">Наша електронна пошта</h3>
            <a 
              href="mailto:okaziamusic@gmail.com"
              className="inline-flex items-center text-xl text-white hover:underline"
            >
              <Mail className="mr-2" size={20} />
              okaziamusic@gmail.com
            </a>
          </div>

          {/* Contact Form Section */}
          <div className="max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Надішліть повідомлення</h3>
            <form 
              action="https://formspree.io/f/xovnaaag"
              method="POST"
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Ім'я</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full px-4 py-3 text-white bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Ваша електронна пошта</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full px-4 py-3 text-white bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Повідомлення</label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  className="mt-1 block w-full px-4 py-3 text-white bg-gray-800/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-white text-black font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Надіслати повідомлення
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}