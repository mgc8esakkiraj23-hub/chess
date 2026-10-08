import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';

interface ChessBoardProps {
  fen: string;
  lastMove: { from: string; to: string } | null;
  onDrop: (sourceSquare: string, targetSquare: string, piece?: string) => boolean;
  isPlayerTurn: boolean;
}

const lightSquareBg = '#f0d9b5';
const darkSquareBg = '#b58863';
const highlightColor = 'rgba(255, 255, 51, 0.5)';
const lastMoveColor = 'rgba(255, 255, 51, 0.3)';

export default function ChessBoard({
  fen,
  lastMove,
  onDrop,
  isPlayerTurn,
}: ChessBoardProps) {
  const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const getMoveOptions = useCallback(
    (square: string) => {
      const game = new Chess(fen);
      const moves = game.moves({ square: square as Square, verbose: true });

      if (moves.length === 0) {
        setOptionSquares({});
        setSelectedSquare(null);
        return;
      }

      const newSquares: Record<string, React.CSSProperties> = {};
      moves.forEach((move) => {
        if (move.flags.includes('c') || move.flags.includes('e')) {
          newSquares[move.to] = {
            background: 'radial-gradient(circle, rgba(0,0,0,0.1) 35%, transparent 36%)',
            borderRadius: '50%',
          };
        } else {
          newSquares[move.to] = {
            background: 'radial-gradient(circle, rgba(0,0,0,0.1) 25%, transparent 26%)',
            borderRadius: '50%',
          };
        }
      });
      newSquares[square] = { background: highlightColor };
      setOptionSquares(newSquares);
      setSelectedSquare(square);
    },
    [fen],
  );

  const onSquareClick = useCallback(
    (square: string) => {
      if (!isPlayerTurn) return;

      if (selectedSquare && selectedSquare !== square) {
        const game = new Chess(fen);
        const moves = game.moves({ square: selectedSquare as Square, verbose: true });
        const validMove = moves.find((m) => m.to === (square as Square));

        if (validMove) {
          setOptionSquares({});
          setSelectedSquare(null);
          onDrop(selectedSquare, square, undefined);
          return;
        }
      }

      getMoveOptions(square);
    },
    [isPlayerTurn, selectedSquare, fen, getMoveOptions, onDrop],
  );

  const handlePieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string, piece?: string) => {
      setOptionSquares({});
      setSelectedSquare(null);
      return onDrop(sourceSquare, targetSquare, piece);
    },
    [onDrop],
  );

  const customSquareStyles: Record<string, React.CSSProperties> = {};

  if (lastMove) {
    customSquareStyles[lastMove.from] = { background: lastMoveColor };
    customSquareStyles[lastMove.to] = { background: lastMoveColor };
  }

  const allStyles = { ...customSquareStyles, ...optionSquares };

  return (
    <div className="w-full max-w-[600px] select-none">
      <Chessboard
        position={fen}
        onPieceDrop={handlePieceDrop}
        onSquareClick={onSquareClick}
        customBoardStyle={{
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }}
        customLightSquareStyle={{ backgroundColor: lightSquareBg }}
        customDarkSquareStyle={{ backgroundColor: darkSquareBg }}
        customSquareStyles={allStyles}
        animationDuration={200}
        boardOrientation="white"
        arePiecesDraggable={isPlayerTurn}
      />
    </div>
  );
}
