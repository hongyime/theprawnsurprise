import React, { useState } from 'react';
import { Tab } from './types';
import { DiceRoller } from './components/Dice/DiceRoller';
import { ChaosWheel } from './components/Spinner/ChaosWheel';
import { Magic8Ball } from './components/MagicBall/Magic8Ball';
import { cn } from './components/ui/RetroButton';
import { Dices, Disc, Sparkles } from 'lucide-react';
import { MotionConfig } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DICE);

  return (
    <MotionConfig reducedMotion="user"><div className="min-h-screen bg-white text-black flex flex-col items-center">

      {/* Header */}
      <header className="w-full border-b-3 border-black px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <a href="https://theprawnprojects.hong-yi.me" className="inline-block font-bold text-xs tracking-widest underline underline-offset-4 mb-5">THE PRAWN PROJECTS ↗</a>
          <h1 className="font-retro font-bold text-3xl sm:text-5xl tracking-tight leading-tight">
            THE PRAWN SURPRISE <span className="text-neutral-500">?!</span>
          </h1>
          <p className="mt-3 text-neutral-600">Roll the dice. Let the wheel decide. Ask the unknown.</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav aria-label="Choose a surprise" className="w-full max-w-4xl mx-auto mt-8 px-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <TabButton
            isActive={activeTab === Tab.DICE}
            onClick={() => setActiveTab(Tab.DICE)}
            icon={<Dices aria-hidden="true" className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />}
            label="DICE ROLL"
          />
          <TabButton
            isActive={activeTab === Tab.SPINNER}
            onClick={() => setActiveTab(Tab.SPINNER)}
            icon={<Disc aria-hidden="true" className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />}
            label="CHAOS WHEEL"
          />
          <TabButton
            isActive={activeTab === Tab.MAGIC_BALL}
            onClick={() => setActiveTab(Tab.MAGIC_BALL)}
            icon={<Sparkles aria-hidden="true" className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />}
            label="8-BALL"
          />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 mb-12">
        <div className="bg-white border-3 border-black p-3 sm:p-8 shadow-retro min-h-[400px] flex items-center justify-center relative">

          {activeTab === Tab.DICE && <DiceRoller />}
          {activeTab === Tab.SPINNER && <ChaosWheel />}
          {activeTab === Tab.MAGIC_BALL && <Magic8Ball />}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-neutral-600 text-xs font-retro font-bold">
        <p>BUILT WITH 🦐 POWER</p>
      </footer>
    </div></MotionConfig>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        "min-h-12 flex flex-col sm:flex-row gap-1 sm:gap-0 items-center justify-center px-1 sm:px-4 py-2 sm:py-3 font-retro font-bold text-[10px] sm:text-sm border-3 border-black transition-all whitespace-nowrap",
        isActive
          ? "bg-black text-white shadow-none translate-y-1 z-10 relative"
          : "bg-white text-black shadow-retro hover:bg-gray-100 hover:translate-y-[2px] hover:shadow-retro-active"
      )}
    >
      {icon}
      {label}
    </button>
  );
};

export default App;
