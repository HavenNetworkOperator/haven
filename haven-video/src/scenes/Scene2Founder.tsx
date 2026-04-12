import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence, spring, interpolate } from 'remotion';
import { COLORS } from '../constants';
import { serif } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';

// Word-by-word stagger reveal
const WordReveal: React.FC<{
  text: string;
  frameOffset?: number;
  color: string;
  accentWords?: string[];
  accentColor?: string;
  fontSize?: number;
}> = ({ text, frameOffset = 0, color, accentWords = [], accentColor, fontSize = 72 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(' ');

  return (
    <p
      style={{
        fontFamily: serif,
        fontSize,
        fontWeight: 400,
        letterSpacing: '-0.025em',
        lineHeight: 1.15,
        color,
        margin: 0,
        textAlign: 'center',
        maxWidth: 1100,
      }}
    >
      {words.map((word, i) => {
        const delay = frameOffset + i * 5;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200 },
        });
        const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
        const y = interpolate(progress, [0, 1], [14, 0], { extrapolateRight: 'clamp' });

        const isAccent = accentWords.some(a => word.toLowerCase().includes(a.toLowerCase()));

        return (
          <span
            key={i}
            style={{
              opacity,
              display: 'inline-block',
              transform: `translateY(${y}px)`,
              marginRight: '0.25em',
              fontStyle: isAccent ? 'italic' : 'normal',
              color: isAccent && accentColor ? accentColor : color,
            }}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
};

type StatementProps = {
  text: string;
  bg: string;
  textColor: string;
  accentWords?: string[];
  accentColor?: string;
  sceneDuration: number;
  fontSize?: number;
};

const FullBleedStatement: React.FC<StatementProps> = ({
  text,
  bg,
  textColor,
  accentWords,
  accentColor,
  sceneDuration,
  fontSize = 72,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [sceneDuration - 15, sceneDuration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        opacity: Math.min(fadeIn, fadeOut),
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 160px',
      }}
    >
      <WordReveal
        text={text}
        frameOffset={8}
        color={textColor}
        accentWords={accentWords}
        accentColor={accentColor}
        fontSize={fontSize}
      />
      <GrainOverlay opacity={0.35} />
    </AbsoluteFill>
  );
};

export const Scene2Founder: React.FC<{ sceneDuration?: number }> = ({ sceneDuration = 465 }) => {
  const { fps } = useVideoConfig();

  const cardDuration = 155;

  return (
    <AbsoluteFill>
      {/* Statement 1 — paper bg */}
      <Sequence from={0} durationInFrames={cardDuration} premountFor={fps}>
        <FullBleedStatement
          text="I started Haven because my child is getting a phone soon."
          bg={COLORS.paper}
          textColor={COLORS.ink}
          accentWords={['Haven']}
          accentColor={COLORS.accent}
          sceneDuration={cardDuration}
          fontSize={68}
        />
      </Sequence>

      {/* Statement 2 — ink bg (inverted) */}
      <Sequence from={cardDuration} durationInFrames={cardDuration} premountFor={fps}>
        <FullBleedStatement
          text="Every network treats a ten-year-old the same as a forty-year-old."
          bg={COLORS.ink}
          textColor={COLORS.paper}
          accentWords={['ten-year-old', 'forty-year-old.']}
          accentColor={COLORS.accentSoft}
          sceneDuration={cardDuration}
          fontSize={64}
        />
      </Sequence>

      {/* Statement 3 — paper bg */}
      <Sequence from={cardDuration * 2} durationInFrames={cardDuration + 0} premountFor={fps}>
        <FullBleedStatement
          text="They just need to find the passcode."
          bg={COLORS.paper}
          textColor={COLORS.ink}
          accentWords={['passcode.']}
          accentColor={COLORS.accent}
          sceneDuration={cardDuration}
          fontSize={72}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
