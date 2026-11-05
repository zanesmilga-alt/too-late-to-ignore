import { ACTS, SIGNALS } from "../../shared/content";
import type { Signal } from "../../shared/types";
import { iconSvg } from "../ui/icons";

export type MapHandle = {
  el: HTMLElement;
  nodeFor(id: string): HTMLButtonElement | undefined;
  nodes(): HTMLButtonElement[];
};

// The map: six act clusters, one node per signal. Layout is CSS grid (see app.css).
export function renderMap(onOpen: (id: string, node: HTMLButtonElement) => void): MapHandle {
  const el = document.createElement("section");
  el.className = "map";
  el.setAttribute("aria-label", "Signal map");

  const head = document.createElement("header");
  head.className = "map-head";
  head.innerHTML = `
    <div>
      <p class="kicker">Too Late To Ignore · 25 signals</p>
      <h1 class="map-title">Six acts of AI change</h1>
    </div>
    <p class="legend"><span class="dot-new" aria-hidden="true"></span> New since June · Select a signal to read it</p>`;
  el.append(head);

  const grid = document.createElement("div");
  grid.className = "acts";
  el.append(grid);

  const byAct = new Map<string, Signal[]>();
  for (const s of SIGNALS) byAct.set(s.act, [...(byAct.get(s.act) ?? []), s]);

  const buttons = new Map<string, HTMLButtonElement>();

  for (const act of ACTS) {
    const items = byAct.get(act.id) ?? [];
    const card = document.createElement("article");
    card.className = "act";
    card.setAttribute("aria-labelledby", `act-${act.id}`);
    // Two columns for up to eight signals keeps every cluster at two rows or fewer.
    card.style.setProperty("--cols", String(Math.min(4, Math.max(1, Math.ceil(items.length / 2)))));

    const h = document.createElement("header");
    h.className = "act-head";
    h.innerHTML = `<p class="act-lens">${act.lens}</p><h2 class="act-title" id="act-${act.id}">${act.title}</h2>`;
    card.append(h);

    const nodes = document.createElement("div");
    nodes.className = "nodes";
    for (const s of items) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "node";
      b.dataset.id = s.id;
      b.title = s.title;
      b.setAttribute("aria-label", `${s.n}. ${s.title}`);
      b.innerHTML = `
        <span class="node-icon">${iconSvg(s.icon)}${s.isNew ? '<span class="dot-new" aria-hidden="true"></span>' : ""}</span>
        <span class="node-label">${s.short}</span>`;
      b.addEventListener("click", () => onOpen(s.id, b));
      nodes.append(b);
      buttons.set(s.id, b);
    }
    card.append(nodes);
    grid.append(card);
  }

  return {
    el,
    nodeFor: (id) => buttons.get(id),
    nodes: () => SIGNALS.map((s) => buttons.get(s.id)).filter((b): b is HTMLButtonElement => !!b),
  };
}
