import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_DURATIONS } from '../constants';
import { serif } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';
import { FullBleedStatement } from '../components/FullBleedStatement';

const cardDuration = 180;

// Family SVG — three figures under a shelter arc
const FamilySVG: React.FC<{ startFrame?: number }> = ({ startFrame = 8 }) => {
  const frame = useCurrentFrame();

  const makeLineProgress = (start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.quad),
    });

  // Three lines draw sequentially (20f each), then arc (30f)
  const line1 = makeLineProgress(startFrame, startFrame + 20);
  const line2 = makeLineProgress(startFrame + 20, startFrame + 40);
  const line3 = makeLineProgress(startFrame + 40, startFrame + 60);
  const arcProgress = makeLineProgress(startFrame + 60, startFrame + 90);

  const overallOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Line heights: left=60, centre=80, right=60
  // SVG viewBox: 0 0 160 120
  // Line 1 (left child):  M 40 110 L 40 50    length 60
  // Line 2 (adult):       M 80 110 L 80 30    length 80
  // Line 3 (right child): M 120 110 L 120 50  length 60
  // Arc (shelter):        M 20 50 Q 80 0 140 50  ~approx length 170

  const ARC_LENGTH = 170;

  return (
    <svg
      width={240}
      height={180}
      viewBox="0 0 160 120"
      fill="none"
      style={{ opacity: overallOpacity }}
    >
      {/* Left figure */}
      <line
        x1="40" y1="110"
        x2={40}
        y2={110 - 60 * line1}
        stroke={COLORS.accentSoft}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Centre figure (tallest) */}
      <line
        x1="80" y1="110"
        x2={80}
        y2={110 - 80 * line2}
        stroke={COLORS.accentSoft}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Right figure */}
      <line
        x1="120" y1="110"
        x2={120}
        y2={110 - 60 * line3}
        stroke={COLORS.accentSoft}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Shelter arc */}
      <path
        d="M 20 50 Q 80 0 140 50"
        stroke={COLORS.accentSoft}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={ARC_LENGTH}
        strokeDashoffset={ARC_LENGTH * (1 - arcProgress)}
      />
    </svg>
  );
};

// Peace card — FamilySVG + statement
const PeaceCard: React.FC<{ sceneDuration: number }> = ({ sceneDuration }) => {
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

  const text = "A more balanced life. Where the virtual world has less hold. Where you are present with each other.";
  const words = text.split(' ');
  const textStartFrame = 100; // after FamilySVG has mostly drawn

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
      <FamilySVG startFrame={8} />

      <p
        style={{
          fontFamily: serif,
          fontSize: 60,
          fontWeight: 400,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          color: COLORS.ink,
          margin: 0,
          textAlign: 'center',
          maxWidth: 1100,
        }}
      >
        {words.map((word, i) => {
          const delay = textStartFrame + i * 5;
          const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
          const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
          const y = interpolate(progress, [0, 1], [12, 0], { extrapolateRight: 'clamp' });
          const isAccent = word.toLowerCase().replace(/[.,!?"]/g, '') === 'present';

          return (
            <span
              key={i}
              style={{
                opacity,
                display: 'inline-block',
                transform: `translateY(${y}px)`,
                marginRight: '0.25em',
                color: isAccent ? COLORS.accent : COLORS.ink,
              }}
            >
              {word}
            </span>
          );
        })}
      </p>

      <GrainOverlay opacity={0.35} />
    </AbsoluteFill>
  );
};

export const Scene6Peace: React.FC<{ sceneDuration?: number }> = ({
  sceneDuration = SCENE_DURATIONS.scene6,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      {/* Card 1 — FamilySVG + peace statement */}
      <Sequence from={0} durationInFrames={cardDuration} premountFor={fps}>
        <PeaceCard sceneDuration={cardDuration} />
      </Sequence>

      {/* Card 2 — tricolon climax */}
      <Sequence from={cardDuration} durationInFrames={cardDuration} premountFor={fps}>
        <FullBleedStatement
          text="We are building this for parents who held the line. Who waited. Who are still waiting for something worthy of their trust."
          bg={COLORS.paper}
          textColor={COLORS.ink}
          accentWords={["Who waited."]}
          accentColor={COLORS.accent}
          sceneDuration={cardDuration}
          fontSize={60}
          fontStyle="italic"
          grainOpacity={0.35}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
