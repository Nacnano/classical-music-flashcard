'use client';

import React, { useState } from 'react';
import Button from './Button';
import { WEEKS, MUSIC_LIST } from '../constants';
import type { MusicPiece } from '../types';

interface FilterScreenProps {
  onStartQuiz: (selectedSongs: MusicPiece[]) => void;
}

const FilterScreen: React.FC<FilterScreenProps> = ({ onStartQuiz }) => {
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>(WEEKS);
  const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(
    new Set(MUSIC_LIST.map(song => `${song.composer}|${song.title}`))
  );
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  const getSongId = (song: MusicPiece) => `${song.composer}|${song.title}`;

  const handleToggleWeek = (week: string) => {
    const songs = getSongsForWeek(week);
    const isWeekSelected = selectedWeeks.includes(week);

    if (isWeekSelected) {
      // Deselect week and all its songs
      setSelectedWeeks(prev => prev.filter(w => w !== week));
      setSelectedSongIds(prev => {
        const newSet = new Set(prev);
        songs.forEach(song => newSet.delete(getSongId(song)));
        return newSet;
      });
    } else {
      // Select week and all its songs
      setSelectedWeeks(prev => [...prev, week]);
      setSelectedSongIds(prev => {
        const newSet = new Set(prev);
        songs.forEach(song => newSet.add(getSongId(song)));
        return newSet;
      });
    }
  };

  const handleToggleSong = (song: MusicPiece) => {
    const songId = getSongId(song);
    setSelectedSongIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }

      // Update week selection based on songs
      const songsInWeek = getSongsForWeek(song.week);
      const allSongsInWeekSelected = songsInWeek.every(s => newSet.has(getSongId(s)));
      const noSongsInWeekSelected = songsInWeek.every(s => !newSet.has(getSongId(s)));

      if (allSongsInWeekSelected && !selectedWeeks.includes(song.week)) {
        setSelectedWeeks(prev => [...prev, song.week]);
      } else if (noSongsInWeekSelected && selectedWeeks.includes(song.week)) {
        setSelectedWeeks(prev => prev.filter(w => w !== song.week));
      } else if (!allSongsInWeekSelected && selectedWeeks.includes(song.week)) {
        setSelectedWeeks(prev => prev.filter(w => w !== song.week));
      }

      return newSet;
    });
  };

  const toggleExpandWeek = (week: string) => {
    setExpandedWeek(prev => (prev === week ? null : week));
  };

  const getSongsForWeek = (week: string) => {
    return MUSIC_LIST.filter(piece => piece.week === week);
  };

  const handleSelectAll = () => {
    setSelectedWeeks(WEEKS);
    setSelectedSongIds(new Set(MUSIC_LIST.map(song => getSongId(song))));
  };

  const handleDeselectAll = () => {
    setSelectedWeeks([]);
    setSelectedSongIds(new Set());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSongs = MUSIC_LIST.filter(song => selectedSongIds.has(getSongId(song)));
    if (selectedSongs.length > 0) {
      onStartQuiz(selectedSongs);
    }
  };

  const getSelectedSongsCount = () => selectedSongIds.size;

  return (
    <div className="w-full max-w-2xl bg-slate-800/50 p-8 rounded-xl shadow-2xl animate-fade-in text-center">
      <h2 className="text-3xl font-bold mb-4 text-amber-200">Select Weeks to Study</h2>
      <p className="text-gray-400 mb-6">Choose the weeks you want to be quizzed on.</p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-3 text-left my-6 max-h-96 overflow-y-auto">
          {WEEKS.map(week => {
            const songs = getSongsForWeek(week);
            const isExpanded = expandedWeek === week;
            return (
              <div key={week} className="bg-gray-900/50 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 hover:bg-gray-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedWeeks.includes(week)}
                    onChange={() => handleToggleWeek(week)}
                    className="form-checkbox h-5 w-5 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-400 focus:ring-2 flex-shrink-0"
                  />
                  <button
                    type="button"
                    onClick={() => toggleExpandWeek(week)}
                    className="flex-1 flex items-center justify-between ml-3 text-left"
                  >
                    <span className="text-gray-200 font-medium">{week}</span>
                    <span className="text-xs text-gray-400 mr-2">
                      {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 space-y-1 bg-gray-900/70">
                    {songs.map((song, index) => {
                      const songId = getSongId(song);
                      const isSelected = selectedSongIds.has(songId);
                      return (
                        <label
                          key={index}
                          className="flex items-center text-sm text-gray-300 pl-4 py-2 hover:bg-gray-800/50 rounded cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSong(song)}
                            className="form-checkbox h-4 w-4 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-400 focus:ring-2 flex-shrink-0"
                          />
                          <div className="ml-3 flex-1 border-l-2 border-amber-500/30 pl-3">
                            <span className="font-medium text-amber-300">{song.composer}</span>
                            <span className="text-gray-400"> - </span>
                            <span className="text-gray-300">{song.title}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 my-6">
          <Button type="button" variant="secondary" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button type="button" variant="secondary" onClick={handleDeselectAll}>
            Deselect All
          </Button>
        </div>

        <Button
          type="submit"
          disabled={getSelectedSongsCount() === 0}
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Quiz ({getSelectedSongsCount()} {getSelectedSongsCount() === 1 ? 'Song' : 'Songs'})
        </Button>
      </form>
    </div>
  );
};

export default FilterScreen;
