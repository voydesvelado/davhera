export type MatchStatus = "upcoming" | "live" | "halftime" | "finished";

export interface Team {
  name: string;
  code: string;
  flag: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  score: { home: number; away: number };
  status: MatchStatus;
  minute: number;
}

export interface Option {
  id: string;
  label: string;
}

export type QuestionType = "prediction" | "tactical" | "fun";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
}

export type Answers = Record<string, string>;

export interface WindowInfo {
  type: "halftime" | "preMatch" | "fullTime";
  endsAt: number;
}

export interface StoredState {
  v: 1;
  answers: Answers;
  currentIndex: number;
}
