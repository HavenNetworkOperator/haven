import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS } from '../../constants';

const useDrawProgress = (startFrame: number, endFrame: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
};

export const ShieldSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useDrawProgress(8, 52);
  const pulseOpacity = interpolate(frame % Math.round(1.5 * fps), [0, 15, 30], [0.3, 0.8, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <svg width={120} height={120} viewBox="0 0 60 60" fill="none">
      <circle
        cx="30"
        cy="32"
        r="22"
        stroke={COLORS.accentSoft}
        strokeWidth="0.5"
        fill="none"
        opacity={pulseOpacity * p}
      />
      <path
        d="M30 6 L10 14 V30 C10 42 20 50 30 54 C40 50 50 42 50 30 V14 Z"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={180}
        strokeDashoffset={180 * (1 - p)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 30 L27 36 L38 24"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={30}
        strokeDashoffset={30 * (1 - interpolate(p, [0.6, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
        strokeLinecap="round"
      />
    </svg>
  );
};
