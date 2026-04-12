import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

type FadeUpTextProps = {
  children: React.ReactNode;
  delay?: number; // in frames
  style?: React.CSSProperties;
};

export const FadeUpText: React.FC<FadeUpTextProps> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [24, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
