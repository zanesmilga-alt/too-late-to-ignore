// The keyboard help overlay, opened with "?". Phase 1 keys only; presenter keys are added with their phases.
const KEYS: [string, string][] = [
  ["→  ←", "Next or previous signal. On the map, move between signals."],
  ["Enter", "Open the focused signal."],
  ["Esc", "Back to the map."],
  ["M", "Go to the map."],
  ["?", "Show or hide this help."],
];

let overlay: HTMLElement | null = null;
let returnFocus: HTMLElement | null = null;

function build(): HTMLElement {
  const el = document.createElement("div");
  el.className = "help";
  el.hidden = true;
  el.innerHTML = `
    <div class="help-card" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <h2 class="help-title" id="help-title">Keys</h2>
      <dl class="help-keys">
        ${KEYS.map(([k, d]) => `<div><dt>${k}</dt><dd>${d}</dd></div>`).join("")}
      </dl>
      <p class="help-close">Press Esc or ? to close.</p>
    </div>`;
  el.addEventListener("click", (e) => {
    if (e.target === el) closeHelp();
  });
  document.body.append(el);
  return el;
}

export function helpIsOpen(): boolean {
  return !!overlay && !overlay.hidden;
}

export function openHelp(): void {
  overlay ??= build();
  returnFocus = document.activeElement as HTMLElement | null;
  overlay.hidden = false;
}

export function closeHelp(): void {
  if (!overlay || overlay.hidden) return;
  overlay.hidden = true;
  returnFocus?.focus({ preventScroll: true });
}

export function toggleHelp(): void {
  if (helpIsOpen()) closeHelp();
  else openHelp();
}
