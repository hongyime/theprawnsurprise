import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANSWERS = [
  "It is certain", "It is decidedly so", "Without a doubt", "Yes definitely",
  "You may rely on it", "As I see it, yes", "Most likely", "Outlook good",
  "Yes", "Signs point to yes", "Reply hazy, try again", "Ask again later",
  "Better not tell you now", "Cannot predict now", "Concentrate and ask again",
  "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good",
  "Very doubtful"
];

export const Magic8Ball: React.FC = () => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const answerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (answerTimer.current !== null) clearTimeout(answerTimer.current);
  }, []);

  const handleShake = () => {
    if (answerTimer.current !== null) return;
    setIsShaking(true);
    setAnswer(null);

    // Shake time
    answerTimer.current = setTimeout(() => {
      answerTimer.current = null;
      const randomAnswer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
      setAnswer(randomAnswer);
      setIsShaking(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <button
        type="button"
        aria-label="Ask the 8-ball"
        aria-disabled={isShaking}
        onClick={handleShake}
        className="cursor-pointer group relative w-full max-w-72 sm:max-w-96 aspect-square rounded-full"
      >
        {/* Ball Body */}
        <motion.div
          animate={isShaking ? {
            x: [-10, 10, -10, 10, -5, 5, 0],
            y: [-5, 5, -5, 5, -2, 2, 0],
            rotate: [-5, 5, -5, 5, 0]
          } : {}}
          transition={{ duration: 0.5, repeat: isShaking ? 2 : 0 }}
          className="w-full h-full rounded-full bg-black border-3 border-black shadow-retro flex items-center justify-center relative overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Inner Window */}
          <div aria-hidden="true" className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-neutral-800 border-3 border-neutral-500 flex items-center justify-center relative shadow-inner">
            
            <AnimatePresence mode="wait">
              {!isShaking && answer && (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ duration: 1, type: 'spring' }}
                  className="w-full h-full flex items-center justify-center"
                >
                    {/* Answer triangle pointing down */}
                    <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-white fill-current">
                            <polygon points="5,5 95,5 50,95" />
                        </svg>
                         {/* Text positioned in the wider top part of the inverted triangle */}
                         <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-24 flex items-center justify-center">
                             <p className="text-center text-black font-sans text-[0.6rem] sm:text-[0.65rem] font-bold leading-tight uppercase tracking-wider select-none">
                                {answer}
                            </p>
                         </div>
                    </div>
                </motion.div>
              )}
              
              {!isShaking && !answer && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white/20 font-retro text-4xl"
                >
                    8
                </motion.div>
              )}
            </AnimatePresence>

            {isShaking && (
                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center rounded-full">
                    <div className="w-full h-full bg-neutral-700/40 animate-pulse rounded-full"></div>
                </div>
            )}
          </div>
        </motion.div>
      </button>
      
      <p role="status" className="mt-8 font-retro font-bold text-sm text-center w-full px-4">
        {isShaking ? 'CONSULTING THE VOID...' : answer ?? 'PRESS THE ORB TO SEEK WISDOM'}
      </p>
    </div>
  );
}
