// Shapes of content/signals.json. The presenter edits that file; the code never hard-codes a signal.

export type Fresh = "checked" | "deck";

export type Stat = {
  value: string;
  label: string;
  fresh: Fresh;
};

export type Source = {
  title: string;
  url?: string;
};

export type Guess = {
  question: string;
  min: number;
  max: number;
  unit: string;
  answer: number;
  answerLabel: string;
  source: string;
};

export type Signal = {
  id: string;
  n: number;
  act: string;
  title: string;
  short: string;
  status: "Now" | "Scaling" | "Emerging";
  isNew: boolean;
  icon: string;
  image: string | null;
  art: string | null;
  hook: string;
  why: string;
  story: string;
  stats: Stat[];
  guess: Guess;
  hotTake: string;
  sources: Source[];
};

export type Act = {
  id: string;
  lens: string;
  title: string;
  sub: string;
};

export type Content = {
  title: string;
  session: string;
  updated: string;
  heroImage: string;
  pitch: string;
  acts: Act[];
  warmup: { question: string; options: string[] };
  signals: Signal[];
};
