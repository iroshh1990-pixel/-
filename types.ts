
export enum GameType {
  SYLLABLES = 'SYLLABLES',
  INITIAL_SOUND = 'INITIAL_SOUND',
  RHYMES = 'RHYMES',
}

export interface GameQuestion {
  id: string;
  type: GameType;
  word: string;
  instruction: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
}

export interface GameLevel {
  id: number;
  title: string;
  description: string;
  questions: GameQuestion[];
}

export interface UserStats {
  score: number;
  completedLevels: number[];
}
