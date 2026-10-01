import React, { useState, useRef, useEffect } from 'react';
import { DieType } from '../../types';
import { RetroButton } from '../ui/RetroButton';
import { Die3D } from './Die3D';
import { ROLL_DURATION_MS } from './diceMotion';

interface DiceRollerProps {
  reduceMotion?: boolean;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ reduceMotion = false }) => {
  const [selectedDie, setSelectedDie] = useState<DieType>(DieType.D6);
  const [result, setResult] = useState<number | null>(1);
  const [isRolling, setIsRolling] = useState(false);
  const rollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelRoll = () => {
    if (rollTimer.current !== null) clearTimeout(rollTimer.current);
    rollTimer.current = null;
  };
  useEffect(() => cancelRoll, []);

  const rollDice = () => {
    if (rollTimer.current !== null) return;
    setIsRolling(true);
    // Choose the destination before the tumble so the final frame and result agree.
    setResult(Math.floor(Math.random() * selectedDie) + 1);

    rollTimer.current = setTimeout(() => {
      rollTimer.current = null;
      setIsRolling(false);
    }, reduceMotion ? 0 : ROLL_DURATION_MS);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-2 sm:p-4 gap-4 sm:gap-6">

      {/* Dice Display Area (Clickable) */}
      <button
        type="button"
        aria-label={`Roll d${selectedDie}`}
        aria-disabled={isRolling}
        onClick={rollDice}
        className="relative flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-neutral-100 border-3 border-black shadow-retro overflow-hidden cursor-pointer hover:bg-neutral-200 transition-colors active:scale-95 duration-100"
      >
        <div aria-hidden="true" className="w-full h-full pointer-events-none">
          <Die3D type={selectedDie} value={result} isRolling={isRolling} reduceMotion={reduceMotion} />
        </div>
      </button>

      {/* Die Selection - Below dice, consistent button sizing */}
      <div className="flex flex-nowrap justify-center gap-2 sm:gap-3 w-full">
        {[DieType.D4, DieType.D6, DieType.D8, DieType.D10].map((type) => (
          <RetroButton
            key={type}
            variant={selectedDie === type ? 'accent' : 'neutral'}
            aria-pressed={selectedDie === type}
            onClick={(e) => {
              e.stopPropagation();
              cancelRoll();
              setSelectedDie(type);
              setResult(1);
              setIsRolling(false);
            }}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
          >
            d{type}
          </RetroButton>
        ))}
      </div>

      {/* Instruction Text */}
      <p role="status" className="font-retro font-bold text-sm text-center">
        {isRolling ? 'ROLLING...' : `RESULT: ${result} · PRESS THE DICE TO ROLL`}
      </p>
    </div>
  );
};
