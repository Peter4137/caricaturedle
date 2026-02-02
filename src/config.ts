import type { Caricature, GameConfig } from "./types";

export const GAME_CONFIG: GameConfig = {
  totalTime: 60,
  maxGuesses: 5,
  maxPoints: 1000,
};

// Add your caricatures here
// video: path relative to public folder
// answer: the correct answer (shown on result screen)
// alternateAnswers: acceptable variations (case-insensitive)
export const CARICATURES: Caricature[] = [
  {
    video: "/videos/caricature1.mp4",
    answer: "Elon Musk",
    alternateAnswers: ["musk", "elon"],
  },
  {
    video: "/videos/caricature2.mp4",
    answer: "Taylor Swift",
    alternateAnswers: ["taylor", "swift", "t swift"],
  },
  {
    video: "/videos/caricature3.mp4",
    answer: "Donald Trump",
    alternateAnswers: ["trump", "donald"],
  },
  // Add more caricatures here...
];
