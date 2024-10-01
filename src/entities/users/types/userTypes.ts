export interface IUser {
    email: string;
    password: string;
    username: string;
    roundsTotal: number;
    scores: Array<{ team: number; score: number }>;
  }