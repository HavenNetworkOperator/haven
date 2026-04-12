# Haven — Design Style Guide

## Design Principles

Haven's visual identity is **warm, considered, and trustworthy**. The aesthetic draws from editorial print design — think a quality broadsheet supplement, not a tech startup. Every decision should feel like something a thoughtful parent would pick up and trust, not a product trying to sell them something.

**Core qualities:**
- **Warmth over sterility** — off-white paper tones, not clinical white or dark mode
- **Restraint over decoration** — one accent colour, used deliberately
- **Serif confidence** — display type in Fraunces signals craft and permanence
- **Breathing room** — generous whitespace; never cramped

---

## Colour

### Palette

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--bg` | `#f4efe6` | Paper | Page background; default surface |
| `--bg-deep` | `#ebe4d4` | Deep paper | Alternate section backgrounds |
| `--ink` | `#0f1b2d` | Ink | Primary text; dark backgrounds; button fills |
| `--ink-soft` | `#2a3a52` | Soft ink | Secondary body copy; subheadings |
| `--muted` | `#6a6253` | Muted | Captions, labels, metadata, footer text |
| `--accent` | `#c14a1f` | Terracotta | CTAs, highlights, active states, links |
| `--accent-soft` | `#e88a5e` | Soft terracotta | Accent on dark backgrounds only |
| `--line` | `#d8cfbc` | Line | Dividers, borders, section separators |

### Rules
- **One accent per screen.** Terracotta (`--accent`) is used sparingly to direct attention. Never fill large areas with it.
- **Accent on dark.** On dark (`--ink`) backgrounds, use `--accent-soft` instead of `--accent` — the deeper terracotta is too harsh on navy.
- **No pure black or white.** The ink and paper tones replace `#000` and `#fff` entirely.
- **Opacity for layering.** On dark sections, use `rgba(244, 239, 230, 0.75)` for secondary text and `rgba(244, 239, 230, 0.2)` for borders rather than introducing new colours.

### Dark Section Treatment
The Founding Members section inverts the palette. When using a dark (`--ink`) background:
- Primary text: `--bg` (`#f4efe6`)
- Secondary text: `rgba(244, 239, 230, 0.75)`
- Borders/dividers: `rgba(244, 239, 230, 0.2)` or `rgba(244, 239, 230, 0.1)`
- Accent: `--accent-soft` (`#e88a5e`)
- Decorative glow: `radial-gradient(circle, rgba(193, 74, 31, 0.25) 0%, transparent 60%)`

---

## Typography

### Typefaces

| Role | Family | Fallback | Notes |
|---|---|---|---|
| **Display / Serif** | Fraunces | Georgia, serif | Optical size 9–144, used for all headings and display text |
| **UI / Sans** | Inter Tight | -apple-system, sans-serif | All body copy, labels, buttons, metadata |

### Scale

| Element | Size | Weight | Family | Letter-spacing | Notes |
|---|---|---|---|---|---|
| Hero H1 | `clamp(44px, 7vw, 92px)` | 400 | Serif | `-0.035em` | `line-height: 0.98` |
| Section H2 | `clamp(36px, 5vw, 64px)` | 400 | Serif | `-0.025em` | `line-height: 1.05` |
| Founding H2 | `clamp(36px, 4.5vw, 56px)` | 400 | Serif | `-0.025em` | On dark bg |
| Step H3 | `28px` | 500 | Serif | `-0.02em` | `line-height: 1.15` |
| FAQ question | `22px` | 500 | Serif | `-0.015em` | |
| Founder quote | `clamp(24px, 3vw, 34px)` | 300 | Serif italic | `-0.015em` | `line-height: 1.35` |
| Stat number | `clamp(48px, 5vw, 72px)` | 400 | Serif | `-0.03em` | `line-height: 1` |
| Body default | `17px` | 400 | Sans | — | `line-height: 1.55` |
| Body large | `18–22px` | 400 | Sans | — | `line-height: 1.5–1.6` |
| Body small | `16px` | 400 | Sans | — | `line-height: 1.6` |
| Button | `15px` | 500 | Sans | — | |
| Logo | `26px` | 500 | Serif | `-0.02em` | |
| Section label | `12px` | 400 | Sans | `0.18em` | `text-transform: uppercase` |
| Eyebrow / nav meta | `13px` | 500 | Sans | `0.04–0.12em` | `text-transform: uppercase` |
| Caption / source | `11–13px` | 400 | Sans | `0.04em` | colour: `--muted` |

