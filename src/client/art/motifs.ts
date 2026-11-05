// Generated artwork for the 15 signals without a photo.
// Ported from prototype.html (the ART object and its helpers). Same motifs, same palette.
// Each motif draws onto a 2D canvas at any size; coordinates are proportional to w and h.

export type Ctx = CanvasRenderingContext2D;
export type Rng = () => number;
export type Motif = (ctx: Ctx, w: number, h: number, r: Rng) => void;

export function rng(seed: string): Rng { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const ORANGE = "#F07A2E", HI = "#FFD2A8", DIM = "rgba(240,122,46,.28)";
export function base(ctx: Ctx, w: number, h: number, r: Rng): void {
  const g = ctx.createRadialGradient(w * .7, h * .35, 10, w * .6, h * .5, w * .9);
  g.addColorStop(0, "#3A1A10"); g.addColorStop(.45, "#140F26"); g.addColorStop(1, "#080C1E");
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(240,122,46,.07)"; ctx.lineWidth = 1;
  const step = w / 18;
  for (let x = 0; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,210,168,${r() * .35})`; ctx.fillRect(r() * w, r() * h, 1.5, 1.5); }
}
export function glow(ctx: Ctx, c: string, b: number): void { ctx.shadowColor = c; ctx.shadowBlur = b; }
export function noGlow(ctx: Ctx): void { ctx.shadowBlur = 0; }
export function star(ctx: Ctx, x: number, y: number, R: number): void { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * .45 : R; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); }
export const ART: Record<string, Motif> = {
  network(ctx: Ctx, w: number, h: number, r: Rng): void {
    const pts = Array.from({length: 22}, () => [w * (.08 + r() * .84), h * (.1 + r() * .8)]);
    ctx.lineWidth = 1.2;
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j <= i) return; const d = Math.hypot(a[0]-b[0], a[1]-b[1]); if (d < w * .24) { ctx.strokeStyle = `rgba(240,122,46,${.65 - d / (w * .4)})`; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }));
    glow(ctx, ORANGE, 14);
    pts.forEach((p, i) => { ctx.fillStyle = i % 5 === 0 ? HI : ORANGE; ctx.beginPath(); ctx.arc(p[0], p[1], i % 5 === 0 ? w * .016 : w * .008, 0, 7); ctx.fill(); });
    noGlow(ctx);
  },
  molecules(ctx: Ctx, w: number, _h: number, r: Rng): void {
    const R = w * .06; ctx.lineWidth = 2;
    for (let row = -1; row < 7; row++) for (let col = -1; col < 10; col++) {
      if (r() < .45) continue;
      const x = col * R * 1.73 + (row % 2) * R * .87, y = row * R * 1.5;
      ctx.strokeStyle = r() < .2 ? HI : DIM; ctx.beginPath();
      for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; ctx.lineTo(x + Math.cos(a) * R * .95, y + Math.sin(a) * R * .95); }
      ctx.closePath(); ctx.stroke();
      if (r() < .3) { glow(ctx, ORANGE, 12); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(x, y - R * .95, w * .009, 0, 7); ctx.fill(); noGlow(ctx); }
    }
  },
  orbit(ctx: Ctx, w: number, h: number, r: Rng): void {
    const cx = w * .62, cy = h * .5;
    for (let i = 1; i <= 5; i++) { ctx.strokeStyle = `rgba(240,122,46,${.55 - i * .08})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cx, cy, w * .09 * i, h * .08 * i, -.35, 0, 7); ctx.stroke();
      const a = r() * 7; glow(ctx, ORANGE, 14); ctx.fillStyle = i === 3 ? HI : ORANGE; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * w * .09 * i, cy + Math.sin(a) * h * .08 * i, w * .011, 0, 7); ctx.fill(); noGlow(ctx); }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * .08); g.addColorStop(0, HI); g.addColorStop(1, "rgba(240,122,46,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, w * .08, 0, 7); ctx.fill();
  },
  ripples(ctx: Ctx, w: number, h: number): void {
    const cx = w * .5, cy = h * .55;
    for (let i = 1; i <= 9; i++) { ctx.strokeStyle = `rgba(240,122,46,${.7 - i * .07})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, w * .045 * i, 0, 7); ctx.stroke(); }
    ctx.lineWidth = 3; glow(ctx, ORANGE, 16); ctx.strokeStyle = HI;
    const bw = w * .5, bh = h * .12; ctx.beginPath(); ctx.roundRect(cx - bw / 2, h * .2 - bh / 2, bw, bh, bh / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + bw / 2 - bh * .55, h * .2, bh * .22, 0, 7); ctx.stroke(); noGlow(ctx);
    ctx.setLineDash([4, 8]); ctx.strokeStyle = DIM; ctx.beginPath(); ctx.moveTo(cx, h * .2 + bh / 2); ctx.lineTo(cx, cy); ctx.stroke(); ctx.setLineDash([]);
  },
  lenses(ctx: Ctx, w: number, h: number): void {
    const R = w * .16, y = h * .52;
    [w * .32, w * .68].forEach((x, i) => {
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.clip();
      for (let k = -R; k < R; k += 7) { ctx.strokeStyle = `rgba(240,122,46,${.15 + .3 * Math.abs(Math.sin(k * .05 + i))})`; ctx.beginPath(); ctx.moveTo(x - R, y + k); ctx.lineTo(x + R, y + k); ctx.stroke(); }
      ctx.restore();
      glow(ctx, ORANGE, 18); ctx.strokeStyle = HI; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.stroke(); noGlow(ctx);
    });
    ctx.strokeStyle = HI; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(w * .5, y - R * .1, w * .045, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.fillStyle = ORANGE; glow(ctx, ORANGE, 20); ctx.beginPath(); ctx.arc(w * .68 + R * .35, y - R * .35, w * .014, 0, 7); ctx.fill(); noGlow(ctx);
  },
  waves(ctx: Ctx, w: number, h: number): void {
    for (let k = 0; k < 2; k++) { glow(ctx, ORANGE, 14); ctx.strokeStyle = k ? HI : ORANGE; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = 0; x <= w; x += 4) ctx.lineTo(x, h * .5 + Math.sin(x / w * Math.PI * 3 + k * Math.PI) * h * .22 * Math.sin(x / w * Math.PI)); ctx.stroke(); noGlow(ctx); }
    for (let i = 1; i < 6; i++) { ctx.strokeStyle = `rgba(240,122,46,${.25 - i * .03})`; ctx.lineWidth = 1; ctx.beginPath();
      for (let x = 0; x <= w; x += 4) ctx.lineTo(x, h * .5 + Math.sin(x / w * Math.PI * 3 + i * .5) * h * (.22 + i * .04) * Math.sin(x / w * Math.PI)); ctx.stroke(); }
  },
  hub(ctx: Ctx, w: number, h: number): void {
    const cx = w * .5, cy = h * .5, n = 8;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, x = cx + Math.cos(a) * w * .32, y = cy + Math.sin(a) * h * .34, s = w * .065;
      ctx.strokeStyle = DIM; ctx.lineWidth = 1.5; ctx.setLineDash([3, 6]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, 8); ctx.stroke(); }
    glow(ctx, ORANGE, 30); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(cx, cy, w * .07, 0, 7); ctx.fill(); ctx.fillStyle = HI; ctx.beginPath(); ctx.arc(cx, cy, w * .03, 0, 7); ctx.fill(); noGlow(ctx);
  },
  ladder(ctx: Ctx, w: number, h: number): void {
    const x1 = w * .4, x2 = w * .6; ctx.lineWidth = 4; glow(ctx, ORANGE, 12); ctx.strokeStyle = ORANGE;
    ctx.beginPath(); ctx.moveTo(x1, h * .04); ctx.lineTo(x1, h * .96); ctx.moveTo(x2, h * .04); ctx.lineTo(x2, h * .96); ctx.stroke();
    for (let i = 0; i < 9; i++) { const y = h * (.1 + i * .1); if (i >= 6) { ctx.strokeStyle = "rgba(240,122,46,.25)"; ctx.setLineDash([5, 7]); ctx.lineWidth = 2; } else { ctx.strokeStyle = i === 0 ? HI : ORANGE; ctx.setLineDash([]); ctx.lineWidth = 4; }
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); }
    ctx.setLineDash([]); noGlow(ctx);
    ctx.fillStyle = "rgba(255,210,168,.6)"; for (let i = 0; i < 14; i++) { ctx.fillRect(w * (.42 + Math.sin(i) * .08), h * (.72 + i * .02), 6, 3); }
  },
  tiers(ctx: Ctx, w: number, h: number): void {
    const n = 4, bw = w * .13, gap = w * .05, x0 = (w - (n * bw + (n - 1) * gap)) / 2;
    for (let i = 0; i < n; i++) { const bh = h * (.18 + i * .17), x = x0 + i * (bw + gap), y = h * .88 - bh;
      const g = ctx.createLinearGradient(0, y, 0, h * .88); g.addColorStop(0, i === n - 1 ? HI : ORANGE); g.addColorStop(1, "rgba(240,122,46,.08)");
      ctx.fillStyle = g; if (i === n - 1) glow(ctx, ORANGE, 24); ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 8); ctx.fill(); noGlow(ctx); }
    ctx.strokeStyle = HI; ctx.lineWidth = 3; const lx = x0 - w * .02, ly = h * .78; ctx.beginPath(); ctx.roundRect(lx - w * .05, ly - h * .02, w * .06, h * .1, 4); ctx.stroke(); ctx.beginPath(); ctx.arc(lx - w * .02, ly - h * .02, w * .02, Math.PI, 0); ctx.stroke();
  },
  falling(ctx: Ctx, w: number, h: number): void {
    const n = 9, bw = w * .065, gap = w * .03, x0 = w * .08;
    for (let i = 0; i < n; i++) { const bh = h * (.75 - i * .075) * (i === 4 ? .6 : 1), x = x0 + i * (bw + gap), y = h * .9 - bh;
      ctx.fillStyle = i < 3 ? "rgba(240,122,46,.85)" : `rgba(240,122,46,${.6 - i * .05})`; ctx.fillRect(x, y, bw, bh); }
    glow(ctx, ORANGE, 16); ctx.strokeStyle = HI; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w * .1, h * .12); ctx.lineTo(w * .45, h * .3); ctx.lineTo(w * .55, h * .24); ctx.lineTo(w * .9, h * .66); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w * .9, h * .66); ctx.lineTo(w * .86, h * .56); ctx.moveTo(w * .9, h * .66); ctx.lineTo(w * .8, h * .66); ctx.stroke(); noGlow(ctx);
  },
  rising(ctx: Ctx, w: number, h: number, r: Rng): void {
    const pts = []; let y = h * .8; for (let i = 0; i <= 12; i++) { y -= h * (.02 + r() * .06) - (i === 5 ? -h * .08 : 0); pts.push([w * (.06 + i * .073), Math.max(h * .12, y)]); }
    const g = ctx.createLinearGradient(0, h * .1, 0, h); g.addColorStop(0, "rgba(240,122,46,.45)"); g.addColorStop(1, "rgba(240,122,46,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(pts[0][0], h); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(pts[pts.length - 1][0], h); ctx.fill();
    glow(ctx, ORANGE, 16); ctx.strokeStyle = HI; ctx.lineWidth = 3.5; ctx.beginPath(); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.stroke();
    const last = pts[pts.length - 1]; ctx.fillStyle = HI; ctx.beginPath(); ctx.arc(last[0], last[1], w * .016, 0, 7); ctx.fill(); noGlow(ctx);
  },
  layers(ctx: Ctx, w: number, h: number): void {
    const cx = w * .5, s = w * .26;
    for (let i = 4; i >= 0; i--) { const y = h * .28 + i * h * .13;
      ctx.beginPath(); ctx.moveTo(cx, y - s * .32); ctx.lineTo(cx + s, y); ctx.lineTo(cx, y + s * .32); ctx.lineTo(cx - s, y); ctx.closePath();
      ctx.fillStyle = i === 0 ? "rgba(240,122,46,.9)" : `rgba(20,15,38,.92)`; ctx.fill();
      if (i === 0) glow(ctx, ORANGE, 24); ctx.strokeStyle = i === 0 ? HI : ORANGE; ctx.lineWidth = 2; ctx.stroke(); noGlow(ctx); }
  },
  bolt(ctx: Ctx, w: number, h: number): void {
    const hz = h * .45; ctx.strokeStyle = "rgba(240,122,46,.35)"; ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(w * .5, hz); ctx.lineTo(w * .5 + i * w * .12, h); ctx.stroke(); }
    for (let k = 1; k < 8; k++) { const y = hz + (h - hz) * Math.pow(k / 8, 1.8); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    glow(ctx, ORANGE, 30); ctx.fillStyle = HI;
    ctx.beginPath(); ctx.moveTo(w * .56, h * .06); ctx.lineTo(w * .4, h * .5); ctx.lineTo(w * .5, h * .5); ctx.lineTo(w * .43, h * .9); ctx.lineTo(w * .62, h * .4); ctx.lineTo(w * .52, h * .4); ctx.lineTo(w * .6, h * .06); ctx.closePath(); ctx.fill(); noGlow(ctx);
  },
  stars(ctx: Ctx, w: number, h: number): void {
    const cx = w * .5, cy = h * .5, R = Math.min(w, h) * .34;
    ctx.strokeStyle = DIM; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; glow(ctx, ORANGE, 12); ctx.fillStyle = i % 3 === 0 ? HI : ORANGE; star(ctx, cx + Math.cos(a) * R, cy + Math.sin(a) * R, w * .028); ctx.fill(); noGlow(ctx); }
    ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy - R * .5); ctx.lineTo(cx, cy + R * .45); ctx.moveTo(cx - R * .45, cy - R * .3); ctx.lineTo(cx + R * .45, cy - R * .3); ctx.stroke();
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(cx + d * R * .45, cy, R * .16, 0, Math.PI); ctx.stroke(); });
  },
  ecg(ctx: Ctx, w: number, h: number): void {
    const y0 = h * .55; glow(ctx, ORANGE, 18); ctx.strokeStyle = HI; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(0, y0);
    const beat = (x: number) => { ctx.lineTo(x, y0); ctx.lineTo(x + w * .03, y0 - h * .06); ctx.lineTo(x + w * .05, y0); ctx.lineTo(x + w * .08, y0); ctx.lineTo(x + w * .1, y0 + h * .1); ctx.lineTo(x + w * .13, y0 - h * .4); ctx.lineTo(x + w * .16, y0 + h * .18); ctx.lineTo(x + w * .19, y0); };
    beat(w * .08); beat(w * .45); ctx.lineTo(w * .8, y0); ctx.stroke(); noGlow(ctx);
    ctx.fillStyle = HI; glow(ctx, ORANGE, 24); ctx.beginPath(); ctx.arc(w * .8, y0, w * .015, 0, 7); ctx.fill(); noGlow(ctx);
    ctx.strokeStyle = "rgba(240,122,46,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(w * .8, y0); ctx.lineTo(w, y0); ctx.stroke();
  }
};
