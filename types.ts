export interface MusicPiece {
  composer: string;
  title: string;
  youtubeId: string;
  week: string;
  keyPoint?: string;
  youtubeStartTime?: number;
}

export enum GameState {
  Start = 'START',
  Playing = 'PLAYING',
  Feedback = 'FEEDBACK',
  Finished = 'FINISHED',
}

export interface Feedback {
  isCorrect: boolean;
  correctPiece: MusicPiece;
  feedbackMessage: string;
}