### Typographic Rules
- **Italic is semantic.** `<em>` in display headings is styled italic in `--accent` (or `--accent-soft` on dark). Use it for the key phrase you want to land — one per heading.
- **Weight contrast.** Headings are 400 (regular) in Fraunces; the italic variant reads as the "bold" because of its personality. Reserve weight 500 for interactive elements (buttons, FAQ questions, step numbers).
- **Never set display type above 600 weight in Fraunces.** It loses its editorial character.
- **`max-width` on text blocks.** Body copy caps at `56–60ch`. Narrow callout text at `32ch`. Headers at `14–18ch`. Never let text span the full container width.

---

## Spacing

### Base unit: `8px`

| Scale | Value | Common use |
|---|---|---|
| `xs` | `8px` | Inline gaps, icon spacing |
| `sm` | `16px` | Within-component padding |
| `md` | `24px` | Card padding, list item gaps |
| `lg` | `32px` | Section internal spacing |
| `xl` | `48px` | Grid column gaps, major internal spacing |
| `2xl` | `64px` | Heading-to-content gap |
| `3xl` | `80–100px` | Section vertical padding (mobile) |
| `4xl` | `120px` | Section vertical padding (desktop) |

### Container
- Max-width: `1180px`
- Horizontal padding: `32px` desktop, `24px` mobile

### Section vertical rhythm
- Standard sections: `padding: 120px 0` desktop, `80px 0` mobile
- Dark founding section: `padding: 100px 0`
- Hero: `padding: 60px 0 100px` desktop, `40px 0 80px` mobile
- Footer: `padding: 60px 0 40px`

---

## Components

### Logo mark
A 28×28px terracotta circle (`--accent`) with an inner circle punched out (inset `6px`), matching `--bg`. Represents Haven's circular, contained safety concept.

```css
.logo-mark {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--accent);
  position: relative;
}
.logo-mark::after {
  content: ''; position: absolute; inset: 6px;
  border-radius: 50%; background: var(--bg);
}
```

---

### Section label
Small uppercase label with a leading line rule. Appears above every H2.

```css
.section-label {
  font-size: 12px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--muted);
  margin-bottom: 32px;
  display: flex; align-items: center; gap: 12px;
}
.section-label::before {
  content: ''; width: 32px; height: 1px;
  background: var(--muted);
}
```

On dark backgrounds: `color: var(--accent-soft)` with no `::before` rule needed.
On centered elements: add `justify-content: center`.

---

### Pill / Eyebrow badge
Used for status indicators and CTAs in the hero.

```css
.hero-eyebrow {
  font-size: 13px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent);
  font-weight: 500; padding: 8px 16px;
  border: 1px solid var(--accent);
  border-radius: 100px;
}
```

The `⬤` dot character provides a live status signal. It receives a `pulse` animation.

---

### Primary button (dark fill)

```css
button {
  background: var(--ink); color: var(--bg);
  border: none; border-radius: 100px;
  padding: 14px 28px;
  font-family: var(--sans); font-size: 15px; font-weight: 500;
  cursor: pointer; white-space: nowrap;
  transition: background 0.2s, transform 0.1s;
}
button:hover { background: var(--accent); }
button:active { transform: scale(0.97); }
```

Hover shifts from ink to terracotta — the transition is the micro-delight.

---

### Email signup form
Pill-shaped container wrapping an input and button as a unit.

```css
.signup-form {
  display: flex; gap: 8px;
  background: var(--bg);
  border: 1.5px solid var(--ink);
  border-radius: 100px;
  padding: 6px 6px 6px 24px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.signup-form:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(193, 74, 31, 0.12);
}
```

**On mobile:** break to column layout, switch border-radius to `20px`, add padding `16px`.

---

### Stat block
Numbers in Fraunces with an italic accent on the key digit/unit. Top-bordered rule, no card chrome.

```
[top border: 1px solid --ink]
[stat number — large serif, italic accent]
[stat description — 15px sans, --ink-soft]
[source attribution — 11px, --muted]
```

Grid: `repeat(auto-fit, minmax(260px, 1fr))` with `48px 64px` gap.

---

### How it works — Step
Numbered step with accent-coloured step label, serif H3, and sans body.

```
[step number — 14px serif, --accent, letter-spacing 0.1em]
[step title — 28px serif 500]
[step body — 16px sans, --ink-soft]
```

Grid: `repeat(auto-fit, minmax(280px, 1fr))`, `48px` gap.

---

### Benefits list (dark bg)
Bordered card on the dark section, items separated by faint rules, each item led by a `✦` character in `--accent-soft`.

```css
.benefits-list {
  list-style: none; padding: 32px;
  border: 1px solid rgba(244, 239, 230, 0.2);
  border-radius: 16px;
}
li::before { content: '✦'; color: var(--accent-soft); }
```

---

### FAQ / Accordion
Uses native `<details>` / `<summary>`. The `+` rotates 45° to an `×` on open. No JavaScript required.

