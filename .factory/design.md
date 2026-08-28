# Secret Exposure Path — visual thesis

## Direction: luminous glass data landscape

The product makes invisible credential movement legible. Its visual world is a
dark, quiet operations surface crossed by translucent routes: a source enters a
command prism, then branches toward diffs, logs, and artifacts. Glass is used as
an explanatory material—the viewer can see both a node and what passes through
it—not as decorative card chrome. Fine grid marks and coordinate labels borrow
from trace tooling rather than generic cyber-security imagery.

The site is intentionally single-mode. A near-black navy field keeps the path
signals luminous, preserves the terminal/tool context, and avoids a theme
switch becoming unrelated product chrome.

## Tokens

- `ink-950` `#071015`: page background, derived from an unlit terminal.
- `ink-900` `#0B171D`: raised surfaces.
- `glass` `rgba(19, 43, 51, .68)`: translucent route panels.
- `text` `#F3F8F6`: primary copy (17.6:1 on `ink-950`).
- `muted` `#AABCB9`: secondary copy (8.9:1 on `ink-950`).
- `aqua` `#64F4D2`: safe/active signal and focus (13.5:1 on `ink-950`).
- `amber` `#FFC766`: attention and source nodes (12.2:1 on `ink-950`).
- `coral` `#FF7D77`: exposed path/danger (7.0:1 on `ink-950`).
- `violet` `#B8A4FF`: command and neutral route accents (8.6:1).

## Typography and rhythm

The interface uses the self-hosted **Atkinson Hyperlegible** family for clear
letterforms in technical prose and the system monospace stack for commands,
fingerprints, and coordinate labels. The scale is 14 / 16 / 20 / 28 / 48–72px.
Body copy never drops below 16px. Spacing follows an 8px unit with 4px optical
adjustments; primary sections use 80–128px vertical separation so the route
story can breathe.

## Interaction grammar

Controls illuminate their border and lift by 2px on intent. The demo is a
small scanner bench, not a fake application screenshot: users edit a source
and sink, run a local browser-only trace, and receive either an empty safe
state or a redacted path. Path states always combine shape, label, and color.
Focus uses a 3px aqua outer ring. Touch targets are at least 44px.

## Motion

One introductory route-draw (650ms) explains direction of travel; result nodes
enter from their upstream origin over 220ms. Nothing loops. Under
`prefers-reduced-motion: reduce`, paths and nodes appear immediately and all
scrolling is instant. Only opacity and transforms animate.

## Asset plan and provenance

`site/public/trace-landscape.webp` is the original hero illustration generated
for this product with the Param Factory `factory-image` deployment on
2026-08-28, then resized/compressed locally to WebP. Prompt:

> A wide abstract editorial 3D landscape for a developer security CLI landing
> page: a single small amber glass source prism on the left sends one luminous
> aqua data filament through a central violet translucent command prism, then
> the filament branches toward three dark glass sinks on the right; one branch
> turns coral red before reaching its sink. Oblique isometric camera, deep
> near-black navy environment, subtle technical coordinate grid etched into the
> floor, physically plausible glass refraction, restrained bloom, crisp edges,
> generous negative space, cinematic but quiet, no people, no locks, no shields,
> no logos, no text, no letters, no watermark, no generic circuit-board pattern.

The route mark and interface icons are hand-authored in HTML/CSS as geometric
lines and nodes; they are original and intentionally remain code-native.
