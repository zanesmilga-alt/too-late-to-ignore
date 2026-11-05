import * as lucide from "lucide";

// Lucide icon names in signals.json are kebab-case ("layout-grid"); the package exports PascalCase ("LayoutGrid").
type IconNode = [string, Record<string, string | number>][];

function toPascal(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

// Returns an inline SVG string, or "" when the name is unknown (the map still works without the icon).
export function iconSvg(name: string): string {
  const node = (lucide as unknown as Record<string, IconNode | undefined>)[toPascal(name)];
  if (!node) return "";
  const children = node
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .map(([k, v]) => `${k}="${String(v)}"`)
        .join(" ");
      return `<${tag} ${a}/>`;
    })
    .join("");
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${children}</svg>`;
}
