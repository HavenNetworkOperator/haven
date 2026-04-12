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

// Scene durations in frames (total = 2250, accounting for 4×15 fade transitions)
export const SCENE_DURATIONS = {
  scene1: 315,
  scene2: 465,
  scene3: 615,
  scene4: 465,
  scene5: 450,
  transition: 15,
} as const;

// Total = 315+465+615+465+450 - 4*15 = 2250 frames = 75 seconds
export const TOTAL_FRAMES =
  SCENE_DURATIONS.scene1 +
  SCENE_DURATIONS.scene2 +
  SCENE_DURATIONS.scene3 +
  SCENE_DURATIONS.scene4 +
  SCENE_DURATIONS.scene5 -
  4 * SCENE_DURATIONS.transition;
