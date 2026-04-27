import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SCENE_DURATIONS } from '../constants';
import { serif, sans } from '../fonts';
import { GrainOverlay } from '../components/GrainOverlay';
import { FadeUpText } from '../components/FadeUpText';
import { FullBleedStatement } from '../components/FullBleedStatement';

// Community + launch date beat (frames 0–250 within this sub-scene)
const CommunitySection: React.FC<{ sceneDuration: number }> = ({ sceneDuration }) => {
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

  const text = "We are building this for a better future for our families and the communities they are part of.";
  const words = text.split(' ');

  const launchOpacity = interpolate(frame, [160, 185], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const launchY = interpolate(frame, [160, 185], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.paper,
        opacity: Math.min(fadeIn, fadeOut),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 120px',
      }}
    >
      {/* Quote */}
      <p
        style={{
          fontFamily: serif,
          fontSize: 60,
          fontWeight: 400,
          fontStyle: 'italic',
          letterSpacing: '-0.025em',
          lineHeight: 1.25,
          color: COLORS.ink,
          margin: 0,
          marginBottom: 56,
          maxWidth: 1300,
        }}
      >
        {words.map((word, i) => {
          const delay = 8 + i * 4;
          const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
          const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: 'clamp' });
          const y = interpolate(progress, [0, 1], [12, 0], { extrapolateRight: 'clamp' });
          const isAccent = ['families', 'communities'].includes(word.replace(/[.,]/g, ''));

          return (
            <span
              key={i}
              style={{
                opacity,
                display: 'inline-block',
                transform: `translateY(${y}px)`,
                marginRight: '0.25em',
                color: isAccent ? COLORS.accent : COLORS.ink,
              }}
            >
              {word}
            </span>
          );
        })}
      </p>

      {/* Launch date */}
      <div style={{ opacity: launchOpacity, transform: `translateY(${launchY}px)` }}>
        <p
          style={{
            fontFamily: sans,
            fontSize: 28,
            fontWeight: 400,
            color: COLORS.muted,
            margin: 0,
            lineHeight: 1.6,
            letterSpacing: '0.01em',
          }}
        >
          Target launch date: September 2026.
        </p>
      </div>

      <GrainOverlay opacity={0.35} />
    </AbsoluteFill>
  );
};

// Animated logo mark (from Scene5EndCard)
const EndLogoMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 200 } });
  const drift = interpolate(
    frame % (12 * fps),
    [0, 6 * fps, 12 * fps],
    [0, 8, 0]
  );

  const size = 120;
  const innerSize = size - size * (6 / 28);

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${scale}) rotate(${drift}deg)`,
        transformOrigin: 'center center',
        position: 'relative',
      }}
    >
      <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: COLORS.accent, position: 'absolute', top: 0, left: 0 }} />
      <div style={{ width: innerSize, height: innerSize, borderRadius: '50%', backgroundColor: COLORS.paper, position: 'absolute', top: size * (6 / 28) / 2, left: size * (6 / 28) / 2 }} />
    </div>
  );
};

// End card section
const EndCardSection: React.FC<{ sceneDuration: number }> = ({ sceneDuration }) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeToBlack = interpolate(
    frame,
    [sceneDuration - 45, sceneDuration - 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper, opacity: fadeIn }}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <FadeUpText delay={0}>
          <div style={{ marginBottom: 40 }}>
            <EndLogoMark />
          </div>
        </FadeUpText>

        <FadeUpText delay={15}>
          <h1
            style={{
              fontFamily: serif,
              fontSize: 96,
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: COLORS.ink,
              margin: 0,
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            Haven
          </h1>
        </FadeUpText>

        <FadeUpText delay={25}>
          <p
            style={{
              fontFamily: sans,
              fontSize: 20,
              fontWeight: 400,
              color: COLORS.muted,
              margin: 0,
              marginBottom: 56,
              textAlign: 'center',
              letterSpacing: '0.02em',
            }}
          >
            Safe mobile network for parents & teens.
          </p>
        </FadeUpText>

        <FadeUpText delay={35}>
          <div style={{ width: 48, height: 1, backgroundColor: COLORS.line, marginBottom: 40 }} />
        </FadeUpText>

        <FadeUpText delay={40}>
          <p
            style={{
              fontFamily: sans,
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: COLORS.accent,
              margin: 0,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            Join the waiting list
          </p>
        </FadeUpText>

        <FadeUpText delay={48}>
          <p
            style={{
              fontFamily: sans,
              fontSize: 32,
              fontWeight: 400,
              color: COLORS.inkSoft,
              margin: 0,
              textAlign: 'center',
              letterSpacing: '0.01em',
            }}
          >
            gethavenmobile.com
          </p>
        </FadeUpText>

      </AbsoluteFill>

      {/* Fade to black */}
      <AbsoluteFill
        style={{ backgroundColor: '#000', opacity: fadeToBlack, pointerEvents: 'none' }}
      />

      <GrainOverlay opacity={0.35} />
    </AbsoluteFill>
  );
};

export const Scene7JoinUs: React.FC<{ sceneDuration?: number }> = ({
  sceneDuration = SCENE_DURATIONS.scene7,
}) => {
  const { fps } = useVideoConfig();

  // Internal timeline (750 frames total):
  // [0–150]   Opening community statement
  // [150–300] Invitation italic quote
  // [300–550] Stats + closing copy (250f)
  // [550–750] End card (200f)

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      {/* Opening — community statement */}
      <Sequence from={0} durationInFrames={150} premountFor={fps}>
        <FullBleedStatement
          text="Haven is community-built. No VC funding. No growth-at-all-costs mandate. Just parents, building for parents."
          bg={COLORS.paper}
          textColor={COLORS.ink}
          accentWords={["parents,"]}
          accentColor={COLORS.accent}
          sceneDuration={150}
          fontSize={60}
          grainOpacity={0.35}
        />
      </Sequence>

      {/* Invitation — italic */}
      <Sequence from={150} durationInFrames={150} premountFor={fps}>
        <FullBleedStatement
          text="If you've been waiting for this to exist — it does now. Claim your founding spot."
          bg={COLORS.paper}
          textColor={COLORS.ink}
          accentWords={["founding"]}
          accentColor={COLORS.accent}
          sceneDuration={150}
          fontSize={68}
          fontStyle="italic"
          grainOpacity={0.35}
        />
      </Sequence>

      {/* Community statement + launch date */}
      <Sequence from={300} durationInFrames={250} premountFor={fps}>
        <CommunitySection sceneDuration={250} />
      </Sequence>

      {/* End card */}
      <Sequence from={550} durationInFrames={200} premountFor={fps}>
        <EndCardSection sceneDuration={200} />
      </Sequence>
    </AbsoluteFill>
  );
};
