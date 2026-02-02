# Charicaturedle

A sketch-styled guessing game where players watch a caricature being drawn and try to guess who it is before time runs out!

Built with React + TypeScript + Vite.

## How to Play

1. Click **Start Drawing!** to begin
2. Watch as a caricature is drawn over 60 seconds
3. Type your guess and hit **Guess!** (or press Enter)
4. You have **5 guesses** - use them wisely!
5. The faster you guess correctly, the more points you earn

## Scoring

- Maximum score: **1000 points** (instant correct guess)
- Points decrease linearly as time passes
- If the video finishes before you guess: **0 points**

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Videos

Place your timelapse caricature videos in the `public/videos/` folder. Supported formats: MP4, WebM.

### 3. Configure the Game

Edit `src/config.ts` and update the `CARICATURES` array with your videos:

```typescript
export const CARICATURES: Caricature[] = [
  {
    video: "/videos/elon-musk.mp4",
    answer: "Elon Musk",
    alternateAnswers: ["musk", "elon"],
  },
  {
    video: "/videos/taylor-swift.mp4",
    answer: "Taylor Swift",
    alternateAnswers: ["taylor", "swift"],
  },
  // Add more...
];
```

- `video`: Path relative to public folder (starts with `/`)
- `answer`: The correct answer (displayed on result screen)
- `alternateAnswers`: Array of acceptable variations (case-insensitive)

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

## Video Notes

- Videos are automatically scaled to play over 60 seconds regardless of their actual duration
- Videos are rotated 90° clockwise (to correct the original orientation)
- Recommended video dimensions: Square or portrait work best

## Project Structure

```
src/
├── components/
│   ├── StartScreen.tsx    # Welcome screen
│   ├── GameScreen.tsx     # Main gameplay
│   └── ResultScreen.tsx   # Win/lose results
├── types/
│   └── index.ts           # TypeScript interfaces
├── config.ts              # Game configuration & caricature data
├── App.tsx                # Main app component
├── App.css                # Sketch-style theme
└── index.css              # Base styles
```

## Deployment

Build and deploy the `dist/` folder to any static hosting:

- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

Make sure the `videos/` folder is included in your deployment.

## License

MIT
