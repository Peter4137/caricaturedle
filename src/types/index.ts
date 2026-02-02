export interface Caricature {
  video: string;
  answer: string;
  alternateAnswers: string[];
}

export interface GameState {
  currentCaricature: Caricature | null;
  timeRemaining: number;
  guessesRemaining: number;
  guessHistory: string[];
  isPlaying: boolean;
  hasWon: boolean;
  score: number;
}

export type Screen = "start" | "game" | "result";

export interface GameConfig {
  totalTime: number;
  maxGuesses: number;
  maxPoints: number;
}
