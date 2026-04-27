import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from 'remotion';
import { COLORS } from '../constants';
import { serif, sans } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';

// Word-by-word reveal reused from scene pattern
const WordReveal: React.FC<{
  text: string;
  frameOffset?: number;
  color: string;
  accentWords?: string[];
  accentColor?: string;
  fontSize?: number;
  textAlign?: React.CSSProperties['textAlign'];
  maxWidth?: number;
}> = ({ text, frameOffset = 0, color, accentWords = [], accentColor, fontSize = 52, textAlign = 'left', maxWidth = 1000 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <p
      style={{
        fontFamily: serif,
        fontSize,
        fontWeight: 400,
        fontStyle: 'italic',
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
        color,
        margin: 0,
        textAlign,
        maxWidth,
      }}
    >
      {words.map((word, i) => {
        const delay = frameOffset + i * 4;
        const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
        const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
        const y = interpolate(progress, [0, 1], [12, 0], { extrapolateRight: 'clamp' });
        const isAccent = accentWords.some(a => word.toLowerCase().replace(/[.,!?"]/g, '').includes(a.toLowerCase()));
        return (
          <span
            key={i}
            style={{
              opacity,
              display: 'inline-block',
              transform: `translateY(${y}px)`,
              marginRight: '0.25em',
              fontStyle: isAccent ? 'italic' : 'inherit',
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

type StatProps = {
  value: string;
  label: string;
  delay: number;
};

const StatBlock: React.FC<StatProps> = ({ value, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(progress, [0, 1], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        borderTop: `1px solid ${COLORS.ink}`,
        paddingTop: 20,
        minWidth: 240,
      }}
    >
      <p
        style={{
          fontFamily: serif,
          fontSize: 80,
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: COLORS.ink,
          margin: 0,
          marginBottom: 8,
        }}
      >
        <em style={{ fontStyle: 'italic', color: COLORS.accent }}>{value}</em>
      </p>
      <p
        style={{
          fontFamily: sans,
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.muted,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {label}
      </p>
    </div>
  );
};

export const Scene4Campaign: React.FC<{ sceneDuration?: number }> = ({ sceneDuration = 356 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [sceneDuration - 15, sceneDuration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  // Stats appear one at a time, starting at frame 70
  const closingOpacity = interpolate(frame, [230, 260], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const closingY = interpolate(frame, [230, 260], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, opacity }}>
      <AbsoluteFill
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '0 120px',
        }}
      >
        {/* Opening quote */}
        <div style={{ marginBottom: 72 }}>
          <WordReveal
            text={'"We are building this for a better future for our families and the communities they are part of."'}
            frameOffset={8}
            color={COLORS.ink}
            accentWords={['children', 'families', 'communities']}
            accentColor={COLORS.accent}
            fontSize={62}
            textAlign="left"
            maxWidth={1100}
          />
        </div>

        {/* Launch date */}
        <div
          style={{
            marginTop: 56,
            opacity: closingOpacity,
            transform: `translateY(${closingY}px)`,
          }}
        >
          <p
            style={{
              fontFamily: sans,
              fontSize: 28,
              fontWeight: 400,
              color: COLORS.muted,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Target launch date: September 2026.
          </p>
        </div>
      </AbsoluteFill>

      <GrainOverlay opacity={0.35} />
    </AbsoluteFill>
  );
};
