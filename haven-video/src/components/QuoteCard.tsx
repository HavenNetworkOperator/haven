import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { serif, sans } from '../fonts';
import { COLORS } from '../constants';
import { GrainOverlay } from './GrainOverlay';

type QuoteCardProps = {
  quote: string;
  attribution: string;
  sceneDuration: number;
  quoteColor?: string;
  attributionColor?: string;
  bg?: string;
  fontSize?: number;
  grainOpacity?: number;
};

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  attribution,
  sceneDuration,
  quoteColor = COLORS.paper,
  attributionColor = COLORS.accentSoft,
  bg = COLORS.ink,
  fontSize = 52,
  grainOpacity = 0.25,
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

  // Quotation mark draws itself over frames 0–30
  const quoteMarkProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const quoteMarkOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Word-by-word reveal starts at frame 35
  const words = quote.split(' ');

  // Attribution fades in after all words
  const attrDelay = 35 + words.length * 5 + 15;
  const attrProgress = spring({ frame: frame - attrDelay, fps, config: { damping: 200 } });
  const attrOpacity = interpolate(attrProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const attrY = interpolate(attrProgress, [0, 1], [12, 0], { extrapolateRight: 'clamp' });

  // Quotation mark SVG path length ~40
  const QM_LENGTH = 40;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        opacity: Math.min(fadeIn, fadeOut),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 160px',
      }}
    >
      {/* Opening quotation mark — decorative large " */}
      <div style={{ marginBottom: 32, opacity: quoteMarkOpacity }}>
        <svg width={60} height={48} viewBox="0 0 60 48" fill="none">
          {/* Two open-quote rectangles drawn via strokeDashoffset */}
          <rect
            x="4" y="4" width="20" height="18" rx="3"
            stroke={COLORS.accent}
            strokeWidth="3"
            fill="none"
            strokeDasharray={QM_LENGTH * 2}
            strokeDashoffset={(QM_LENGTH * 2) * (1 - quoteMarkProgress)}
            strokeLinecap="round"
          />
          <rect
            x="36" y="4" width="20" height="18" rx="3"
            stroke={COLORS.accent}
            strokeWidth="3"
            fill="none"
            strokeDasharray={QM_LENGTH * 2}
            strokeDashoffset={(QM_LENGTH * 2) * (1 - interpolate(quoteMarkProgress, [0.3, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
            strokeLinecap="round"
          />
          {/* Descenders */}
          <line
            x1="14" y1="22" x2="8" y2="36"
            stroke={COLORS.accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={16}
            strokeDashoffset={16 * (1 - interpolate(quoteMarkProgress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
          />
          <line
            x1="46" y1="22" x2="40" y2="36"
            stroke={COLORS.accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={16}
            strokeDashoffset={16 * (1 - interpolate(quoteMarkProgress, [0.6, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
          />
        </svg>
      </div>

      {/* Quote body — word-by-word reveal */}
      <p
        style={{
          fontFamily: serif,
          fontSize,
          fontWeight: 400,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.3,
          color: quoteColor,
          margin: 0,
          marginBottom: 40,
          maxWidth: 1200,
        }}
      >
        {words.map((word, i) => {
          const delay = 35 + i * 5;
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
              }}
            >
              {word}
            </span>
          );
        })}
      </p>

      {/* Attribution line */}
      <div
        style={{
          opacity: attrOpacity,
          transform: `translateY(${attrY}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{ width: 48, height: 1, backgroundColor: COLORS.line }} />
        <p
          style={{
            fontFamily: sans,
            fontSize: 28,
            fontWeight: 400,
            color: attributionColor,
            margin: 0,
            letterSpacing: '0.02em',
          }}
        >
          {attribution}
        </p>
      </div>

      <GrainOverlay opacity={grainOpacity} />
    </AbsoluteFill>
  );
};
