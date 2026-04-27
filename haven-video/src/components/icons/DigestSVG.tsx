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

export const DigestSVG: React.FC = () => {
  const p = useDrawProgress(8, 52);
  return (
    <svg width={120} height={120} viewBox="0 0 60 60" fill="none">
      <rect
        x="10"
        y="8"
        width="40"
        height="48"
        rx="4"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={200}
        strokeDashoffset={200 * (1 - p)}
        strokeLinecap="round"
      />
      {[20, 28, 36, 44].map((y, i) => {
        const lp = interpolate(p, [0.3 + i * 0.12, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const width = i === 3 ? 20 : 30;
        return (
          <line
            key={i}
            x1="18"
            y1={y}
            x2={18 + width * lp}
            y2={y}
            stroke={COLORS.accentSoft}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
