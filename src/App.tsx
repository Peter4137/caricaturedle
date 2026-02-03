import { useState, useCallback } from "react";
import { StartScreen } from "./components/StartScreen";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";
import { CARICATURES, GAME_CONFIG } from "./config";
import type { Caricature, Screen } from "./types";
import "./App.css";

function getRandomCaricature(): Caricature {
  if (CARICATURES.length === 0) {
    return { video: "", answer: "Unknown", alternateAnswers: [] };
  }
  return CARICATURES[Math.floor(Math.random() * CARICATURES.length)];
}

function calculateScore(timeRemaining: number): number {
  return Math.round(
    GAME_CONFIG.maxPoints * (timeRemaining / GAME_CONFIG.totalTime),
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentCaricature, setCurrentCaricature] = useState<Caricature | null>(
    null,
  );
  const [hasWon, setHasWon] = useState(false);
  const [score, setScore] = useState(0);
  const [guessesUsed, setGuessesUsed] = useState(0);

  const handleStart = useCallback(() => {
    const caricature = getRandomCaricature();
    setCurrentCaricature(caricature);
    setHasWon(false);
    setScore(0);
    setGuessesUsed(0);
    setScreen("game");
  }, []);

  const handleWin = useCallback((timeRemaining: number, guesses: number) => {
    setHasWon(true);
    setScore(calculateScore(timeRemaining));
    setGuessesUsed(guesses);
    setScreen("result");
  }, []);

  const handleLose = useCallback((guesses: number) => {
    setHasWon(false);
    setScore(0);
    setGuessesUsed(guesses);
    setScreen("result");
  }, []);

  const handlePlayAgain = useCallback(() => {
    setScreen("start");
  }, []);

  return (
    <div className="paper-bg">
      <div className="container">
        <header>
          <h1 className="title">Caricaturedle</h1>
          <p className="subtitle">Guess the face before it's finished!</p>
        </header>

        {screen === "start" && <StartScreen onStart={handleStart} />}

        {screen === "game" && currentCaricature && (
          <GameScreen
            key={currentCaricature.video} // Force remount on new game
            caricature={currentCaricature}
            onWin={handleWin}
            onLose={handleLose}
          />
        )}

        {screen === "result" && currentCaricature && (
          <ResultScreen
            caricature={currentCaricature}
            hasWon={hasWon}
            score={score}
            guessesUsed={guessesUsed}
            onPlayAgain={handlePlayAgain}
          />
        )}

        <footer>
          <p className="footer-text">~ sketched with love ~</p>
        </footer>
      </div>
    </div>
  );
}
