export const COLORS = {
  paper: '#f4efe6',
  paperDeep: '#ebe4d4',
  ink: '#0f1b2d',
  inkSoft: '#2a3a52',
  muted: '#6a6253',
  accent: '#c14a1f',
  accentSoft: '#e88a5e',
  line: '#d8cfbc',
} as const;

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// Sparkline structure — 7 scenes, alternating What Is / What Could Be
// WHAT IS        = dark ink bg — DESPAIR, OUTRAGE
// WHAT COULD BE  = warm paper bg — hope, relief, PEACE
export const SCENE_DURATIONS = {
  scene1: 300,   // WHAT IS    — The World As It Is (DESPAIR)
  scene2: 300,   // WHAT COULD BE — What Childhood Could Feel Like
  scene3: 540,   // WHAT IS    — The System Is Working Against You (OUTRAGE)
  scene4: 360,   // WHAT COULD BE — We See It Too
  scene5: 540,   // WHAT IS    — How Haven Works (bridge/mechanism)
  scene6: 360,   // WHAT COULD BE — The World Haven Makes Possible (PEACE)
  scene7: 750,   // WHAT COULD BE — Join Us (CTA, sustained hope)
  transition: 15,
} as const;

// 300+300+540+360+540+360+750 − (6×15) = 3,060 frames = 102 seconds
export const TOTAL_FRAMES =
  SCENE_DURATIONS.scene1 +
  SCENE_DURATIONS.scene2 +
  SCENE_DURATIONS.scene3 +
  SCENE_DURATIONS.scene4 +
  SCENE_DURATIONS.scene5 +
  SCENE_DURATIONS.scene6 +
  SCENE_DURATIONS.scene7 -
  6 * SCENE_DURATIONS.transition;
