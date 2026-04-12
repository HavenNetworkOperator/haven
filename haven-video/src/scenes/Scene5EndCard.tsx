import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS } from '../constants';
import { serif, sans } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';
import { FadeUpText } from '../components/FadeUpText';

// Large animated logo mark for end card
const EndLogoMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 200 } });

  // Slow drift — 8 degrees over 12s loop
  const drift = interpolate(
    frame % (12 * fps),
    [0, 6 * fps, 12 * fps],
    [0, 8, 0]
  );

  const size = 120;
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
          backgroundColor: COLORS.accent,
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
          backgroundColor: COLORS.paper,
          position: 'absolute',
          top: size * (6 / 28) / 2,
          left: size * (6 / 28) / 2,
        }}
      />
    </div>
  );
};

export const Scene5EndCard: React.FC<{ sceneDuration?: number }> = ({ sceneDuration = 450 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Fade to black in the final 45 frames (1.5s)
  const fadeToBlack = interpolate(
    frame,
    [sceneDuration - 45, sceneDuration - 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, opacity: fadeIn }}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Large logo mark */}
        <FadeUpText delay={0}>
          <div style={{ marginBottom: 40 }}>
            <EndLogoMark />
          </div>
        </FadeUpText>

        {/* Haven wordmark */}
        <FadeUpText delay={15}>
          <h1
            style={{
              fontFamily: serif,
              fontSize: 96,
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: COLORS.ink,
              margin: 0,
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            Haven
          </h1>
        </FadeUpText>

        {/* Tagline */}
        <FadeUpText delay={25}>
          <p
            style={{
              fontFamily: sans,
              fontSize: 20,
              fontWeight: 400,
              color: COLORS.muted,
              margin: 0,
              marginBottom: 56,
              textAlign: 'center',
              letterSpacing: '0.02em',
            }}
          >
            Safe mobile network for parents & teens.
          </p>
        </FadeUpText>

        {/* Divider */}
        <FadeUpText delay={35}>
          <div
            style={{
              width: 48,
              height: 1,
              backgroundColor: COLORS.line,
              marginBottom: 40,
            }}
          />
        </FadeUpText>

        {/* CTA text */}
        <FadeUpText delay={40}>
          <p
            style={{
              fontFamily: sans,
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: COLORS.accent,
              margin: 0,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            Back us on Kickstarter
          </p>
        </FadeUpText>

        {/* URL */}
        <FadeUpText delay={48}>
          <p
            style={{
              fontFamily: sans,
              fontSize: 18,
              fontWeight: 400,
              color: COLORS.inkSoft,
              margin: 0,
              textAlign: 'center',
              letterSpacing: '0.01em',
            }}
          >
            kickstarter.com/projects/haven
          </p>
        </FadeUpText>

        {/* Founding slots note */}
        <FadeUpText delay={58}>
          <p
            style={{
              fontFamily: sans,
              fontSize: 14,
              fontWeight: 400,
              color: COLORS.muted,
              margin: 0,
              marginTop: 32,
              textAlign: 'center',
            }}
          >
            500 founding SIM slots — when they're gone, they're gone.
          </p>
        </FadeUpText>
      </AbsoluteFill>

      {/* Fade to black overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: '#000',
          opacity: fadeToBlack,
          pointerEvents: 'none',
        }}
      />

      <GrainOverlay opacity={0.35} />
    </AbsoluteFill>
  );
};
