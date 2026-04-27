import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { COLORS } from '../constants';
import { serif, sans } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';

// SVG "draws itself" using strokeDashoffset animation
const useDrawProgress = (startFrame: number, endFrame: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
};

// SIM card drawing itself
const SimSVG: React.FC = () => {
  const p = useDrawProgress(8, 52);
  const SIM = 220;
  return (
    <svg width={120} height={120} viewBox="0 0 60 60" fill="none">
      {/* SIM card outline */}
      <path
        d="M10 8 L38 8 L50 20 L50 52 L10 52 Z"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={SIM}
        strokeDashoffset={SIM * (1 - p)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chip */}
      <rect
        x="20"
        y="26"
        width="20"
        height="15"
        rx="2"
        stroke={COLORS.accentSoft}
        strokeWidth="1.2"
        fill="none"
        strokeDasharray={80}
        strokeDashoffset={80 * (1 - interpolate(p, [0.4, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
      />
    </svg>
  );
};

// Lock drawing itself
const LockSVG: React.FC = () => {
  const p = useDrawProgress(8, 52);
  return (
    <svg width={120} height={120} viewBox="0 0 60 60" fill="none">
      <rect
        x="12"
        y="28"
        width="36"
        height="26"
        rx="4"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={140}
        strokeDashoffset={140 * (1 - p)}
        strokeLinecap="round"
      />
      <path
        d="M20 28 V20 C20 13 40 13 40 20 V28"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={60}
        strokeDashoffset={60 * (1 - interpolate(p, [0.3, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
        strokeLinecap="round"
      />
      <circle
        cx="30"
        cy="41"
        r="3"
        fill={COLORS.accentSoft}
        opacity={interpolate(p, [0.7, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
    </svg>
  );
};

// Shield with pulse
const ShieldSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useDrawProgress(8, 52);
  // Pulse every 1.5s
  const pulseOpacity = interpolate(frame % Math.round(1.5 * fps), [0, 15, 30], [0.3, 0.8, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <svg width={120} height={120} viewBox="0 0 60 60" fill="none">
      {/* Pulse ring */}
      <circle
        cx="30"
        cy="32"
        r="22"
        stroke={COLORS.accentSoft}
        strokeWidth="0.5"
        fill="none"
        opacity={pulseOpacity * p}
      />
      <path
        d="M30 6 L10 14 V30 C10 42 20 50 30 54 C40 50 50 42 50 30 V14 Z"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={180}
        strokeDashoffset={180 * (1 - p)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 30 L27 36 L38 24"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={30}
        strokeDashoffset={30 * (1 - interpolate(p, [0.6, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
        strokeLinecap="round"
      />
    </svg>
  );
};

// Document/digest icon
const DigestSVG: React.FC = () => {
  const p = useDrawProgress(8, 52);
  return (
    <svg width={120} height={120} viewBox="0 0 60 60" fill="none">
      <rect
        x="10"
        y="8"
        width="40"
        height="48"
        rx="4"
        stroke={COLORS.accentSoft}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={200}
        strokeDashoffset={200 * (1 - p)}
        strokeLinecap="round"
      />
      {/* Lines representing content */}
      {[20, 28, 36, 44].map((y, i) => {
        const lp = interpolate(p, [0.3 + i * 0.12, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const width = i === 3 ? 20 : 30;
        return (
          <line
            key={i}
            x1="18"
            y1={y}
            x2={18 + width * lp}
            y2={y}
            stroke={COLORS.accentSoft}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

// Word-by-word stagger for Scene 3
const WordReveal: React.FC<{
  text: string;
  frameOffset?: number;
  color: string;
  accentWords?: string[];
  accentColor?: string;
  fontSize?: number;
}> = ({ text, frameOffset = 60, color, accentWords = [], accentColor, fontSize = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <p
      style={{
        fontFamily: serif,
        fontSize,
        fontWeight: 400,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        color,
        margin: 0,
        textAlign: 'center',
        maxWidth: 1100,
      }}
    >
      {words.map((word, i) => {
        const delay = frameOffset + i * 5;
        const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
        const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
        const y = interpolate(progress, [0, 1], [12, 0], { extrapolateRight: 'clamp' });
        const isAccent = accentWords.some(a => word.toLowerCase().replace(/[.,!?]/g, '').includes(a.toLowerCase()));
        return (
          <span
            key={i}
            style={{
              opacity,
              display: 'inline-block',
              transform: `translateY(${y}px)`,
              marginRight: '0.25em',
              fontStyle: 'normal',
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

// Multi-line reveal — each sentence on its own line, revealed sequentially
const MultiLineReveal: React.FC<{
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
        // Each line starts 30 frames after the previous line's first word
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
                    fontStyle: 'normal',
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

type ProductCardProps = {
  icon: React.ReactNode;
  mainText?: string;
  lines?: string[];
  accentWords?: string[];
  sceneDuration: number;
  fontSize?: number;
  lineMaxWidth?: number;
};

const ProductCard: React.FC<ProductCardProps> = ({
  icon,
  mainText,
  lines,
  accentWords = [],
  sceneDuration,
  fontSize = 60,
  lineMaxWidth,
}) => {
  const frame = useCurrentFrame();

  const iconProgress = spring({ frame, fps: 30, config: { damping: 200 } });
  const iconOpacity = interpolate(iconProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [sceneDuration - 15, sceneDuration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.ink,
        opacity: Math.min(fadeIn, fadeOut),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 40,
        padding: '0 160px',
      }}
    >
      {/* Icon */}
      <div style={{ opacity: iconOpacity }}>
        {icon}
      </div>

      {/* Text — multi-line or single block */}
      {lines ? (
        <MultiLineReveal
          lines={lines}
          frameOffset={12}
          color={COLORS.paper}
          accentColor={COLORS.accentSoft}
          fontSize={fontSize}
          lineSpacing={20}
          maxWidth={lineMaxWidth ?? 1100}
        />
      ) : (
        <WordReveal
          text={mainText ?? ''}
          frameOffset={12}
          color={COLORS.paper}
          accentWords={accentWords}
          accentColor={COLORS.accentSoft}
          fontSize={fontSize}
        />
      )}

      <GrainOverlay opacity={0.2} />
    </AbsoluteFill>
  );
};

// Special card for the network-layer slide: separate lines, 1.5x duration
const NetworkLayerCard: React.FC<{ sceneDuration: number }> = ({ sceneDuration }) => {
  const frame = useCurrentFrame();

  const iconProgress = spring({ frame, fps: 30, config: { damping: 200 } });
  const iconOpacity = interpolate(iconProgress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [sceneDuration - 15, sceneDuration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.ink,
        opacity: Math.min(fadeIn, fadeOut),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 40,
        padding: '0 160px',
      }}
    >
      <div style={{ opacity: iconOpacity }}>
        <LockSVG />
      </div>

      <MultiLineReveal
        lines={[
          "Safety: built in at the network layer.",
          "It can't be deleted.",
          "It can't be bypassed.",
        ]}
        frameOffset={12}
        color={COLORS.paper}
        accentColor={COLORS.accentSoft}
        fontSize={62}
        lineSpacing={8}
      />

      <GrainOverlay opacity={0.2} />
    </AbsoluteFill>
  );
};

export const Scene3Product: React.FC<{ sceneDuration?: number }> = ({ sceneDuration = 590 }) => {
  const { fps } = useVideoConfig();
  const cardDuration = 115;
  const card2Duration = 172; // 1.5x (×0.85×0.9)

  // Timings:
  // Card 1: 0–115
  // Card 2: 115–287  (172f)
  // Card 3: 287–402
  // Card 4: 402–531  (143f)

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* Card 1: Haven is a mobile network */}
      <Sequence from={0} durationInFrames={cardDuration} premountFor={fps}>
        <ProductCard
          icon={<SimSVG />}
          lines={['Haven is a safety-first mobile network.', 'Not another phone. Not another app.']}
          sceneDuration={cardDuration}
          fontSize={64}
          lineMaxWidth={1500}
        />
      </Sequence>

      {/* Card 2: Safety at the network layer — 1.5x duration, separate lines */}
      <Sequence from={cardDuration} durationInFrames={card2Duration} premountFor={fps}>
        <NetworkLayerCard sceneDuration={card2Duration} />
      </Sequence>

      {/* Card 3: AI on-device */}
      <Sequence from={cardDuration + card2Duration} durationInFrames={cardDuration} premountFor={fps}>
        <ProductCard
          icon={<ShieldSVG />}
          mainText="Our AI detects harmful patterns in real time, on-device. Messages stay private."
          accentWords={['on-device.', 'private.']}
          sceneDuration={cardDuration}
          fontSize={50}
        />
      </Sequence>

      {/* Card 4: Weekly digest */}
      <Sequence from={cardDuration + card2Duration + cardDuration} durationInFrames={cardDuration + 14} premountFor={fps}>
        <ProductCard
          icon={<DigestSVG />}
          mainText="As a parent: be notified when it matters. Not a surveillance feed."
          accentWords={['matters.', 'surveillance']}
          sceneDuration={cardDuration + 14}
          fontSize={56}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
