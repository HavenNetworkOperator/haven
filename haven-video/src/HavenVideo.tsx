import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1Opening } from './scenes/Scene1Opening';
import { Scene2Founder } from './scenes/Scene2Founder';
import { Scene3Product } from './scenes/Scene3Product';
import { Scene4Campaign } from './scenes/Scene4Campaign';
import { Scene5EndCard } from './scenes/Scene5EndCard';

// Scenes overlap by FADE frames — each scene handles its own fade-in/out
// via useCurrentFrame() internally.
//
// Timeline (frames):
//   Scene 1:  0   → 315  (315 frames)
//   Scene 2:  300 → 765  (465 frames)  ← overlaps Scene 1 by 15f
//   Scene 3:  750 → 1365 (615 frames)  ← overlaps Scene 2 by 15f
//   Scene 4:  1350→ 1815 (465 frames)  ← overlaps Scene 3 by 15f
//   Scene 5:  1800→ 2250 (450 frames)  ← overlaps Scene 4 by 15f
//
// Total composition: 2250 frames = 75 seconds

export const HavenVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={315} premountFor={15}>
        <Scene1Opening sceneDuration={315} />
      </Sequence>

      <Sequence from={300} durationInFrames={465} premountFor={15}>
        <Scene2Founder sceneDuration={465} />
      </Sequence>

      <Sequence from={750} durationInFrames={615} premountFor={15}>
        <Scene3Product sceneDuration={615} />
      </Sequence>

      <Sequence from={1350} durationInFrames={465} premountFor={15}>
        <Scene4Campaign sceneDuration={465} />
      </Sequence>

      <Sequence from={1800} durationInFrames={450} premountFor={15}>
        <Scene5EndCard sceneDuration={450} />
      </Sequence>
    </AbsoluteFill>
  );
};
