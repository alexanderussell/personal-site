/**
 * Generates static OG images (1200x630) with the generative logo aesthetic.
 * - og-default.png: Main site card
 * - og-vinyl.png: Vinyl experiment subdomain card
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';

const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#0c0a09';

// Embed PP Mondwest as base64 for SVG rendering
const mondwestPath = 'public/fonts/PPMondwest-Regular.otf';
const mondwestBase64 = readFileSync(mondwestPath).toString('base64');
const fontFace = `
  @font-face {
    font-family: 'PPMondwest';
    src: url('data:font/otf;base64,${mondwestBase64}') format('opentype');
  }`;

// Same palette as GenerativeLogo.astro
const PALETTE = [
  { r: 200, g: 42, b: 40 },   // red
  { r: 220, g: 172, b: 22 },  // gold
  { r: 30, g: 90, b: 195 },   // blue
  { r: 18, g: 160, b: 120 },  // green
];

function generatePlane(cx, cy, size, rotation, color, opacity) {
  const rad = (rotation * Math.PI) / 180;
  const hw = size / 2;
  const hh = size / 2;
  const corners = [
    [-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]
  ].map(([x, y]) => [
    cx + x * Math.cos(rad) - y * Math.sin(rad),
    cy + x * Math.sin(rad) + y * Math.cos(rad),
  ]);
  return `<polygon points="${corners.map(p => p.join(',')).join(' ')}"
    fill="rgba(${color.r},${color.g},${color.b},${opacity})" />`;
}

// Shared color planes composition
function colorPlanes(cx, cy) {
  const planes = [];
  planes.push(generatePlane(cx - 80, cy - 20, 340, -12, PALETTE[0], 0.55));
  planes.push(generatePlane(cx + 60, cy + 10, 320, 25, PALETTE[1], 0.50));
  planes.push(generatePlane(cx - 30, cy + 30, 300, -35, PALETTE[2], 0.55));
  planes.push(generatePlane(cx + 20, cy - 40, 280, 8, PALETTE[3], 0.45));
  planes.push(generatePlane(cx + 120, cy - 60, 180, 45, PALETTE[0], 0.3));
  planes.push(generatePlane(cx - 140, cy + 50, 200, -20, PALETTE[1], 0.25));
  planes.push(generatePlane(cx + 40, cy + 80, 160, 55, PALETTE[2], 0.3));
  return planes.join('\n    ');
}

// ─── Default OG ───
const defaultSvg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <style>${fontFace}</style>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />
  <g style="mix-blend-mode: screen;">
    ${colorPlanes(WIDTH / 2, HEIGHT / 2 - 40)}
  </g>
  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 175}"
    text-anchor="middle"
    font-family="PPMondwest"
    font-size="52"
    fill="#efe5d5"
    letter-spacing="2">Alex Russell</text>
  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 215}"
    text-anchor="middle"
    font-family="'Courier New', monospace"
    font-size="14"
    fill="#7a6a5a"
    letter-spacing="4">DESIGN ENGINEER</text>
</svg>`;

// ─── Vinyl OG ───
function vinylDisc(cx, cy, r) {
  // Simplified vinyl record with grooves and label
  const grooves = [0.35, 0.45, 0.55, 0.65, 0.75, 0.85].map(pct =>
    `<circle cx="${cx}" cy="${cy}" r="${r * pct}" fill="none" stroke="rgba(50,50,50,0.3)" stroke-width="0.5" />`
  ).join('\n    ');

  return `
    <!-- Vinyl disc -->
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#111" />
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#vinylGrad)" opacity="0.6" />
    ${grooves}
    <!-- Label -->
    <circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="#2a1c10" />
    <circle cx="${cx}" cy="${cy}" r="${r * 0.22}"
      fill="url(#labelGrad)" />
    <text x="${cx}" y="${cy + 5}"
      text-anchor="middle"
      font-family="Georgia, serif"
      font-size="18"
      font-style="italic"
      fill="rgba(180,140,80,0.6)"
      letter-spacing="3">DR</text>
    <!-- Spindle -->
    <circle cx="${cx}" cy="${cy}" r="4" fill="#0a0a0a" />
    <!-- Sheen -->
    <circle cx="${cx}" cy="${cy}" r="${r}"
      fill="url(#sheen)" opacity="0.15" />`;
}

const vinylSvg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <style>${fontFace}</style>
  <defs>
    <radialGradient id="vinylGrad" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#1a1a1a" />
      <stop offset="50%" stop-color="#0d0d0d" />
      <stop offset="100%" stop-color="#1a1a1a" />
    </radialGradient>
    <radialGradient id="labelGrad" cx="40%" cy="40%">
      <stop offset="0%" stop-color="#3a2a1a" />
      <stop offset="100%" stop-color="#1a1008" />
    </radialGradient>
    <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="transparent" />
      <stop offset="40%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="60%" stop-color="transparent" />
      <stop offset="100%" stop-color="transparent" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />

  <!-- Subtle warm glow behind disc -->
  <circle cx="420" cy="${HEIGHT / 2}" r="280"
    fill="rgba(180,120,60,0.04)" />

  ${vinylDisc(420, HEIGHT / 2, 220)}

  <!-- Text block -->
  <text x="780" y="${HEIGHT / 2 - 50}"
    text-anchor="middle"
    font-family="PPMondwest"
    font-size="38"
    fill="#efe5d5"
    letter-spacing="1">Ask My Dad's</text>
  <text x="780" y="${HEIGHT / 2}"
    text-anchor="middle"
    font-family="PPMondwest"
    font-size="38"
    fill="#efe5d5"
    letter-spacing="1">Record Collection</text>

  <line x1="710" y1="${HEIGHT / 2 + 25}" x2="850" y2="${HEIGHT / 2 + 25}"
    stroke="#4a3a2a" stroke-width="1" />

  <text x="780" y="${HEIGHT / 2 + 55}"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="15"
    font-style="italic"
    fill="#7a6a5a">Tell it your mood. It'll pull the right record.</text>

  <text x="780" y="${HEIGHT / 2 + 90}"
    text-anchor="middle"
    font-family="'Courier New', monospace"
    font-size="11"
    fill="#5a4a3a"
    letter-spacing="3">THE COLLECTION OF DANIEL RUSSELL</text>
</svg>`;

await Promise.all([
  sharp(Buffer.from(defaultSvg)).png().toFile('public/images/og-default.png'),
  sharp(Buffer.from(vinylSvg)).png().toFile('public/images/og-vinyl.png'),
]);

console.log('✓ Generated OG images: og-default.png, og-vinyl.png');
