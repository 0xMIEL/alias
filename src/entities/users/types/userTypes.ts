export interface IUser {
    email: string;
    password: string;
    username: string;
    roundsTotal: number;
    scores: Array<{ team: number; score: number }>;
  }

  export type IUserUpdate = Partial<
  Omit<IUser, 'teamSize' | 'timePerRound' | 'roundsTotal'>
>;