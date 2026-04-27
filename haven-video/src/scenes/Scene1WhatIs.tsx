import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { COLORS, SCENE_DURATIONS } from '../constants';
import { FullBleedStatement } from '../components/FullBleedStatement';

const cardDuration = 100;

export const Scene1WhatIs: React.FC<{ sceneDuration?: number }> = ({
  sceneDuration = SCENE_DURATIONS.scene1,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* Card 1 — social life in their pocket */}
      <Sequence from={0} durationInFrames={cardDuration} premountFor={fps}>
        <FullBleedStatement
          text="Your teenager is carrying their social life, their social status, and their darkest moments — in their pocket. All day. All night."
          bg={COLORS.ink}
          textColor={COLORS.paper}
          sceneDuration={cardDuration}
          fontSize={52}
          grainOpacity={0.20}
        />
      </Sequence>

      {/* Card 2 — design choice */}
      <Sequence from={cardDuration} durationInFrames={cardDuration} premountFor={fps}>
        <FullBleedStatement
          text="Five, six, seven hours a day on social media. Not a teenager's choice. A design choice."
          bg={COLORS.ink}
          textColor={COLORS.paper}
          accentWords={["design"]}
          accentColor={COLORS.accentSoft}
          sceneDuration={cardDuration}
          fontSize={58}
          grainOpacity={0.20}
        />
      </Sequence>

      {/* Card 3 — built to keep them hooked */}
      <Sequence from={cardDuration * 2} durationInFrames={cardDuration} premountFor={fps}>
        <FullBleedStatement
          text="The phone in their hand was not built for them. It was built to keep them hooked."
          bg={COLORS.ink}
          textColor={COLORS.paper}
          accentWords={["hooked."]}
          accentColor={COLORS.accentSoft}
          sceneDuration={cardDuration}
          fontSize={58}
          grainOpacity={0.20}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
