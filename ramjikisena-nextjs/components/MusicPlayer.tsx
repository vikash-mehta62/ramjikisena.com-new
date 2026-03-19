'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music2, Volume2, ChevronDown, ChevronUp, X } from 'lucide-react';

interface Song {
  name: string;
  displayName: string;
  file: string;
  emoji: string;
}

const SONGS: Song[] = [
  { name: 'ramdhun', displayName: 'राम धुन', file: '/audios/ramdhun.mp3', emoji: '🚩' },
  { name: 'heyram', displayName: 'हे राम', file: '/audios/heyram.mp3', emoji: '🙏' },
  { name: 'sitaram', displayName: 'सीता राम', file: '/audios/sitaram.mp3', emoji: '💐' },
  { name: 'haridhun', displayName: 'हरि धुन', file: '/audios/haridhun.mp3', emoji: '🌺' },
  { name: 'ramnamkirtan', displayName: 'राम नाम कीर्तन', file: '/audios/ramnamkirtan.mp3', emoji: '🎵' },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % SONGS.length;
    changeSong(nextIndex);
  };

  const prevSong = () => {
    const prevIndex = currentSongIndex === 0 ? SONGS.length - 1 : currentSongIndex - 1;
    changeSong(prevIndex);
  };

  if (isClosed) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsClosed(false)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
        title="Open Music Player"
      >
        <Music2 className="w-6 h-6 text-white" />
      </motion.button>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={SONGS[currentSongIndex].file}
        onEnded={nextSong}
        loop={false}
      />

      {/* Floating Music Player */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Playlist Popup */}
        <AnimatePresence>
          {showPlaylist && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-4 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-orange-200 p-4 w-72"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 text-sm">🎵 Bhajan Playlist</h3>
                <button
                  onClick={() => setShowPlaylist(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {SONGS.map((song, index) => (
                  <button
                    key={song.name}
                    onClick={() => {
                      changeSong(index);
                      setShowPlaylist(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      currentSongIndex === index
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-orange-50 hover:bg-orange-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{song.emoji}</span>
                      <div>
                        <div className="font-semibold text-sm">{song.displayName}</div>
                        {currentSongIndex === index && isPlaying && (
                          <div className="flex gap-1 mt-1">
                            <motion.div
                              animate={{ height: ['4px', '12px', '4px'] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="w-1 bg-white rounded-full"
                            />
                            <motion.div
                              animate={{ height: ['8px', '4px', '8px'] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                              className="w-1 bg-white rounded-full"
                            />
                            <motion.div
                              animate={{ height: ['4px', '10px', '4px'] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                              className="w-1 bg-white rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Volume Control */}
              <div className="mt-4 pt-4 border-t border-orange-200">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-gray-600" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-orange-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-600 w-8">{Math.round(volume * 100)}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Player Controls */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-2xl shadow-2xl border-2 border-white overflow-hidden">
          {/* Header with Close/Minimize */}
          <div className="flex items-center justify-between px-3 py-2 bg-white/10">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white/90">Music</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <button
                onClick={() => {
                  setIsClosed(true);
                  if (audioRef.current) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                  }
                }}
                className="w-6 h-6 bg-white/20 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all"
                title="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Now Playing */}
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 text-center">
                <div className="text-xs font-semibold text-white/80 mb-1">Now Playing</div>
                <div className="font-bold text-white flex items-center justify-center gap-2">
                  <span className="text-xl">{SONGS[currentSongIndex].emoji}</span>
                  <span className="text-sm">{SONGS[currentSongIndex].displayName}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 p-4">
                <button
                  onClick={prevSong}
                  className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                  title="Previous"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 text-orange-600" /> : <Play className="w-5 h-5 text-orange-600 ml-0.5" />}
                </button>

                <button
                  onClick={nextSong}
                  className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                  title="Next"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                  title="Playlist"
                >
                  <Music2 className="w-4 h-4" />
                </button>
              </div>

              {/* Visualizer */}
              {isPlaying && (
                <div className="flex items-center justify-center gap-1 pb-3">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['6px', '16px', '6px'] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut'
                      }}
                      className="w-1 bg-white/60 rounded-full"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
