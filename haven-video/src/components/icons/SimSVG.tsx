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

export const SimSVG: React.FC = () => {
  const p = useDrawProgress(8, 52);
  const SIM = 220;
  return (
    <svg width={120} height={120} viewBox="0 0 60 60" fill="none">
      <path
        d="M10 8 L38 8 L50 20 L50 52 L10 52 Z"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={SIM}
        strokeDashoffset={SIM * (1 - p)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="20"
        y="26"
        width="20"
        height="15"
        rx="2"
        stroke={COLORS.accentSoft}
        strokeWidth="1.2"
        fill="none"
        strokeDasharray={80}
        strokeDashoffset={80 * (1 - interpolate(p, [0.4, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
      />
    </svg>
  );
};
