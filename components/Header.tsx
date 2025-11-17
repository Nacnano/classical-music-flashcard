import React from 'react';

const MusicNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-2xl mx-auto py-4 sm:py-6 mb-2 sm:mb-4 text-center px-4">
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <MusicNoteIcon className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 flex-shrink-0" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-amber-300">
          Classical Music Flashcards
        </h1>
      </div>
    </header>
  );
};

export default Header;
