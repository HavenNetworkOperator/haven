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
          fontSize: 16,
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

export const Scene4Campaign: React.FC<{ sceneDuration?: number }> = ({ sceneDuration = 465 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [sceneDuration - 15, sceneDuration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  // Stats appear one at a time, starting at frame 70
  const closingOpacity = interpolate(frame, [300, 340], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const closingY = interpolate(frame, [300, 340], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
            text={'"The people who should fund this are the parents it\u2019s built for."'}
            frameOffset={8}
            color={COLORS.ink}
            accentWords={['parents']}
            accentColor={COLORS.accent}
            fontSize={52}
            textAlign="left"
            maxWidth={1000}
          />
        </div>

        {/* Stats — sequential, 80 frames apart */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 80,
            alignItems: 'flex-start',
          }}
        >
          <StatBlock value="£25" label="Founding member SIM — one-time" delay={70} />
          <StatBlock value="£8/mo" label="Locked-for-life monthly rate" delay={130} />
          <StatBlock value="500" label="Founding SIM slots total" delay={190} />
        </div>

        {/* Closing line */}
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
              fontSize: 20,
              fontWeight: 400,
              color: COLORS.muted,
              margin: 0,
              maxWidth: 680,
              lineHeight: 1.6,
            }}
          >
            Targeting Q3 this year. Every backer gets honest updates — not just the good news.
          </p>
        </div>
      </AbsoluteFill>

      <GrainOverlay opacity={0.35} />
    </AbsoluteFill>
  );
};
