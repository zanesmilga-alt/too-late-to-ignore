import contentJson from "../../content/signals.json";
import type { Act, Content, Signal } from "./types";

const content = contentJson as unknown as Content;

// Signals grouped by act, in the order of the acts in signals.json. Numbers run 01–25 across the whole list.
export const ACTS: Act[] = content.acts;

export const SIGNALS: Signal[] = ACTS.flatMap((act) => content.signals.filter((s) => s.act === act.id)).map(
  (s, i) => ({ ...s, n: i + 1 }),
);

export const BY_ID: Record<string, Signal> = Object.fromEntries(SIGNALS.map((s) => [s.id, s]));

export const SITE = { title: content.title, session: content.session, pitch: content.pitch, heroImage: content.heroImage };

export function actFor(signal: Signal): Act {
  const act = ACTS.find((a) => a.id === signal.act);
  if (!act) throw new Error(`Signal ${signal.id} points to unknown act ${signal.act}`);
  return act;
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