```css
.faq-q::after { content: '+'; color: var(--accent); transition: transform 0.3s; }
details[open] .faq-q::after { transform: rotate(45deg); }
```

---

### Dividers
- **Section separator:** `border-top: 1px solid var(--line)` on `.section`
- **Within-card:** `border-bottom: 1px solid rgba(244, 239, 230, 0.1)` (on dark)
- **Stat top rule:** `border-top: 1px solid var(--ink)`

---

## Texture & Materials

### Paper grain overlay
A fixed SVG noise filter sits over the entire page at `opacity: 0.4`, `pointer-events: none`. It adds the tactile quality that makes the off-white background feel like paper rather than a screen.

```css
body::before {
  content: ''; position: fixed; inset: 0;
  pointer-events: none; opacity: 0.4; z-index: 1;
  background-image: url("data:image/svg+xml,...");
}
```

All content layers sit at `z-index: 2` to render above the grain.

### Dark section glow
The founding section uses a subtle radial terracotta glow in the top-right corner as an atmospheric element, not a functional one.

```css
.founding::before {
  content: ''; position: absolute;
  top: -50%; right: -10%;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(193, 74, 31, 0.25) 0%, transparent 60%);
  pointer-events: none;
}
```

### Decorative SVG mark (hero)
Three concentric dashed/solid circles with a filled centre dot in `--accent`. Serves as visual counterweight to the left-aligned text. Animates with a slow drift rotation.

---

## Animation & Motion

| Name | Keyframes | Usage |
|---|---|---|
| `fadeUp` | `opacity 0 → 1`, `translateY(20px → 0)` | All hero elements on load |
| `pulse` | Scale 1 → 1.4 → 1, opacity 1 → 0.5 → 1 | Live status dot in signup meta |
| `drift` | `rotate(0deg → 8deg → 0deg)` | Decorative SVG mark, 12s loop |

### Hero stagger
Hero elements load with `animation: fadeUp` and staggered `animation-delay`:
```
eyebrow:   0s delay, 0.8s duration
h1:        0.1s delay, 0.9s duration
hero-sub:  0.25s delay, 1s duration
signup:    0.4s delay, 1s duration
```
All use `backwards` fill-mode so elements start hidden.

### Scroll reveal
Elements outside the hero use `.fade-in` triggered by `IntersectionObserver`. Start at `opacity: 0; transform: translateY(24px)`. Transition: `opacity 0.6s ease, transform 0.6s ease`.

### Principles
- **Duration:** 0.2s for micro-interactions (hover, focus), 0.6–1s for entrances
- **Easing:** `ease-out` for entrances (things arrive, not leave); `ease-in-out` for loops
- **No bounce, no overshoot.** This is a family brand — movement should feel settled and calm

---

## Layout Patterns

### Two-column (founding section)
```css
grid-template-columns: 1.2fr 1fr;
gap: 80px;
align-items: center;
```
Collapses to single column at `768px`.

### Auto-fit grid (stats, steps)
```css
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
gap: 48px 64px;
```
Responsive without media queries.

### Centered narrow (founder note, FAQ)
```css
max-width: 720–760px;
margin: 0 auto;
```

---

## Responsive Breakpoints

Single breakpoint at `768px` (mobile).

| Property | Desktop | Mobile |
|---|---|---|
| Container padding | `32px` | `24px` |
| Hero padding | `60px 0 100px` | `40px 0 80px` |
| Section padding | `120px 0` | `80px 0` |
| Hero mark | Visible | `display: none` |
| Founding grid | `1.2fr 1fr` | `1fr` (stacked) |
| Signup form | Row (pill shape) | Column (rounded rect) |
| Footer | Row | Column, centred |

---

## Voice & Tone (for copy that matches the design)

The visual warmth requires matching language:

- **Direct, not corporate.** "We're building" not "We are developing"
- **Honest about uncertainty.** "We're finalising pricing" is stronger than vague promises
- **Parent-to-parent register.** The founder note sets the tone — personal, clear, slightly emotional
- **Em-dashes over semicolons.** Rhythm over formality
- **Short sentences under pressure.** The hero sub-heading and FAQ answers earn their length through clarity

---

## Do / Don't

| Do | Don't |
|---|---|
| Use terracotta for one key phrase per heading | Use `--accent` as a fill colour for large elements |
| Let whitespace breathe | Stack sections without padding |
| Italic serif for emotional emphasis | Use bold serif — it kills the editorial quality |
| Lead labels with the `section-label` pattern | Introduce new typographic styles ad hoc |
| Keep the paper grain on all pages | Turn off the texture for "cleaner" pages |
| Use `clamp()` for responsive type | Set fixed px sizes for display headings |
| Match animation easing to the calm brand | Add bounce, spring, or aggressive transitions |
