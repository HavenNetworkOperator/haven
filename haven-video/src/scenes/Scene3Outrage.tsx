import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { COLORS, SCENE_DURATIONS } from '../constants';
import { QuoteCard } from '../components/QuoteCard';
import { AnimatedStatCounter } from '../components/AnimatedStatCounter';
import { FullBleedStatement } from '../components/FullBleedStatement';

// Wrapper to centre AnimatedStatCounter in a full-bleed ink card
const StatCard: React.FC<{ sceneDuration: number }> = ({ sceneDuration }) => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.ink,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <AnimatedStatCounter
      from={0}
      to={7}
      suffix=" hours"
      label="every single day"
      startFrame={8}
      countDuration={45}
      numeralColor={COLORS.accentSoft}
      labelColor={COLORS.accentSoft}
      numeralSize={160}
      labelSize={48}
      sceneDuration={sceneDuration}
    />
  </AbsoluteFill>
);

export const Scene3Outrage: React.FC<{ sceneDuration?: number }> = ({
  sceneDuration = SCENE_DURATIONS.scene3,
}) => {
  const { fps } = useVideoConfig();

  const quoteDuration = 180;
  const statDuration = 120;
  const statementDuration = 120;

  // Timeline:
  // 0–180:   Lord Nash quote
  // 180–300: Animated stat counter
  // 300–420: Statement — 14yr vs 40yr
  // 420–540: Statement — chosen not to act

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* Card 1 — Lord Nash quote */}
      <Sequence from={0} durationInFrames={quoteDuration} premountFor={fps}>
        <QuoteCard
          quote="We are facing nothing short of a societal catastrophe caused by the fact that so many of our children are addicted to social media."
          attribution="Lord Nash · UK House of Lords"
          sceneDuration={quoteDuration}
          fontSize={50}
        />
      </Sequence>

      {/* Card 2 — 7 hours animated counter */}
      <Sequence from={quoteDuration} durationInFrames={statDuration} premountFor={fps}>
        <StatCard sceneDuration={statDuration} />
      </Sequence>

      {/* Card 3 — 14yr vs 40yr */}
      <Sequence from={quoteDuration + statDuration} durationInFrames={statementDuration} premountFor={fps}>
        <FullBleedStatement
          text="Every network treats a 14-year-old the same as a 40-year-old. They are not the same."
          bg={COLORS.ink}
          textColor={COLORS.paper}
          accentWords={["14-year-old", "40-year-old."]}
          accentColor={COLORS.accentSoft}
          sceneDuration={statementDuration}
          fontSize={56}
          grainOpacity={0.20}
        />
      </Sequence>

      {/* Card 4 — chosen not to act */}
      <Sequence from={quoteDuration + statDuration + statementDuration} durationInFrames={statementDuration} premountFor={fps}>
        <FullBleedStatement
          text="The platforms know what they're doing. The evidence is overwhelming. They have chosen not to act."
          bg={COLORS.ink}
          textColor={COLORS.paper}
          accentWords={["chosen"]}
          accentColor={COLORS.accentSoft}
          sceneDuration={statementDuration}
          fontSize={56}
          grainOpacity={0.20}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
