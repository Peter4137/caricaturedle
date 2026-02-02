import { useEffect, useRef } from "react";
import type { Caricature } from "../types";

interface ResultScreenProps {
  caricature: Caricature;
  hasWon: boolean;
  score: number;
  onPlayAgain: () => void;
}

export function ResultScreen({
  caricature,
  hasWon,
  score,
  onPlayAgain,
}: ResultScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Seek to end to show completed caricature
      video.currentTime = 9999;
    }
  }, []);

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
        <div className="result-score">
          Score: <span className="points">{score}</span> points
        </div>
      </div>
      <button className="sketch-btn" onClick={onPlayAgain}>
        Draw Another!
      </button>
    </div>
  );
}
