import React from 'react';
import { AbsoluteFill } from 'remotion';

export const GrainOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.35 }) => {
  return (
    <AbsoluteFill
      style={{
        opacity,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
        zIndex: 100,
      }}
    />
  );
};
