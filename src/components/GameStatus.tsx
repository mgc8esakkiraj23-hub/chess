import type { GameStatus, PieceColor } from '@/types/chess';
import { Loader2, AlertTriangle, Check, Trophy } from 'lucide-react';

interface GameStatusProps {
  status: GameStatus;
  turn: PieceColor;
  isAIThinking: boolean;
}

const STATUS_MESSAGES: Record<GameStatus, { text: string; winner?: string }> = {
  playing: { text: '' },
  check: { text: 'Check!' },
  checkmate: { text: 'Checkmate!' },
  stalemate: { text: 'Stalemate — Draw' },
  draw: { text: 'Draw' },
  threefold: { text: 'Threefold Repetition — Draw' },
  insufficient: { text: 'Insufficient Material — Draw' },
};

export default function GameStatusBanner({ status, turn, isAIThinking }: GameStatusProps) {
  const isGameOver =
    status === 'checkmate' ||
    status === 'stalemate' ||
    status === 'draw' ||
    status === 'threefold' ||
    status === 'insufficient';

  if (isGameOver) {
    const msg = STATUS_MESSAGES[status];
    const isCheckmate = status === 'checkmate';
    const winner = isCheckmate ? (turn === 'w' ? 'Black' : 'White') : null;

    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm ${
          isCheckmate
            ? 'bg-gradient-to-r from-amber-900/50 to-amber-800/30 text-amber-200 border border-amber-700/40'
            : 'bg-stone-800/60 text-stone-300 border border-stone-700/40'
        }`}
      >
        {isCheckmate ? (
          <>
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>
              Checkmate! {winner} wins!
            </span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-stone-400" />
            <span>{msg.text}</span>
          </>
        )}
      </div>
    );
  }

  if (status === 'check') {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-red-900/40 text-red-300 border border-red-800/40">
        <AlertTriangle className="w-5 h-5" />
        <span>Check! {turn === 'w' ? 'White' : 'Black'} must respond.</span>
      </div>
    );
  }

  if (isAIThinking) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-stone-800/60 text-stone-400 border border-stone-700/40">
        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
        <span>AI is thinking...</span>
      </div>
    );
  }

  const isPlayerTurn = turn === 'w';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm ${
        isPlayerTurn
          ? 'bg-stone-800/60 text-amber-200 border border-amber-800/30'
          : 'bg-stone-800/60 text-stone-400 border border-stone-700/40'
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full ${
          isPlayerTurn ? 'bg-amber-400 animate-pulse' : 'bg-stone-500'
        }`}
      />
      <span>
        {isPlayerTurn ? 'Your move (White)' : "AI's move (Black)"}
      </span>
    </div>
  );
}
