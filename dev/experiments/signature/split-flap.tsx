'use client';

import { useLayoutEffect, useState, useSyncExternalStore } from 'react';
import type { ComponentPropsWithRef, CSSProperties } from 'react';
import './flap.css';

export interface SplitFlapProps extends Omit<
  ComponentPropsWithRef<'span'>,
  'children'
> {
  /** Short LTR readout with independent glyphs. Use ordinary text for joined or mixed-direction scripts. The active flip finishes before the latest pending reading begins. */
  value: string;
  /** Milliseconds per complete flip. Positive changes apply to the next flip; zero settles immediately. Invalid or negative values use the default. Reduced motion always settles immediately. @default 400 */
  duration?: number;
}

const motionQuery = '(prefers-reduced-motion: reduce), (forced-colors: active)';
const subscribeMotion = (listener: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
};
const motionSnapshot = () => window.matchMedia(motionQuery).matches;
const serverMotionSnapshot = () => false;

// Segment graphemes so combining marks and emoji remain one cell where supported.
const segment = (text: string) => {
  const Segmenter = (
    Intl as typeof Intl & {
      Segmenter?: new (
        locale?: string,
        options?: { granularity: 'grapheme' },
      ) => { segment(input: string): Iterable<{ segment: string }> };
    }
  ).Segmenter;
  return Segmenter
    ? Array.from(
        new Segmenter(undefined, { granularity: 'grapheme' }).segment(text),
        (part) => part.segment,
      )
    : Array.from(text);
};

/** An olive-framed mechanical readout with one complete accessible reading. */
export function SplitFlap({
  value,
  duration = 400,
  className,
  style,
  ...props
}: SplitFlapProps) {
  const immediate = useSyncExternalStore(
    subscribeMotion,
    motionSnapshot,
    serverMotionSnapshot,
  );
  const requestedDuration =
    Number.isFinite(duration) && duration >= 0 ? duration : 400;
  const [reading, setReading] = useState({
    from: value,
    to: value,
    flipping: false,
    cycle: 0,
    duration: requestedDuration,
  });

  useLayoutEffect(() => {
    setReading((current) => {
      if (immediate || requestedDuration === 0) {
        return current.to === value && !current.flipping
          ? current
          : { ...current, from: value, to: value, flipping: false };
      }
      // Keep only the prop's latest reading while this cycle completes.
      if (current.flipping || current.to === value) return current;
      return {
        from: current.to,
        to: value,
        flipping: true,
        cycle: current.cycle + 1,
        duration: requestedDuration,
      };
    });
  }, [value, requestedDuration, immediate, reading.flipping]);

  const displayed = immediate || requestedDuration === 0 ? value : reading.to;
  const cells = segment(displayed);
  const previous = segment(reading.from);
  const flipping = reading.flipping && !immediate && requestedDuration > 0;
  return (
    <span
      {...props}
      className={['signature-data-flap', className].filter(Boolean).join(' ')}
      style={
        {
          ...style,
          '--flap-duration': `${reading.duration}ms`,
        } as CSSProperties
      }
    >
      <span className="signature-data-sr">{value}</span>
      <span
        className="signature-data-cells"
        dir="ltr"
        aria-hidden="true"
        data-flipping={flipping || undefined}
        key={reading.cycle}
        onAnimationEnd={(event) => {
          if (
            event.target !== event.currentTarget ||
            event.animationName !== 'signature-flap-cycle'
          )
            return;
          setReading((current) =>
            current.cycle === reading.cycle && current.flipping
              ? { ...current, from: current.to, flipping: false }
              : current,
          );
        }}
      >
        {cells.map((cell, index) => (
          <span className="signature-data-cell" key={index}>
            <span className="signature-data-cell-value">
              {cell.trim() ? cell : '\u00a0'}
            </span>
            {flipping && previous[index] !== cell && (
              <>
                <span className="signature-data-old-bottom">
                  <span>{previous[index] || '\u00a0'}</span>
                </span>
                <span className="signature-data-old-leaf">
                  <span>{previous[index] || '\u00a0'}</span>
                </span>
                <span className="signature-data-new-leaf">
                  <span>{cell.trim() ? cell : '\u00a0'}</span>
                </span>
              </>
            )}
            <span className="signature-data-cell-hinges" />
          </span>
        ))}
      </span>
    </span>
  );
}
