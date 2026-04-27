import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { WordReveal } from './WordReveal';
import { GrainOverlay } from './GrainOverlay';

type FullBleedStatementProps = {
  text: string;
  bg: string;
  textColor: string;
  accentWords?: string[];
  accentColor?: string;
  sceneDuration: number;
  fontSize?: number;
  fontStyle?: 'normal' | 'italic';
  textAlign?: React.CSSProperties['textAlign'];
  grainOpacity?: number;
  frameOffset?: number;
  maxWidth?: number;
};

export const FullBleedStatement: React.FC<FullBleedStatementProps> = ({
  text,
  bg,
  textColor,
  accentWords,
  accentColor,
  sceneDuration,
  fontSize = 64,
  fontStyle = 'normal',
  textAlign = 'center',
  grainOpacity = 0.35,
  frameOffset = 8,
  maxWidth = 1100,
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
        frameOffset={frameOffset}
        color={textColor}
        accentWords={accentWords}
        accentColor={accentColor}
        fontSize={fontSize}
        fontStyle={fontStyle}
        textAlign={textAlign}
        maxWidth={maxWidth}
      />
      <GrainOverlay opacity={grainOpacity} />
    </AbsoluteFill>
  );
};
