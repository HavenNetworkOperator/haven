import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { serif } from '../fonts';

type WordRevealProps = {
  text: string;
  frameOffset?: number;
  color: string;
  accentWords?: string[];
  accentColor?: string;
  fontSize?: number;
  fontStyle?: 'normal' | 'italic';
  textAlign?: React.CSSProperties['textAlign'];
  maxWidth?: number;
  staggerPerWord?: number;
  lastWordStagger?: number; // override stagger for the final word
};

export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  frameOffset = 8,
  color,
  accentWords = [],
  accentColor,
  fontSize = 64,
  fontStyle = 'normal',
  textAlign = 'center',
  maxWidth = 1100,
  staggerPerWord = 5,
  lastWordStagger,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <p
      style={{
        fontFamily: serif,
        fontSize,
        fontWeight: 400,
        fontStyle,
        letterSpacing: '-0.025em',
        lineHeight: 1.15,
        color,
        margin: 0,
        textAlign,
        maxWidth,
      }}
    >
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        const effectiveStagger = isLast && lastWordStagger !== undefined ? lastWordStagger : staggerPerWord;
        // For lastWordStagger, delay is based on previous words finishing + extra gap
        const delay = isLast && lastWordStagger !== undefined
          ? frameOffset + (i - 1) * staggerPerWord + lastWordStagger
          : frameOffset + i * staggerPerWord;

        const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
        const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
        const y = interpolate(progress, [0, 1], [12, 0], { extrapolateRight: 'clamp' });
        const isAccent = accentWords.some(a =>
          word.toLowerCase().replace(/[.,!?"]/g, '').includes(a.toLowerCase().replace(/[.,!?"]/g, ''))
        );

        return (
          <span
            key={i}
            style={{
              opacity,
              display: 'inline-block',
              transform: `translateY(${y}px)`,
              marginRight: i < words.length - 1 ? '0.25em' : 0,
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

// Multi-line sequential reveal — each line starts after the previous
export const MultiLineReveal: React.FC<{
  lines: string[];
  frameOffset?: number;
  color: string;
  accentColor?: string;
  fontSize?: number;
  lineSpacing?: number;
  maxWidth?: number;
}> = ({ lines, frameOffset = 12, color, accentColor, fontSize = 54, lineSpacing = 28, maxWidth = 1100 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: lineSpacing,
        textAlign: 'center',
        maxWidth,
      }}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(' ');
        const lineStart = frameOffset + lineIndex * 45;

        return (
          <p
            key={lineIndex}
            style={{
              fontFamily: serif,
              fontSize,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color,
              margin: 0,
            }}
          >
            {words.map((word, i) => {
              const delay = lineStart + i * 5;
              const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
              const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
              const y = interpolate(progress, [0, 1], [12, 0], { extrapolateRight: 'clamp' });

              return (
                <span
                  key={i}
                  style={{
                    opacity,
                    display: 'inline-block',
                    transform: `translateY(${y}px)`,
                    marginRight: '0.25em',
                    color,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};
