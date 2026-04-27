import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SCENE_DURATIONS } from '../constants';
import { GrainOverlay } from '../components/GrainOverlay';
import { MultiLineReveal } from '../components/WordReveal';
import { SimSVG } from '../components/icons/SimSVG';
import { LockSVG } from '../components/icons/LockSVG';
import { ShieldSVG } from '../components/icons/ShieldSVG';
import { DigestSVG } from '../components/icons/DigestSVG';

type ProductCardProps = {
  icon: React.ReactNode;
  lines: string[];
  sceneDuration: number;
  fontSize?: number;
  lineMaxWidth?: number;
  lineSpacing?: number;
};

const ProductCard: React.FC<ProductCardProps> = ({
  icon,
  lines,
  sceneDuration,
  fontSize = 60,
  lineMaxWidth = 1100,
  lineSpacing = 20,
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
      <div style={{ opacity: iconOpacity }}>
        {icon}
      </div>

      <MultiLineReveal
        lines={lines}
        frameOffset={12}
        color={COLORS.paper}
        accentColor={COLORS.accentSoft}
        fontSize={fontSize}
        lineSpacing={lineSpacing}
        maxWidth={lineMaxWidth}
      />

      <GrainOverlay opacity={0.20} />
    </AbsoluteFill>
  );
};

export const Scene5HowItWorks: React.FC<{ sceneDuration?: number }> = ({
  sceneDuration = SCENE_DURATIONS.scene5,
}) => {
  const { fps } = useVideoConfig();

  // Card timings: 120 + 150 + 135 + 135 = 540
  const card1Duration = 120;
  const card2Duration = 150;
  const card3Duration = 135;
  const card4Duration = 135;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* Card 1 — SIM: Haven is a mobile network */}
      <Sequence from={0} durationInFrames={card1Duration} premountFor={fps}>
        <ProductCard
          icon={<SimSVG />}
          lines={[
            "Haven is a mobile network — a SIM card.",
            "Not another app. Not another phone. The safety is in the network itself.",
          ]}
          sceneDuration={card1Duration}
          fontSize={60}
          lineMaxWidth={1400}
        />
      </Sequence>

      {/* Card 2 — Lock: Safety at network layer — extended */}
      <Sequence from={card1Duration} durationInFrames={card2Duration} premountFor={fps}>
        <ProductCard
          icon={<LockSVG />}
          lines={[
            "Safety: built at the network layer.",
            "It can't be deleted.",
            "It can't be bypassed.",
            "It works on any device.",
          ]}
          sceneDuration={card2Duration}
          fontSize={62}
          lineSpacing={8}
        />
      </Sequence>

      {/* Card 3 — Shield: AI on-device */}
      <Sequence from={card1Duration + card2Duration} durationInFrames={card3Duration} premountFor={fps}>
        <ProductCard
          icon={<ShieldSVG />}
          lines={[
            "Our AI detects harmful patterns in real time, on-device.",
            "Your child's messages stay private.",
          ]}
          sceneDuration={card3Duration}
          fontSize={56}
        />
      </Sequence>

      {/* Card 4 — Digest: informed not surveilled */}
      <Sequence from={card1Duration + card2Duration + card3Duration} durationInFrames={card4Duration} premountFor={fps}>
        <ProductCard
          icon={<DigestSVG />}
          lines={[
            "You don't need to see everything.",
            "You need to know if something is wrong.",
          ]}
          sceneDuration={card4Duration}
          fontSize={60}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
