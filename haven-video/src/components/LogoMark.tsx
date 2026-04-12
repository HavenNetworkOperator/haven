import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS } from '../constants';

type LogoMarkProps = {
  size?: number;
  animate?: boolean;
};

export const LogoMark: React.FC<LogoMarkProps> = ({ size = 56, animate = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = animate
    ? spring({ frame, fps, config: { damping: 200 } })
    : 1;

  // Slow drift rotation — 8 degrees over 12s loop
  const drift = animate
    ? interpolate(frame % (12 * fps), [0, 6 * fps, 12 * fps], [0, 8, 0])
    : 0;

  const innerSize = size - size * (6 / 28);

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${scale}) rotate(${drift}deg)`,
        transformOrigin: 'center center',
        position: 'relative',
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: COLORS.accent,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      {/* Inner punch-out */}
      <div
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: '50%',
          backgroundColor: COLORS.paper,
          position: 'absolute',
          top: size * (6 / 28) / 2,
          left: size * (6 / 28) / 2,
        }}
      />
    </div>
  );
};

export const LogoMarkDark: React.FC<LogoMarkProps> = ({ size = 56, animate = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = animate
    ? spring({ frame, fps, config: { damping: 200 } })
    : 1;

  const drift = animate
    ? interpolate(frame % (12 * fps), [0, 6 * fps, 12 * fps], [0, 8, 0])
    : 0;

  const innerSize = size - size * (6 / 28);

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${scale}) rotate(${drift}deg)`,
        transformOrigin: 'center center',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: COLORS.accentSoft,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <div
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: '50%',
          backgroundColor: COLORS.ink,
          position: 'absolute',
          top: size * (6 / 28) / 2,
          left: size * (6 / 28) / 2,
        }}
      />
    </div>
  );
};
