import type { CapturedPieces } from '@/types/chess';

interface CapturedPiecesDisplayProps {
  captured: CapturedPieces;
}

const PIECE_UNICODE: Record<string, { w: string; b: string }> = {
  p: { w: '♙', b: '♟' },
  n: { w: '♘', b: '♞' },
  b: { w: '♗', b: '♝' },
  r: { w: '♖', b: '♜' },
  q: { w: '♕', b: '♛' },
  k: { w: '♔', b: '♚' },
};

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

function calculateAdvantage(captured: CapturedPieces) {
  let whiteValue = 0;
  let blackValue = 0;

  // captured.w = pieces white has captured (black pieces)
  captured.w.forEach((p) => (whiteValue += PIECE_VALUES[p] || 0));
  // captured.b = pieces black has captured (white pieces)
  captured.b.forEach((p) => (blackValue += PIECE_VALUES[p] || 0));

  return { whiteValue, blackValue, diff: whiteValue - blackValue };
}

export default function CapturedPiecesDisplay({
  captured,
}: CapturedPiecesDisplayProps) {
  const { whiteValue, blackValue, diff } = calculateAdvantage(captured);

  const whiteCaptured = [...captured.w].sort(
    (a, b) => PIECE_VALUES[b] - PIECE_VALUES[a],
  );
  const blackCaptured = [...captured.b].sort(
    (a, b) => PIECE_VALUES[b] - PIECE_VALUES[a],
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Black's captured pieces (white pieces black took) */}
      <div className="flex items-center gap-1 min-h-[28px] flex-wrap">
        <span className="text-xs text-stone-500 font-medium mr-1">Black took:</span>
        {blackCaptured.length === 0 ? (
          <span className="text-xs text-stone-600">—</span>
        ) : (
          blackCaptured.map((piece, i) => (
            <span
              key={i}
              className="text-xl leading-none text-stone-100"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              {PIECE_UNICODE[piece]?.w}
            </span>
          ))
        )}
        {diff < 0 && (
          <span className="text-xs text-stone-400 font-bold ml-1">
            +{Math.abs(diff)}
          </span>
        )}
      </div>

      {/* White's captured pieces (black pieces white took) */}
      <div className="flex items-center gap-1 min-h-[28px] flex-wrap">
        <span className="text-xs text-stone-500 font-medium mr-1">White took:</span>
        {whiteCaptured.length === 0 ? (
          <span className="text-xs text-stone-600">—</span>
        ) : (
          whiteCaptured.map((piece, i) => (
            <span
              key={i}
              className="text-xl leading-none text-stone-900"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              {PIECE_UNICODE[piece]?.b}
            </span>
          ))
        )}
        {diff > 0 && (
          <span className="text-xs text-stone-400 font-bold ml-1">+{diff}</span>
        )}
      </div>
    </div>
  );
}
