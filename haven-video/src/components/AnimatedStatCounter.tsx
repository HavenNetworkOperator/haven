import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { serif, sans } from '../fonts';
import { COLORS } from '../constants';

type AnimatedStatCounterProps = {
  from?: number;
  to: number;
  suffix: string;
  label: string;
  startFrame?: number;
  countDuration?: number;
  numeralColor?: string;
  labelColor?: string;
  numeralSize?: number;
  labelSize?: number;
  sceneDuration: number;
};

export const AnimatedStatCounter: React.FC<AnimatedStatCounterProps> = ({
  from = 0,
  to,
  suffix,
  label,
  startFrame = 8,
  countDuration = 45,
  numeralColor = COLORS.accentSoft,
  labelColor = COLORS.accentSoft,
  numeralSize = 160,
  labelSize = 48,
  sceneDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [sceneDuration - 15, sceneDuration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Animated count
  const count = Math.floor(
    interpolate(frame, [startFrame, startFrame + countDuration], [from, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Suffix fades in after count reaches target
  const suffixProgress = spring({
    frame: frame - (startFrame + countDuration),
    fps,
    config: { damping: 200 },
  });
  const suffixOpacity = interpolate(suffixProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  // Label fades in after suffix
  const labelProgress = spring({
    frame: frame - (startFrame + countDuration + 15),
    fps,
    config: { damping: 200 },
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const labelY = interpolate(labelProgress, [0, 1], [12, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        opacity: Math.min(fadeIn, fadeOut),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <p
        style={{
          fontFamily: serif,
          fontSize: numeralSize,
          fontWeight: 400,
          fontStyle: 'italic',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: numeralColor,
          margin: 0,
        }}
      >
        {count}
        <span style={{ opacity: suffixOpacity }}>{suffix}</span>
      </p>
      <p
        style={{
          fontFamily: sans,
          fontSize: labelSize,
          fontWeight: 400,
          color: labelColor,
          margin: 0,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </p>
    </div>
  );
};
