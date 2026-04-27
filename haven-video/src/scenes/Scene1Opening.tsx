import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { COLORS } from '../constants';
import { serif } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';

export const Scene1Opening: React.FC<{ sceneDuration?: number }> = ({ sceneDuration = 158 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0–15f: pure black hold (short — opens fast)
  // 15–90f: words reveal word by word
  // 90–315f: hold + fade out

  const words = 'Mobile phone networks were not designed with family safety in mind.'.split(' ');

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
          padding: '0 140px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: serif,
            fontSize: 64,
            fontWeight: 400,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            color: COLORS.paper,
            margin: 0,
            textAlign: 'center',
            maxWidth: 1500,
          }}
        >
          {words.map((word, i) => {
            const delay = 15 + i * 6;
            const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
            const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
            const y = interpolate(progress, [0, 1], [16, 0], { extrapolateRight: 'clamp' });

            return (
              <span
                key={i}
                style={{
                  opacity,
                  display: 'inline-block',
                  transform: `translateY(${y}px)`,
                  marginRight: '0.25em',
                  fontStyle: 'normal',
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </AbsoluteFill>

      <GrainOverlay opacity={0.2} />
    </AbsoluteFill>
  );
};
