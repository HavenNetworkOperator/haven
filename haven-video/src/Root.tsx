import React from 'react';
import { Composition } from 'remotion';
import { HavenVideo } from './HavenVideo';
import { FPS, W, H, TOTAL_FRAMES } from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HavenVideo"
      component={HavenVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
