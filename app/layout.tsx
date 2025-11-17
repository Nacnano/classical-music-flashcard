import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Classical Music Flashcards',
  description: 'Learn classical music pieces with interactive flashcards',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Nunito+Sans:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
