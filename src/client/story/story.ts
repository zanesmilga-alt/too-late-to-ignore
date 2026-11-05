import { actFor, pad } from "../../shared/content";
import type { Signal, Stat } from "../../shared/types";
import { ART, base, rng } from "../art/motifs";

// The 1920x1080 design size. Art is drawn at this size and scaled by CSS, so it stays sharp at any screen.
const W = 1920;
const H = 1080;

export type StoryHandle = {
  el: HTMLElement;
  show(signal: Signal, index: number, total: number): void;
};

function drawArt(canvas: HTMLCanvasElement, signal: Signal): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const r = rng(signal.id);
  base(ctx, W, H, r);
  const motif = signal.art ? ART[signal.art] : undefined;
  (motif ?? ART.network)(ctx, W, H, r);
}

const FRESH_LABEL: Record<Stat["fresh"], string> = {
  checked: "Checked Nov 2026",
  deck: "June deck · verify",
};

function statEl(stat: Stat): string {
  return `<li class="stat">
      <span class="stat-tag stat-${stat.fresh}">${FRESH_LABEL[stat.fresh]}</span>
      <span class="stat-value">${stat.value}</span>
      <span class="stat-label">${stat.label}</span>
    </li>`;
}

function escape(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
}

// The story view: full-bleed visual, title, hook, three stats, the customer angle, sources.
// The explorer also shows the longer story text (body.explore .story-text); the stage does not.
export function renderStory(): StoryHandle {
  const el = document.createElement("section");
  el.className = "story";
  el.setAttribute("aria-labelledby", "story-title");
  el.innerHTML = `
    <div class="story-visual"></div>
    <div class="story-wash" aria-hidden="true"></div>
    <div class="story-main">
      <p class="kicker story-kicker"></p>
      <div class="tags"><span class="tag story-status"></span><span class="tag tag-new story-new" hidden>New since June</span></div>
      <h1 class="story-title" id="story-title"></h1>
      <p class="hook"></p>
      <p class="story-text"></p>
    </div>
    <ul class="stats" aria-label="Key figures"></ul>
    <aside class="why" aria-labelledby="why-title">
      <h2 class="why-title" id="why-title">Why it matters for our customers</h2>
      <p class="why-text"></p>
    </aside>
    <footer class="sources">
      <p class="sources-label">Sources</p>
      <ul class="sources-list"></ul>
    </footer>`;

  const visual = el.querySelector<HTMLElement>(".story-visual")!;
  const kicker = el.querySelector<HTMLElement>(".story-kicker")!;
  const status = el.querySelector<HTMLElement>(".story-status")!;
  const isNew = el.querySelector<HTMLElement>(".story-new")!;
  const title = el.querySelector<HTMLElement>(".story-title")!;
  const hook = el.querySelector<HTMLElement>(".hook")!;
  const story = el.querySelector<HTMLElement>(".story-text")!;
  const stats = el.querySelector<HTMLElement>(".stats")!;
  const why = el.querySelector<HTMLElement>(".why-text")!;
  const sources = el.querySelector<HTMLElement>(".sources-list")!;

  function show(s: Signal, index: number, total: number): void {
    const act = actFor(s);
    kicker.textContent = `${pad(s.n)} / ${pad(total)} · ${act.lens}`;
    status.textContent = s.status;
    isNew.hidden = !s.isNew;
    title.textContent = s.title;
    hook.textContent = s.hook;
    story.textContent = s.story;
    stats.innerHTML = s.stats.map(statEl).join("");
    why.textContent = s.why;
    sources.innerHTML = s.sources
      .map((src) =>
        src.url
          ? `<li><a href="${escape(src.url)}" target="_blank" rel="noopener">${escape(src.title)}</a></li>`
          : `<li>${escape(src.title)}</li>`,
      )
      .join("");

    visual.replaceChildren();
    if (s.image) {
      const img = document.createElement("img");
      img.src = `/${s.image}`;
      img.alt = "";
      img.decoding = "async";
      visual.append(img);
    } else {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", `Illustration for ${s.title}`);
      drawArt(canvas, s);
      visual.append(canvas);
    }
    el.dataset.index = String(index);
  }

  return { el, show };
}
