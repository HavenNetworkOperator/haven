import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS } from '../constants';
import { serif, sans } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene1Opening: React.FC<{ sceneDuration?: number }> = ({ sceneDuration = 315 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0–60f: pure black hold
  // 60–120f: "98%" arrives
  // 120–180f: "of UK mobile networks" arrives
  // 180–240f: "were designed for adults." arrives
  // 240–315f: hold + fade out

  const makeReveal = (start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    });

  const makeSlide = (start: number, end: number) =>
    interpolate(frame, [start, end], [20, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    });

  const stat = makeReveal(60, 100);
  const statY = makeSlide(60, 100);

  const sub = makeReveal(120, 160);
  const subY = makeSlide(120, 160);

  const line = makeReveal(180, 220);
  const lineY = makeSlide(180, 220);

  const fadeOut = interpolate(frame, [sceneDuration - 15, sceneDuration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 0,
          padding: '0 120px',
          textAlign: 'center',
        }}
      >
        {/* "98%" — the anchor */}
        <div
          style={{
            opacity: stat,
            transform: `translateY(${statY}px)`,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: serif,
              fontSize: 200,
              fontWeight: 400,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: COLORS.paper,
              display: 'block',
            }}
          >
            98%
          </span>
        </div>

        {/* "of UK mobile networks" */}
        <div
          style={{
            opacity: sub,
            transform: `translateY(${subY}px)`,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: sans,
              fontSize: 36,
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: `rgba(244, 239, 230, 0.55)`,
              textTransform: 'uppercase',
              display: 'block',
            }}
          >
            of UK mobile networks
          </span>
        </div>

        {/* "were designed for adults." */}
        <div
          style={{
            opacity: line,
            transform: `translateY(${lineY}px)`,
          }}
        >
          <span
            style={{
              fontFamily: serif,
              fontSize: 60,
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: COLORS.accentSoft,
              display: 'block',
            }}
          >
            were designed for adults.
          </span>
        </div>
      </AbsoluteFill>

      <GrainOverlay opacity={0.2} />
    </AbsoluteFill>
  );
};
