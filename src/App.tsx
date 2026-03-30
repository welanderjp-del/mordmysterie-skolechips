/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, ArrowLeft, ChevronRight } from 'lucide-react';
import { Language, translations, MysteryState, MysteryItem } from './types';
import { WHO_ITEMS, WHAT_ITEMS, WHERE_ITEMS, WHEN_ITEMS } from './constants';

const SKOLECHIPS_LOGO = "https://res.cloudinary.com/dtw8jfk0k/image/upload/v1774287946/ikon_m2x8mj.png";
const CHIME_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/931/931-preview.mp3"; 
const FLIP_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3";

export default function App() {
  const [lang, setLang] = useState<Language>('da');
  const [gameState, setGameState] = useState<'splash' | 'game'>('splash');
  const [timeLimit, setTimeLimit] = useState<number>(3); // minutes, 11 means infinite
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [mystery, setMystery] = useState<MysteryState | null>(null);
  const [nextMystery, setNextMystery] = useState<MysteryState | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [rotation, setRotation] = useState(0);

  const t = translations[lang];

  const createMystery = useCallback(() => {
    const getRandom = (items: MysteryItem[]) => items[Math.floor(Math.random() * items.length)];
    return {
      who: getRandom(WHO_ITEMS),
      what: getRandom(WHAT_ITEMS),
      where: getRandom(WHERE_ITEMS),
      when: getRandom(WHEN_ITEMS),
    };
  }, []);

  // Initialize mysteries
  useEffect(() => {
    if (!mystery) {
      setMystery(createMystery());
    }
    if (!nextMystery) {
      setNextMystery(createMystery());
    }
  }, [mystery, nextMystery, createMystery]);

  const startGame = () => {
    setRotation(0);
    // Rotate mysteries to ensure fresh ones from preloaded state
    if (nextMystery) {
      setMystery(nextMystery);
      setNextMystery(createMystery());
    } else {
      setMystery(createMystery());
    }

    if (timeLimit <= 10) {
      setTimeLeft(timeLimit * 60);
    } else {
      setTimeLeft(-1); // infinite
    }
    setIsTimeUp(false);
    setGameState('game');
  };

  const nextRound = () => {
    const audio = new Audio(FLIP_SOUND_URL);
    audio.volume = 0.4;
    audio.play().catch(e => console.error("Audio play failed", e));

    // First half of the spin (to back side)
    setRotation(prev => prev + 180);
    
    // Change content halfway through flip
    setTimeout(() => {
      if (nextMystery) {
        setMystery(nextMystery);
        setNextMystery(createMystery());
      } else {
        setMystery(createMystery());
      }
      
      if (timeLimit <= 10) {
        setTimeLeft(timeLimit * 60);
      } else {
        setTimeLeft(-1);
      }
      setIsTimeUp(false);
    }, 400);

    // Second half of the spin (back to front)
    setTimeout(() => {
      setRotation(prev => prev + 180);
    }, 1000);
  };

  const goBack = () => {
    setGameState('splash');
    setIsTimeUp(false);
  };

  useEffect(() => {
    let timer: number;
    if (gameState === 'game' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            const audio = new Audio(CHIME_SOUND_URL);
            audio.volume = 0.5;
            audio.play().catch(e => console.error("Audio play failed", e));
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const formatTime = (seconds: number) => {
    if (seconds < 0) return "∞";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] font-sans overflow-hidden selection:bg-yellow-400 selection:text-black">
      <AnimatePresence mode="wait">
        {gameState === 'splash' ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-screen flex flex-col items-center justify-center p-8 text-center"
          >
            {/* Logo & Title */}
            <a 
              href="https://skolechips.dk" 
              className="absolute top-8 left-8 flex items-center gap-3 hover:scale-105 transition-transform z-50 group"
            >
              <img src={SKOLECHIPS_LOGO} alt="Skolechips Logo" className="w-12 h-12 md:w-16 md:h-16" />
              <span className="text-xl md:text-2xl font-bold text-[#334155] hidden sm:block group-hover:text-[#1e293b]">Skolechips</span>
            </a>

            {/* Language Flags */}
            <div className="absolute top-8 right-8 flex gap-4 z-50">
              {[
                { code: 'da', flag: '🇩🇰' },
                { code: 'en', flag: '🇬🇧' },
                { code: 'de', flag: '🇩🇪' }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code as Language)}
                  className={`text-3xl hover:scale-125 transition-transform ${lang === l.code ? 'ring-2 ring-yellow-400 rounded-lg p-1' : 'opacity-40'}`}
                >
                  {l.flag}
                </button>
              ))}
            </div>

            {/* Background Chalk Outline - Milder */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full max-w-2xl">
                <path
                  d="M100,20 C110,20 120,30 120,45 C120,60 110,70 100,70 C90,70 80,60 80,45 C80,30 90,20 100,20 M100,70 L100,130 M100,85 L140,110 M100,85 L60,110 M100,130 L130,170 M100,130 L70,170"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Police Tape - Bright Yellow */}
            <div className="absolute top-1/4 -left-20 -right-20 h-12 bg-yellow-400 text-black font-black flex items-center justify-around rotate-[-3deg] overflow-hidden whitespace-nowrap z-10 border-y-2 border-black">
              {Array(10).fill(0).map((_, i) => (
                <span key={i} className="text-sm uppercase tracking-[0.4em]">CRIME SCENE • DO NOT CROSS • </span>
              ))}
            </div>

            <div className="z-20 max-w-xl bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] shadow-2xl border border-slate-200 w-full mx-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic mb-4 md:mb-6 tracking-tight text-[#1e293b] leading-tight">
                {t.title}
              </h1>
              <p className="text-sm md:text-base mb-6 md:mb-8 leading-relaxed font-medium text-slate-500">
                {t.intro}
              </p>

              <div className="mb-6 md:mb-8 space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>{t.timeLabel}</span>
                  <span className="text-slate-600">{timeLimit > 10 ? t.noTime : `${timeLimit} ${t.minutes}`}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="11"
                  step="1"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
              </div>

              <button
                onClick={startGame}
                className="group relative px-10 md:px-14 py-4 md:py-5 bg-[#334155] text-white font-bold text-lg md:text-xl rounded-full hover:bg-[#1e293b] transition-all active:scale-95 shadow-lg"
              >
                {t.startButton}
              </button>
            </div>

            {/* Preload Next Images (Hidden) */}
            {nextMystery && (
              <div className="hidden">
                <img src={`https://loremflickr.com/400/600/${nextMystery.who.imageSeed}`} alt="" />
                <img src={`https://loremflickr.com/400/600/${nextMystery.what.imageSeed}`} alt="" />
                <img src={`https://loremflickr.com/400/600/${nextMystery.where.imageSeed}`} alt="" />
                <img src={`https://loremflickr.com/400/600/${nextMystery.when.imageSeed}`} alt="" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen grid grid-rows-[80px_1fr] pt-6 px-6 pb-2 md:pt-10 md:px-10 md:pb-4 relative overflow-hidden"
          >
            {/* Header */}
            <div className="w-full flex justify-between items-center z-30">
              <div className="flex items-center gap-4">
                <a 
                  href="https://skolechips.dk" 
                  className="flex items-center gap-2 hover:scale-105 transition-transform group"
                >
                  <img src={SKOLECHIPS_LOGO} alt="Skolechips Logo" className="w-10 h-10" />
                  <span className="text-lg font-bold text-[#334155] hidden md:block group-hover:text-[#1e293b]">Skolechips</span>
                </a>
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 bg-white/90 hover:bg-white px-5 py-2.5 rounded-full transition-all shadow-sm border border-slate-200 font-medium text-sm"
                >
                  <ArrowLeft size={18} />
                  {t.backButton}
                </button>
              </div>

              <div className="flex items-center gap-4">
                {timeLeft !== -1 && (
                  <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full font-mono text-xl border transition-all shadow-sm ${isTimeUp ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-white/90 border-slate-200'}`}>
                    <Timer size={20} />
                    {isTimeUp ? t.timeUp : formatTime(timeLeft)}
                  </div>
                )}
                
                <button
                  onClick={nextRound}
                  className="flex items-center gap-2 bg-[#334155] text-white hover:bg-[#1e293b] px-6 py-2.5 rounded-full transition-all shadow-md font-bold text-sm"
                >
                  {t.nextRound}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="w-full flex items-stretch justify-center gap-4 md:gap-6 lg:gap-10 max-w-7xl mx-auto min-h-0 px-4 pb-4 md:pb-8">
              {mystery && (
                <>
                  <Card 
                    label={t.who} 
                    item={mystery.who} 
                    lang={lang} 
                    delay={0}
                    rotation={rotation}
                    index={0}
                  />
                  <Card 
                    label={t.what} 
                    item={mystery.what} 
                    lang={lang} 
                    delay={0.1}
                    rotation={rotation}
                    index={1}
                  />
                  <Card 
                    label={t.where} 
                    item={mystery.where} 
                    lang={lang} 
                    delay={0.2}
                    rotation={rotation}
                    index={2}
                  />
                  <Card 
                    label={t.when} 
                    item={mystery.when} 
                    lang={lang} 
                    delay={0.3}
                    rotation={rotation}
                    index={3}
                  />
                </>
              )}
            </div>

            {/* Preload Next Images (Hidden) */}
            {nextMystery && (
              <div className="hidden">
                <img src={`https://loremflickr.com/400/600/${nextMystery.who.imageSeed}`} alt="" />
                <img src={`https://loremflickr.com/400/600/${nextMystery.what.imageSeed}`} alt="" />
                <img src={`https://loremflickr.com/400/600/${nextMystery.where.imageSeed}`} alt="" />
                <img src={`https://loremflickr.com/400/600/${nextMystery.when.imageSeed}`} alt="" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ label, item, lang, delay, rotation, index }: { label: string, item: MysteryItem, lang: Language, delay: number, rotation: number, index: number }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        transition: { delay, type: 'spring', damping: 15 }
      }}
      className="flex flex-col items-center group flex-1 min-w-0 max-w-[280px] h-full"
    >
      <div className="flex-1 w-full flex items-center justify-center min-h-0 mb-2 md:mb-4">
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: index % 2 === 0 ? [-1, 1, -1] : [1, -1, 1],
            x: [0, 2, 0, -2, 0]
          }}
          transition={{
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay * 2
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay * 3
            },
            x: {
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay * 4
            }
          }}
          className="relative w-full aspect-[2/3] max-h-full" 
          style={{ perspective: '1000px' }}
        >
          <motion.div
            animate={{ rotateY: rotation }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full h-full"
          >
            {/* Front Side */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-2 md:p-4 shadow-xl border border-slate-100 flex flex-col"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex-1 bg-slate-50 rounded-[1.4rem] md:rounded-[1.8rem] overflow-hidden relative">
                <img
                  src={`https://loremflickr.com/400/600/${item.imageSeed}`}
                  alt={item[lang]}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              
              <div className="mt-3 md:mt-5 text-center">
                <span className="text-slate-700 font-serif italic text-sm md:text-lg truncate block px-2">
                  {item[lang]}
                </span>
              </div>
            </div>

            {/* Back Side */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-xl border border-slate-100 flex items-center justify-center"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <img 
                src={SKOLECHIPS_LOGO} 
                alt="Skolechips" 
                className="w-full h-auto max-w-[80%] opacity-80" 
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Label below card */}
      <h2 className="text-base md:text-xl font-serif italic text-slate-400 w-full text-center pb-2">
        {label}
      </h2>
    </motion.div>
  );
}
