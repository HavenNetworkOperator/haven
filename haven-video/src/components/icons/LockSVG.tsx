import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../../constants';

const useDrawProgress = (startFrame: number, endFrame: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
};

export const LockSVG: React.FC = () => {
  const p = useDrawProgress(8, 52);
  return (
    <svg width={120} height={120} viewBox="0 0 60 60" fill="none">
      <rect
        x="12"
        y="28"
        width="36"
        height="26"
        rx="4"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={140}
        strokeDashoffset={140 * (1 - p)}
        strokeLinecap="round"
      />
      <path
        d="M20 28 V20 C20 13 40 13 40 20 V28"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={60}
        strokeDashoffset={60 * (1 - interpolate(p, [0.3, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
        strokeLinecap="round"
      />
      <circle
        cx="30"
        cy="41"
        r="3"
        fill={COLORS.accentSoft}
        opacity={interpolate(p, [0.7, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
    </svg>
  );
};
