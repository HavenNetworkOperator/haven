import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_DURATIONS } from '../constants';
import { serif } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';

// Horizon sunrise SVG — draws itself over ~60 frames
const HorizonSVG: React.FC<{ startFrame?: number }> = ({ startFrame = 10 }) => {
  const frame = useCurrentFrame();

  const lineProgress = interpolate(frame, [startFrame, startFrame + 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const arcProgress = interpolate(frame, [startFrame + 20, startFrame + 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const overallOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Horizon line: M 40 80 L 160 80, length ~120
  const LINE_LENGTH = 120;
  // Arc: M 60 80 A 40 40 0 0 1 140 80, length ~126
  const ARC_LENGTH = 126;

  return (
    <svg
      width={300}
      height={150}
      viewBox="0 0 200 100"
      fill="none"
      style={{ opacity: overallOpacity }}
    >
      {/* Horizon line */}
      <line
        x1="40" y1="80" x2="160" y2="80"
        stroke={COLORS.line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={LINE_LENGTH}
        strokeDashoffset={LINE_LENGTH * (1 - lineProgress)}
      />
      {/* Sunrise arc */}
      <path
        d="M 60 80 A 40 40 0 0 1 140 80"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={ARC_LENGTH}
        strokeDashoffset={ARC_LENGTH * (1 - arcProgress)}
      />
    </svg>
  );
};

export const Scene2WhatCouldBe: React.FC<{ sceneDuration?: number }> = ({
  sceneDuration = SCENE_DURATIONS.scene2,
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

  // Text: "Imagine a weekend where the phone isn't the loudest thing in the room. Where your teenager is just..."
  // then "there." with a longer delay
  const textBefore = "Imagine a weekend where the phone isn't the loudest thing in the room. Where your teenager is just...";
  const wordsBefore = textBefore.split(' ');
  const frameOffset = 80; // starts after SVG has mostly drawn

  // "there." appears 15f after the last word of textBefore
  const thereDelay = frameOffset + (wordsBefore.length - 1) * 5 + 15;

  const makeWordSpring = (delay: number) => {
    const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
    return {
      opacity: interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
      y: interpolate(progress, [0, 1], [12, 0], { extrapolateRight: 'clamp' }),
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.paper,
        opacity: Math.min(fadeIn, fadeOut),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 48,
        padding: '0 160px',
      }}
    >
      {/* Horizon SVG */}
      <HorizonSVG startFrame={10} />

      {/* The text — word by word, with special last word */}
      <p
        style={{
          fontFamily: serif,
          fontSize: 68,
          fontWeight: 400,
          fontStyle: 'italic',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          color: COLORS.ink,
          margin: 0,
          textAlign: 'center',
          maxWidth: 1100,
        }}
      >
        {wordsBefore.map((word, i) => {
          const { opacity, y } = makeWordSpring(frameOffset + i * 5);
          return (
            <span
              key={i}
              style={{
                opacity,
                display: 'inline-block',
                transform: `translateY(${y}px)`,
                marginRight: '0.25em',
              }}
            >
              {word}
            </span>
          );
        })}
        {/* "there." — the payoff word, delayed and in accent colour */}
        {(() => {
          const { opacity, y } = makeWordSpring(thereDelay);
          return (
            <span
              style={{
                opacity,
                display: 'inline-block',
                transform: `translateY(${y}px)`,
                color: COLORS.accent,
              }}
            >
              there.
            </span>
          );
        })()}
      </p>

      <GrainOverlay opacity={0.35} />
    </AbsoluteFill>
  );
};
