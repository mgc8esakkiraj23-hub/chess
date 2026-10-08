import { Crown, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import type { Difficulty } from '@/types/chess';

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  isAIThinking: boolean;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const DIFFICULTY_ICONS: Record<Difficulty, string> = {
  easy: '🟢',
  medium: '🟡',
  hard: '🔴',
};

export default function GameControls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onUndo,
  canUndo,
  isAIThinking,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-amber-200/80 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          AI Difficulty
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                difficulty === d
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40 scale-105'
                  : 'bg-stone-800/60 text-stone-400 hover:bg-stone-700/60 hover:text-stone-200'
              }`}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onNewGame}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-sm hover:from-amber-500 hover:to-amber-600 transition-all duration-200 shadow-lg shadow-amber-900/30 hover:scale-[1.02] active:scale-95"
        >
          <Crown className="w-4 h-4" />
          New Game
        </button>
        <button
          onClick={onUndo}
          disabled={!canUndo || isAIThinking}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-stone-800/60 text-stone-300 font-semibold text-sm hover:bg-stone-700/60 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Undo
        </button>
      </div>
    </div>
  );
}
