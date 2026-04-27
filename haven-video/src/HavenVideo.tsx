import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from 'remotion';
import { Scene1WhatIs } from './scenes/Scene1WhatIs';
import { Scene2WhatCouldBe } from './scenes/Scene2WhatCouldBe';
import { Scene3Outrage } from './scenes/Scene3Outrage';
import { Scene4WeSeeToo } from './scenes/Scene4WeSeeToo';
import { Scene5HowItWorks } from './scenes/Scene5HowItWorks';
import { Scene6Peace } from './scenes/Scene6Peace';
import { Scene7JoinUs } from './scenes/Scene7JoinUs';
import { TOTAL_FRAMES, SCENE_DURATIONS } from './constants';

// Sparkline narrative arc — Duarte Resonate framework
// Hero: the parent. Villain: the system.
//
// Timeline (frames):
//   S1: 0    → 300   (300f) — WHAT IS:        DESPAIR — the teenager's world
//   S2: 285  → 585   (300f) — WHAT COULD BE:  glimpse of presence
//   S3: 570  → 1110  (540f) — WHAT IS:        OUTRAGE — Lord Nash + stats
//   S4: 1095 → 1455  (360f) — WHAT COULD BE:  recognition — we see it too
//   S5: 1440 → 1980  (540f) — WHAT IS:        mechanism — how Haven works
//   S6: 1965 → 2325  (360f) — WHAT COULD BE:  PEACE — the transformed life
//   S7: 2310 → 3060  (750f) — WHAT COULD BE:  CTA — join us (sustained hope)
//
// Total: 3,060 frames = 102 seconds at 30fps
// Scenes overlap by 15 frames — each scene handles its own fade-in/out

export const HavenVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Music fades in over 60 frames (2s), fades out over 90 frames (3s) at the end
  const musicVolume = interpolate(
    frame,
    [0, 60, TOTAL_FRAMES - 90, TOTAL_FRAMES],
    [0, 0.65, 0.65, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const T = SCENE_DURATIONS.transition; // 15

  // Absolute start frames
  const s1Start = 0;
  const s2Start = s1Start + SCENE_DURATIONS.scene1 - T;   // 285
  const s3Start = s2Start + SCENE_DURATIONS.scene2 - T;   // 570
  const s4Start = s3Start + SCENE_DURATIONS.scene3 - T;   // 1095
  const s5Start = s4Start + SCENE_DURATIONS.scene4 - T;   // 1440
  const s6Start = s5Start + SCENE_DURATIONS.scene5 - T;   // 1965
  const s7Start = s6Start + SCENE_DURATIONS.scene6 - T;   // 2310

  return (
    <AbsoluteFill>
      <Audio src={staticFile('inspired.mp3')} volume={musicVolume} />

      <Sequence from={s1Start} durationInFrames={SCENE_DURATIONS.scene1} premountFor={T}>
        <Scene1WhatIs sceneDuration={SCENE_DURATIONS.scene1} />
      </Sequence>

      <Sequence from={s2Start} durationInFrames={SCENE_DURATIONS.scene2} premountFor={T}>
        <Scene2WhatCouldBe sceneDuration={SCENE_DURATIONS.scene2} />
      </Sequence>

      <Sequence from={s3Start} durationInFrames={SCENE_DURATIONS.scene3} premountFor={T}>
        <Scene3Outrage sceneDuration={SCENE_DURATIONS.scene3} />
      </Sequence>

      <Sequence from={s4Start} durationInFrames={SCENE_DURATIONS.scene4} premountFor={T}>
        <Scene4WeSeeToo sceneDuration={SCENE_DURATIONS.scene4} />
      </Sequence>

      <Sequence from={s5Start} durationInFrames={SCENE_DURATIONS.scene5} premountFor={T}>
        <Scene5HowItWorks sceneDuration={SCENE_DURATIONS.scene5} />
      </Sequence>

      <Sequence from={s6Start} durationInFrames={SCENE_DURATIONS.scene6} premountFor={T}>
        <Scene6Peace sceneDuration={SCENE_DURATIONS.scene6} />
      </Sequence>

      <Sequence from={s7Start} durationInFrames={SCENE_DURATIONS.scene7} premountFor={T}>
        <Scene7JoinUs sceneDuration={SCENE_DURATIONS.scene7} />
      </Sequence>
    </AbsoluteFill>
  );
};
