/**
 * Generates a static OG image (1200x630) with the generative logo aesthetic:
 * overlapping rotated color planes on a dark background.
 */
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#0c0a09';

// Same palette as GenerativeLogo.astro
const PALETTE = [
  { r: 200, g: 42, b: 40 },   // red
  { r: 220, g: 172, b: 22 },  // gold
  { r: 30, g: 90, b: 195 },   // blue
  { r: 18, g: 160, b: 120 },  // green
];

function generatePlane(cx, cy, size, rotation, color, opacity) {
  // Create a rotated rectangle as an SVG path
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

// Generate a deterministic but interesting composition
// Using a fixed seed for reproducibility
const planes = [];
const cx = WIDTH / 2;
const cy = HEIGHT / 2;

// Large background planes (the overlapping color fields)
planes.push(generatePlane(cx - 80, cy - 20, 340, -12, PALETTE[0], 0.55));
planes.push(generatePlane(cx + 60, cy + 10, 320, 25, PALETTE[1], 0.50));
planes.push(generatePlane(cx - 30, cy + 30, 300, -35, PALETTE[2], 0.55));
planes.push(generatePlane(cx + 20, cy - 40, 280, 8, PALETTE[3], 0.45));

// Smaller accent planes
planes.push(generatePlane(cx + 120, cy - 60, 180, 45, PALETTE[0], 0.3));
planes.push(generatePlane(cx - 140, cy + 50, 200, -20, PALETTE[1], 0.25));
planes.push(generatePlane(cx + 40, cy + 80, 160, 55, PALETTE[2], 0.3));

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />

  <!-- Subtle grain texture -->
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
    <feBlend in="SourceGraphic" mode="multiply" />
  </filter>

  <g style="mix-blend-mode: screen;">
    ${planes.join('\n    ')}
  </g>

  <!-- Site title -->
  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 180}"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="28"
    fill="#efe5d5"
    letter-spacing="3"
    opacity="0.9">Alex Russell</text>

  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 215}"
    text-anchor="middle"
    font-family="'Courier New', monospace"
    font-size="14"
    fill="#7a6a5a"
    letter-spacing="4"
    text-transform="uppercase">UX Engineer</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('public/images/og-default.png');

console.log('✓ Generated OG image: public/images/og-default.png');
