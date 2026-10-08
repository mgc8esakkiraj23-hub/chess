export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus =
  | 'playing'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw'
  | 'threefold'
  | 'insufficient';

export type PieceColor = 'w' | 'b';

export interface CapturedPieces {
  w: string[];
  b: string[];
}

export interface MoveEntry {
  san: string;
  color: PieceColor;
  from: string;
  to: string;
  fen: string;
}

export interface AIDifficultyConfig {
  depth: number;
  randomness: number;
}

export const AI_CONFIG: Record<Difficulty, AIDifficultyConfig> = {
  easy: { depth: 1, randomness: 0.4 },
  medium: { depth: 3, randomness: 0.1 },
  hard: { depth: 4, randomness: 0 },
};
