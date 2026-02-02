import { useEffect, useRef, useState, useCallback } from "react";
import type { Caricature } from "../types";
import { GAME_CONFIG } from "../config";

interface GameScreenProps {
  caricature: Caricature;
  onWin: (timeRemaining: number, guessesUsed: number) => void;
  onLose: (guessesUsed: number) => void;
}

const WRONG_GUESS_MESSAGES = [
  "Nope, keep looking!",
  "Not quite...",
  "Try again!",
  "Who else could it be?",
  "Look closer!",
  "Hmm, not that one...",
  "The pencil reveals more...",
];

export function GameScreen({ caricature, onWin, onLose }: GameScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(GAME_CONFIG.totalTime);
  const [guessesRemaining, setGuessesRemaining] = useState(
    GAME_CONFIG.maxGuesses,
  );
  const [guessHistory, setGuessHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "wrong" | "hint";
  } | null>(null);
  const [inputValue, setInputValue] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);
  const gameEndedRef = useRef(false);
  const guessesUsedRef = useRef(0);

  // Start timer and video
  useEffect(() => {
    gameEndedRef.current = false;
    guessesUsedRef.current = 0;

    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (!gameEndedRef.current) {
            gameEndedRef.current = true;
            onLose(guessesUsedRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onLose]);

  // Set up video playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadata = () => {
      const videoDuration = video.duration;
      video.playbackRate = videoDuration / GAME_CONFIG.totalTime;
      video.play().catch((err) => {
        console.log("Video autoplay prevented:", err);
      });
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    return () => video.removeEventListener("loadedmetadata", handleMetadata);
  }, [caricature.video]);

  const checkAnswer = useCallback(
    (guess: string): boolean => {
      const normalizedGuess = guess.toLowerCase().trim();
      const correctAnswer = caricature.answer.toLowerCase();
      const alternates = caricature.alternateAnswers.map((a) =>
        a.toLowerCase(),
      );

      return (
        normalizedGuess === correctAnswer ||
        alternates.includes(normalizedGuess)
      );
    },
    [caricature],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const guess = inputValue.trim().toLowerCase();

    if (!guess) {
      setFeedback({ message: "Type something first!", type: "hint" });
      return;
    }

    if (guessHistory.includes(guess)) {
      setFeedback({ message: "You already tried that one!", type: "hint" });
      return;
    }

    setGuessHistory((prev) => [...prev, guess]);
    setInputValue("");
    guessesUsedRef.current += 1;

    if (checkAnswer(guess)) {
      gameEndedRef.current = true;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onWin(timeRemaining, guessesUsedRef.current);
    } else {
      const newGuessesRemaining = guessesRemaining - 1;
      setGuessesRemaining(newGuessesRemaining);

      if (newGuessesRemaining <= 0) {
        gameEndedRef.current = true;
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        onLose(guessesUsedRef.current);
      } else {
        const randomMessage =
          WRONG_GUESS_MESSAGES[
            Math.floor(Math.random() * WRONG_GUESS_MESSAGES.length)
          ];
        setFeedback({ message: randomMessage, type: "wrong" });
      }
    }
  };

  return (
    <div className="screen">
      <div className="game-header">
        <div className="timer-container">
          <span className="timer-label">Time:</span>
          <span className={`timer ${timeRemaining <= 10 ? "warning" : ""}`}>
            {timeRemaining}
          </span>
        </div>
        <div className="guesses-container">
          <span className="guesses-label">Guesses:</span>
          <span className="guesses">{guessesRemaining}</span>
        </div>
      </div>

      <div className="video-container">
        <div className="video-frame">
          <video ref={videoRef} src={caricature.video} muted playsInline />
        </div>
      </div>

      <form className="guess-section" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your guess..."
            autoComplete="off"
            autoFocus
          />
          <button type="submit" className="sketch-btn small">
            Guess!
          </button>
        </div>
        {feedback && (
          <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
        )}
        <div className="guess-history">
          {guessHistory.map((guess, index) => (
            <span
              key={index}
              className="guess-item"
              style={
                {
                  "--rotation": `${Math.random() * 4 - 2}deg`,
                } as React.CSSProperties
              }
            >
              {guess}
            </span>
          ))}
        </div>
      </form>
    </div>
  );
}
