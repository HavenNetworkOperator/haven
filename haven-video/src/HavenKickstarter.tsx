import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from 'remotion';
import { Scene1Opening } from './scenes/Scene1Opening';
import { Scene2Founder } from './scenes/Scene2Founder';
import { Scene3Product } from './scenes/Scene3Product';
import { Scene4Campaign } from './scenes/Scene4Campaign';
import { Scene5EndCard } from './scenes/Scene5EndCard';
import { FPS } from './constants';

const S1 = 158;
const S2 = 594;
const S3 = 590;
const S4 = 356;
const S5 = 345;
const T = 15;

export const KICKSTARTER_TOTAL = S1 + S2 + S3 + S4 + S5 - 4 * T; // 1983

export const HavenKickstarter: React.FC = () => {
  const frame = useCurrentFrame();

  const musicVolume = interpolate(
    frame,
    [0, 60, KICKSTARTER_TOTAL - 90, KICKSTARTER_TOTAL],
    [0, 0.65, 0.65, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const s1Start = 0;
  const s2Start = s1Start + S1 - T;
  const s3Start = s2Start + S2 - T;
  const s4Start = s3Start + S3 - T;
  const s5Start = s4Start + S4 - T;

  return (
    <AbsoluteFill>
      <Audio src={staticFile('inspired.mp3')} volume={musicVolume} />

      <Sequence from={s1Start} durationInFrames={S1} premountFor={T}>
        <Scene1Opening sceneDuration={S1} />
      </Sequence>

      <Sequence from={s2Start} durationInFrames={S2} premountFor={T}>
        <Scene2Founder sceneDuration={S2} />
      </Sequence>

      <Sequence from={s3Start} durationInFrames={S3} premountFor={T}>
        <Scene3Product sceneDuration={S3} />
      </Sequence>

      <Sequence from={s4Start} durationInFrames={S4} premountFor={T}>
        <Scene4Campaign sceneDuration={S4} />
      </Sequence>

      <Sequence from={s5Start} durationInFrames={S5} premountFor={T}>
        <Scene5EndCard sceneDuration={S5} />
      </Sequence>
    </AbsoluteFill>
  );
};
