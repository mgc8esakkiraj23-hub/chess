import { useChessGame } from '@/hooks/useChessGame';
import ChessBoard from '@/components/ChessBoard';
import GameControls from '@/components/GameControls';
import GameStatusBanner from '@/components/GameStatus';
import CapturedPiecesDisplay from '@/components/CapturedPieces';
import MoveHistory from '@/components/MoveHistory';

export default function ChessGame() {
  const {
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
    turn,
  } = useChessGame();

  const isGameOver =
    status === 'checkmate' ||
    status === 'stalemate' ||
    status === 'draw' ||
    status === 'threefold' ||
    status === 'insufficient';

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-800/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-4xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
              ♚
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent tracking-tight">
              Chess Master
            </h1>
            <span className="text-4xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
              ♛
            </span>
          </div>
          <p className="text-stone-400 text-sm">
            Play against the AI — drag pieces or click to move
          </p>
        </header>

        {/* Game layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
          {/* Left side — board + captured pieces */}
          <div className="flex flex-col gap-3 items-center w-full lg:w-auto">
            {/* Top captured (black pieces taken by white) */}
            <div className="w-full max-w-[600px] bg-stone-900/50 border border-stone-800/50 rounded-xl px-4 py-2.5">
              <CapturedPiecesDisplay captured={capturedPieces} />
            </div>

            <ChessBoard
              fen={fen}
              lastMove={lastMove}
              onDrop={onDrop}
              isPlayerTurn={isPlayerTurn}
            />

            {/* Game status below board */}
            <div className="w-full max-w-[600px]">
              <GameStatusBanner
                status={status}
                turn={turn}
                isAIThinking={isAIThinking}
              />
            </div>
          </div>

          {/* Right side — controls + history */}
          <div className="flex flex-col gap-5 w-full lg:w-80">
            {/* Game over overlay message */}
            {isGameOver && (
              <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-700/40 rounded-xl p-4 text-center">
                <button
                  onClick={newGame}
                  className="text-amber-200 font-semibold text-sm hover:text-amber-100 transition-colors"
                >
                  Click here to start a new game →
                </button>
              </div>
            )}

            <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5 flex flex-col gap-4">
              <GameControls
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                onNewGame={newGame}
                onUndo={undoMove}
                canUndo={history.length > 0}
                isAIThinking={isAIThinking}
              />
            </div>

            <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-5">
              <MoveHistory history={history} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-6 text-stone-600 text-xs">
          Built with React, chess.js & react-chessboard
        </footer>
      </div>
    </div>
  );
}
