import { useState, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { getBestMove } from '@/engine/chessAI';
import { AI_CONFIG } from '@/types/chess';
import type { Difficulty, GameStatus, CapturedPieces, PieceColor } from '@/types/chess';

function determineStatus(game: Chess): GameStatus {
  if (game.isCheckmate()) return 'checkmate';
  if (game.isStalemate()) return 'stalemate';
  if (game.isThreefoldRepetition()) return 'threefold';
  if (game.isInsufficientMaterial()) return 'insufficient';
  if (game.isDraw()) return 'draw';
  if (game.inCheck()) return 'check';
  return 'playing';
}

function getCapturedPieces(history: MoveEntryWithCaptured[]): CapturedPieces {
  const captured: CapturedPieces = { w: [], b: [] };
  for (const move of history) {
    if (move.captured) {
      // If white captured a piece, it goes to white's list (black piece captured)
      if (move.color === 'w') {
        captured.w.push(move.captured);
      } else {
        captured.b.push(move.captured);
      }
    }
  }
  return captured;
}

export interface MoveEntryWithCaptured {
  san: string;
  color: PieceColor;
  from: string;
  to: string;
  fen: string;
  captured?: string;
}

export function useChessGame() {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [history, setHistory] = useState<MoveEntryWithCaptured[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const syncState = useCallback(() => {
    const game = gameRef.current;
    setFen(game.fen());
    setStatus(determineStatus(game));

    const verboseHistory = game.history({ verbose: true });
    const moves: MoveEntryWithCaptured[] = verboseHistory.map((m) => ({
      san: m.san,
      color: m.color as 'w' | 'b',
      from: m.from,
      to: m.to,
      fen: m.after,
      captured: m.captured,
    }));
    setHistory(moves);
  }, []);

  const makeMove = useCallback(
    (from: string, to: string, promotion?: string): boolean => {
      const game = gameRef.current;
      try {
        const result = game.move({ from, to, promotion: promotion || 'q' });
        if (result) {
          setLastMove({ from, to });
          syncState();
          return true;
        }
      } catch {
        return false;
      }
      return false;
    },
    [syncState],
  );

  const makeAIMove = useCallback(() => {
    const game = gameRef.current;
    if (game.isGameOver()) return;

    setIsAIThinking(true);
    // Use setTimeout to let UI update before heavy computation
    setTimeout(() => {
      const config = AI_CONFIG[difficulty];
      const bestMove = getBestMove(game.fen(), config);
      if (bestMove) {
        game.move({
          from: bestMove.from,
          to: bestMove.to,
          promotion: bestMove.promotion || 'q',
        });
        setLastMove({ from: bestMove.from, to: bestMove.to });
      }
      syncState();
      setIsAIThinking(false);
    }, 300);
  }, [difficulty, syncState]);

  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string, piece?: string): boolean => {
      if (isAIThinking) return false;
      const game = gameRef.current;
      if (game.isGameOver()) return false;
      if (game.turn() !== 'w') return false;

      const isPromotion =
        piece &&
        piece.includes('P') &&
        targetSquare[1] === '8' &&
        sourceSquare[1] === '7';
      const promotion = isPromotion ? 'q' : undefined;

      const success = makeMove(sourceSquare, targetSquare, promotion);
      if (success) {
        makeAIMove();
      }
      return success;
    },
    [isAIThinking, makeMove, makeAIMove],
  );

  const newGame = useCallback(() => {
    gameRef.current = new Chess();
    setLastMove(null);
    setIsAIThinking(false);
    syncState();
  }, [syncState]);

  const undoMove = useCallback(() => {
    const game = gameRef.current;
    if (history.length === 0) return;
    // Undo both player and AI move
    game.undo();
    if (game.turn() === 'b' && game.history().length > 0) {
      game.undo();
    }
    setLastMove(null);
    setIsAIThinking(false);
    syncState();
  }, [history.length, syncState]);

  const capturedPieces = getCapturedPieces(history);

  const isPlayerTurn = gameRef.current.turn() === 'w' && !isAIThinking;

  return {
    fen,
    history,
    status,
    difficulty,
    isAIThinking,
    lastMove,
    capturedPieces,
    isPlayerTurn,
    onDrop,
    newGame,
    undoMove,
    setDifficulty,
    turn: gameRef.current.turn() as 'w' | 'b',
  };
}
