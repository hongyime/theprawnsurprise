import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { RetroButton } from '../ui/RetroButton';
import { sanitizeInput } from '../../utils/sanitizer';
import { SpinnerItem } from '../../types';

// Theme colors for slices
const SLICE_COLORS = ['#FFFFFF', '#A3A3A3', '#000000', '#E5E5E5', '#525252'];

// Helper to assign colors ensuring no adjacent duplicates
const assignColors = (items: SpinnerItem[]): SpinnerItem[] => {
  const newItems = items.map(i => ({ ...i }));

  for (let i = 0; i < newItems.length; i++) {
    let pool = [...SLICE_COLORS];

    // Constraint 1: Cannot match previous item
    if (i > 0) {
      pool = pool.filter(c => c !== newItems[i - 1].color);
    }

    // Constraint 2: Last item cannot match first item (if more than 1 item)
    if (i === newItems.length - 1 && newItems.length > 1) {
      pool = pool.filter(c => c !== newItems[0].color);
    }

    // Fallback: If pool is empty (shouldn't happen with 5 colors), use random
    newItems[i].color = pool[0] || SLICE_COLORS[0];
  }
  return newItems;
};

export const ChaosWheel: React.FC = () => {
  const [items, setItems] = useState<SpinnerItem[]>(assignColors([
    { id: '1', label: 'Yes', color: '' },
    { id: '2', label: 'No', color: '' },
  ]));
  const [inputValue, setInputValue] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const controls = useAnimation();
  const rotationRef = useRef(0);
  const spinGeneration = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => () => {
    spinGeneration.current += 1;
    controls.stop();
  }, [controls]);

  const handleAddItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isSpinning || items.length >= 10) return;

    const cleanLabel = sanitizeInput(inputValue);
    if (cleanLabel.length > 0) {
      const newItem = {
        id: Date.now().toString(),
        label: cleanLabel,
        color: '' // Will be assigned by assignColors
      };

      const updatedList = [...items, newItem];
      setItems(assignColors(updatedList));
      setInputValue('');
      setResult(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (isSpinning) return;
    const filtered = items.filter(i => i.id !== id);
    setItems(assignColors(filtered));
    setResult(null);
  };

  const handleSpin = async () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setResult(null);
    const generation = ++spinGeneration.current;

    // Random rotations: at least 5 full spins (1800 deg) + random offset
    const randomOffset = Math.random() * 360;
    const totalRotation = 1800 + randomOffset;

    // We add to the current rotation so it spins forward continuously
    const targetRotation = rotationRef.current + totalRotation;

    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: reduceMotion ? 0.01 : 4,
        ease: [0.15, 0.85, 0.35, 1] // Custom cubic bezier for realistic slowdown
      }
    });

    if (generation !== spinGeneration.current) return;
    rotationRef.current = targetRotation;
    const pointerAngle = (360 - targetRotation % 360) % 360;
    setResult(items[Math.floor(pointerAngle / 360 * items.length)].label);
    setIsSpinning(false);
  };

  // Build Conic Gradient
  const gradient = `conic-gradient(
    ${items.map((item, index) => {
    const start = (index / items.length) * 100;
    const end = ((index + 1) / items.length) * 100;
    return `${item.color} ${start}% ${end}%`;
  }).join(', ')}
  )`;

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center w-full min-w-0 max-w-4xl mx-auto gap-8 py-4">

      {/* Wheel Section */}
      <div className="flex flex-col items-center w-full lg:w-1/2">
        <div className="relative w-full max-w-64 sm:max-w-80 aspect-square mb-8">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-black drop-shadow-md"></div>
          </div>

          {/* Wheel - Clickable to spin */}
          <button
            type="button"
            aria-label="Spin the wheel"
            aria-disabled={isSpinning || items.length < 2}
            onClick={handleSpin}
            className="block w-full h-full rounded-full border-3 border-black shadow-retro overflow-hidden relative cursor-pointer"
          >
          <motion.div
            data-wheel-face
            animate={controls}
            className="w-full h-full relative rounded-full overflow-hidden"
            style={{ background: items.length > 0 ? gradient : '#333' }}
          >
            {/* Slice Labels */}
            {items.length > 0 && items.map((item, i) => {
              // Calculate center angle of the slice
              const angle = (360 / items.length) * i + (360 / items.length) / 2;
              const isLight = ['#FFFFFF', '#A3A3A3', '#E5E5E5'].includes(item.color);

              return (
                <div
                  key={item.id}
                  // Container acts as the "spoke" from center to edge.
                  // h-[50%] is radius length.
                  // We rotate it by (angle + 180) because top:50% origin-top points to 6 o'clock (180deg).
                  // Adding 180 aligns it with the calculated angle.
                  className="absolute top-1/2 left-1/2 h-[50%] w-8 -translate-x-1/2 origin-top flex justify-center pt-8 pb-4 pointer-events-none"
                  style={{ transform: `rotate(${angle + 180}deg)` }}
                >
                  {/* 
                             Use writing-mode: vertical-rl to handle text layout properly along the radius.
                           */}
                  <span
                    className="block truncate text-center font-bold text-xs sm:text-sm max-h-[90%] w-full"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      color: isLight ? 'black' : 'white',
                      textShadow: isLight ? 'none' : '1px 1px 0px rgba(0,0,0,0.5)'
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              )
            })}
          </motion.div>
          </button>
        </div>

        {/* Instruction Text */}
        <p role="status" className="font-retro font-bold text-sm text-center">
          {isSpinning ? 'SPINNING...' : result ? `RESULT: ${result}` : items.length < 2 ? 'ADD AT LEAST 2 OPTIONS' : 'PRESS THE WHEEL TO SPIN'}
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col w-full min-w-0 lg:w-1/2 bg-neutral-100 border-3 border-black p-3 sm:p-4 shadow-retro">
        <h2 className="font-retro font-bold text-sm mb-4 text-center">CHAOS OPTIONS ({items.length}/10)</h2>

        <form onSubmit={handleAddItem} className="flex gap-2 mb-4 w-full">
          <input
            type="text"
            aria-label="New wheel option"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={items.length >= 10 || isSpinning}
            placeholder={items.length >= 10 ? "Max reached" : "Add option..."}
            className="flex-1 min-w-0 bg-white text-black font-sans px-2 sm:px-3 py-2 border-3 border-black text-sm"
          />
          <RetroButton type="submit" disabled={items.length >= 10 || isSpinning || !inputValue.trim()} className="shrink-0 px-2 sm:px-4">
            ADD
          </RetroButton>
        </form>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white/10 p-2 border border-black/20 hover:border-black transition-colors">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-4 h-4 rounded-full border border-black shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="truncate text-sm font-medium">{item.label}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                disabled={isSpinning}
                className="text-black hover:bg-white disabled:opacity-50 p-3"
                aria-label={`Delete ${item.label}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-sm opacity-50 py-4">Add items to spin!</p>}
        </div>
      </div>
    </div>
  );
};
