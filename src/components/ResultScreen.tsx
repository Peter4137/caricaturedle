import { useEffect, useRef, useState } from "react";
import type { Caricature } from "../types";
import { GAME_CONFIG } from "../config";

interface ResultScreenProps {
  caricature: Caricature;
  hasWon: boolean;
  score: number;
  guessesUsed: number;
  onPlayAgain: () => void;
}

function generateShareText(
  hasWon: boolean,
  guessesUsed: number,
  score: number,
): string {
  const maxGuesses = GAME_CONFIG.maxGuesses;

  // Generate guess boxes - filled for used, empty for remaining
  const filledBox = "✏️";
  const emptyBox = "⬜";
  const failBox = "❌";

  let boxes: string;
  if (hasWon) {
    boxes =
      filledBox.repeat(guessesUsed) + emptyBox.repeat(maxGuesses - guessesUsed);
  } else {
    boxes = failBox.repeat(Math.min(guessesUsed, maxGuesses));
    if (guessesUsed < maxGuesses) {
      boxes += emptyBox.repeat(maxGuesses - guessesUsed);
    }
  }

  const resultText = hasWon
    ? `${guessesUsed}/${maxGuesses}`
    : "X/" + maxGuesses;

  return `Caricaturedle ${resultText}

${boxes}
Score: ${score}/${GAME_CONFIG.maxPoints}

Play at: caricaturedle.com`;
}

export function ResultScreen({
  caricature,
  hasWon,
  score,
  guessesUsed,
  onPlayAgain,
}: ResultScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Seek to end to show completed caricature
      video.currentTime = 9999;
    }
  }, []);

  const handleShare = async () => {
    const shareText = generateShareText(hasWon, guessesUsed, score);

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="screen">
      <div className="result-box">
        <h2 className={`result-title ${hasWon ? "win" : "lose"}`}>
          {hasWon ? "✓ You got it!" : "✗ Time's up!"}
        </h2>
        <div className="result-portrait">
          <video ref={videoRef} src={caricature.video} muted playsInline />
        </div>
        <p className="result-answer">It was {caricature.answer}!</p>
        <div className="result-stats">
          <div className="stat">
            <span className="stat-label">Guesses</span>
            <span className="stat-value">
              {guessesUsed}/{GAME_CONFIG.maxGuesses}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
        </div>
        <div className="share-preview">
          {hasWon
            ? "✏️".repeat(guessesUsed) +
              "⬜".repeat(GAME_CONFIG.maxGuesses - guessesUsed)
            : "❌".repeat(Math.min(guessesUsed, GAME_CONFIG.maxGuesses)) +
              "⬜".repeat(Math.max(0, GAME_CONFIG.maxGuesses - guessesUsed))}
        </div>
        <button className="share-btn" onClick={handleShare}>
          {copied ? "Copied!" : "Share Result"}
        </button>
      </div>
      <button className="sketch-btn" onClick={onPlayAgain}>
        Draw Another!
      </button>
    </div>
  );
}
