import { GAME_CONFIG } from "../config";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="screen">
      <div className="sketch-box">
        <p className="instructions">
          A caricature will be drawn over{" "}
          <strong>{GAME_CONFIG.totalTime} seconds</strong>.
        </p>
        <p className="instructions">Guess who it is as fast as you can!</p>
        <p className="instructions">
          You have <strong>{GAME_CONFIG.maxGuesses} guesses</strong>.
        </p>
        <p className="instructions points-info">
          <span className="pencil-icon">✏️</span> Faster guess = More points!
        </p>
      </div>
      <button className="sketch-btn" onClick={onStart}>
        Start Drawing!
      </button>
    </div>
  );
}
