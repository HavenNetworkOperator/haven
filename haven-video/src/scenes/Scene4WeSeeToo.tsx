import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SCENE_DURATIONS } from '../constants';
import { serif } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';
import { FullBleedStatement } from '../components/FullBleedStatement';

const cardDuration = 180;

// Two-paragraph card — parent identity
const ParentIdentityCard: React.FC<{ sceneDuration: number }> = ({ sceneDuration }) => {
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

  const para1 = "We are parents. Not investors. Not engineers who decided children were a market.";
  const para2 = "We helped build the Smartphone Free Childhood movement. We signed the pacts. We held the line.";

  const makeWordSpring = (delay: number) => {
    const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
    return {
      opacity: interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
      y: interpolate(progress, [0, 1], [12, 0], { extrapolateRight: 'clamp' }),
    };
  };

  const renderParagraph = (text: string, startDelay: number, italic = false) => {
    const words = text.split(' ');
    return (
      <p
        style={{
          fontFamily: serif,
          fontSize: 52,
          fontWeight: 400,
          fontStyle: italic ? 'italic' : 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          color: COLORS.ink,
          margin: 0,
          textAlign: 'center',
          maxWidth: 1100,
        }}
      >
        {words.map((word, i) => {
          const { opacity, y } = makeWordSpring(startDelay + i * 5);
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
      </p>
    );
  };

  const para1Words = para1.split(' ').length;
  const para2StartDelay = 8 + para1Words * 5 + 20; // starts after para1 finishes

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.paper,
        opacity: Math.min(fadeIn, fadeOut),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 40,
        padding: '0 160px',
      }}
    >
      {renderParagraph(para1, 8)}
      {renderParagraph(para2, para2StartDelay, true)}
      <GrainOverlay opacity={0.35} />
    </AbsoluteFill>
  );
};

export const Scene4WeSeeToo: React.FC<{ sceneDuration?: number }> = ({
  sceneDuration = SCENE_DURATIONS.scene4,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      {/* Card 1 — parent identity */}
      <Sequence from={0} durationInFrames={cardDuration} premountFor={fps}>
        <ParentIdentityCard sceneDuration={cardDuration} />
      </Sequence>

      {/* Card 2 — the manifesto beat */}
      <Sequence from={cardDuration} durationInFrames={cardDuration} premountFor={fps}>
        <FullBleedStatement
          text="We are pro-tech AND pro-childhood. These are not in conflict. They never were."
          bg={COLORS.paper}
          textColor={COLORS.ink}
          accentWords={["pro-tech", "pro-childhood."]}
          accentColor={COLORS.accent}
          sceneDuration={cardDuration}
          fontSize={80}
          grainOpacity={0.35}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
