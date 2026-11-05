import { BY_ID, SIGNALS } from "../shared/content";
import { renderMap, type MapHandle } from "./map/map";
import { renderStory, type StoryHandle } from "./story/story";
import { closeHelp, helpIsOpen, toggleHelp } from "./ui/help";

export type Mode = "stage" | "explore";

const ZOOM_MS = 600;
const STEP_MS = 250;
const EASE = "cubic-bezier(.6, 0, .2, 1)";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const narrow = window.matchMedia("(max-width: 900px)");

// Shared by /stage and /explore: one map, one story view, one set of keys.
export function startApp(mode: Mode): void {
  document.body.classList.add(mode);
  const canvas = document.getElementById("canvas");
  if (!canvas) throw new Error("Missing #canvas");

  let current: string | null = null;
  let lastNode: HTMLButtonElement | null = null;
  let running: Animation[] = [];

  const map: MapHandle = renderMap((id, node) => open(id, node));
  const story: StoryHandle = renderStory();
  story.el.hidden = true;
  canvas.append(map.el, story.el);

  // Scale the 1920x1080 design to fit the window. Narrow screens use the normal page flow instead (CSS).
  function fit(): void {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    canvas!.style.setProperty("--s", s.toFixed(4));
  }
  fit();
  window.addEventListener("resize", fit);

  function cancelRunning(): void {
    running.forEach((a) => a.cancel());
    running = [];
  }

  function duration(): number {
    return reduceMotion.matches ? 0 : ZOOM_MS;
  }

  // Zoom from a map node into the story: the map zooms past the node, the story grows out of it.
  function setOrigin(el: HTMLElement, node: HTMLElement | null): void {
    if (!node) return;
    const box = el.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    const x = ((r.left + r.width / 2 - box.left) / box.width) * 100;
    const y = ((r.top + r.height / 2 - box.top) / box.height) * 100;
    el.style.transformOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
  }

  function setHash(id: string | null): void {
    const url = id ? `#${id}` : location.pathname + location.search;
    history.replaceState(null, "", url);
  }

  function open(id: string, node?: HTMLButtonElement): void {
    const s = BY_ID[id];
    if (!s) return;
    const index = SIGNALS.indexOf(s);
    const fromMap = current === null;
    cancelRunning();
    if (node) lastNode = node;
    current = id;
    setHash(id);
    story.show(s, index, SIGNALS.length);

    if (!fromMap) {
      story.el.hidden = false;
      animateStep();
      return;
    }

    story.el.hidden = false;
    if (narrow.matches || reduceMotion.matches || !node) {
      map.el.hidden = true;
      return;
    }
    setOrigin(map.el, node);
    setOrigin(story.el, node);
    const d = duration();
    const a = map.el.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(2.4)" },
      ],
      { duration: d, easing: EASE, fill: "forwards" },
    );
    const b = story.el.animate(
      [
        { opacity: 0, transform: "scale(0.94)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: d, easing: EASE },
    );
    running = [a, b];
    a.finished
      .then(() => {
        map.el.hidden = true;
        cancelRunning();
      })
      .catch(() => undefined);
  }

  function close(): void {
    if (current === null) return;
    cancelRunning();
    current = null;
    setHash(null);
    map.el.hidden = false;
    if (narrow.matches || reduceMotion.matches) {
      story.el.hidden = true;
    } else {
      setOrigin(map.el, lastNode);
      setOrigin(story.el, lastNode);
      const d = duration();
      map.el.animate(
        [
          { opacity: 0, transform: "scale(1.8)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        { duration: d, easing: EASE },
      );
      const b = story.el.animate(
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(1.06)" },
        ],
        { duration: d, easing: EASE, fill: "forwards" },
      );
      b.finished.then(() => (story.el.hidden = true)).catch(() => undefined);
    }
    lastNode?.focus({ preventScroll: true });
  }

  // Next or previous signal, with a short fade. Does not zoom.
  function step(delta: number): void {
    if (current === null) return;
    const i = SIGNALS.findIndex((s) => s.id === current) + delta;
    if (i < 0 || i >= SIGNALS.length) return;
    const s = SIGNALS[i];
    current = s.id;
    setHash(s.id);
    story.show(s, i, SIGNALS.length);
    animateStep();
  }

  function animateStep(): void {
    if (reduceMotion.matches) return;
    story.el.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: STEP_MS, easing: "ease-out" });
  }

  // Arrow keys move between nodes on the map and between signals in a story.
  function moveFocus(delta: number): void {
    const nodes = map.nodes();
    const active = document.activeElement as HTMLButtonElement | null;
    const i = active ? nodes.indexOf(active) : -1;
    const next = nodes[Math.min(nodes.length - 1, Math.max(0, (i < 0 ? 0 : i) + delta))];
    next?.focus();
  }

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (helpIsOpen()) {
      if (e.key === "Escape" || e.key === "?") {
        e.preventDefault();
        closeHelp();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        if (current !== null) {
          e.preventDefault();
          close();
        }
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        if (current !== null) step(1);
        else moveFocus(1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        if (current !== null) step(-1);
        else moveFocus(-1);
        break;
      case "m":
      case "M":
        close();
        break;
      case "?":
        e.preventDefault();
        toggleHelp();
        break;
    }
  });

  document.getElementById("help-open")?.addEventListener("click", () => toggleHelp());

  // A signal can be opened directly from its link (#id), for example after a reload.
  const fromHash = location.hash.slice(1);
  if (fromHash && BY_ID[fromHash]) open(fromHash);
}
