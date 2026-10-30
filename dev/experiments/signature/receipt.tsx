'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface ReceiptProps extends ComponentPropsWithRef<'article'> {
  /** Reveal the slip after the app completes its operation. No work or progress is simulated. @default false */
  issued?: boolean;
  /** Change this identity to drop the previous slip before issuing its replacement. */
  issueKey?: string | number;
  /** Entry duration in milliseconds; exit uses 75% of this value. Zero or reduced motion settles immediately. @default 700 */
  duration?: number;
}

type Slip = {
  key: string | number;
  content: ReactNode;
  phase: 'enter' | 'steady' | 'exit';
};

/** A compact output slot. The app owns completion, slip content and output actions. */
export function Receipt({
  className,
  issued = false,
  issueKey = 0,
  duration = 700,
  children,
  ...props
}: ReceiptProps) {
  const node = useRef<HTMLDivElement>(null);
  const latest = useRef({ issued, issueKey, children });
  const [reduced, setReduced] = useState(false);
  const [slip, setSlip] = useState<Slip | null>(() =>
    issued ? { key: issueKey, content: children, phase: 'enter' } : null,
  );
  const milliseconds =
    Number.isFinite(duration) && duration >= 0 ? duration : 700;

  useLayoutEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    latest.current = { issued, issueKey, children };
    setSlip((current) => {
      if (!issued || (current && current.key !== issueKey)) {
        return current && current.phase !== 'exit'
          ? { ...current, phase: 'exit' }
          : current;
      }
      if (!current) return { key: issueKey, content: children, phase: 'enter' };
      if (current.phase === 'exit')
        return { ...current, content: children, phase: 'enter' };
      return current.content === children
        ? current
        : { ...current, content: children };
    });
  }, [issued, issueKey, children]);

  useLayoutEffect(() => {
    const element = node.current;
    if (!element || !slip) return;
    if (reduced || milliseconds === 0) {
      element.style.transform = 'none';
      element.style.opacity = '1';
      const request = latest.current;
      setSlip(
        request.issued
          ? {
              key: request.issueKey,
              content: request.children,
              phase: 'steady',
            }
          : null,
      );
      return;
    }
    if (slip.phase === 'steady') return;
    let active = true;
    const exiting = slip.phase === 'exit';
    const computed = getComputedStyle(element);
    const animation = element.animate(
      [
        { transform: computed.transform, opacity: computed.opacity },
        exiting
          ? { transform: 'translateY(100px) rotate(7deg)', opacity: 0 }
          : { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      ],
      {
        duration: milliseconds * (exiting ? 0.75 : 1),
        easing: exiting
          ? 'cubic-bezier(.45,0,.8,.4)'
          : 'cubic-bezier(.25,.1,.75,.9)',
        fill: 'forwards',
      },
    );
    void animation.finished.then(
      () => {
        if (!active) return;
        active = false;
        if (exiting) {
          const request = latest.current;
          // A replacement starts above the slot after the old paper has left.
          element.style.transform = 'translateY(-100%)';
          element.style.opacity = '1';
          animation.cancel();
          setSlip(
            request.issued
              ? {
                  key: request.issueKey,
                  content: request.children,
                  phase: 'enter',
                }
              : null,
          );
        } else {
          element.style.transform = 'none';
          element.style.opacity = '1';
          animation.cancel();
          setSlip((current) =>
            current && current.phase === 'enter'
              ? { ...current, phase: 'steady' }
              : current,
          );
        }
      },
      () => {},
    );
    return () => {
      // Preserve the rendered pose before cancelling so a reversal is continuous.
      if (active) {
        const pose = getComputedStyle(element);
        element.style.transform = pose.transform;
        element.style.opacity = pose.opacity;
      }
      active = false;
      animation.cancel();
    };
  }, [slip?.key, slip?.phase, milliseconds, reduced]);

  return (
    <article
      {...props}
      data-issued={issued || undefined}
      data-phase={slip?.phase ?? 'empty'}
      className={['signature-data-receipt', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="signature-data-printer" aria-hidden="true">
        <span className="signature-data-printer-rim" />
        <span className="signature-data-printer-light" />
      </div>
      <div className="signature-data-output">
        {slip && (
          <div
            ref={node}
            className="signature-data-slip"
            aria-hidden={!issued || slip.key !== issueKey || undefined}
            inert={!issued || slip.key !== issueKey}
          >
            {slip.content}
          </div>
        )}
      </div>
    </article>
  );
}

export interface ReceiptRowsProps extends ComponentPropsWithRef<'dl'> {
  /** Emphasize this group as the app-calculated total. */
  total?: boolean;
}

/** A group of registered label/value pairs, optionally marked as the total. */
export function ReceiptRows({
  className,
  total = false,
  ...props
}: ReceiptRowsProps) {
  return (
    <dl
      {...props}
      className={[
        'signature-data-rows',
        total && 'signature-data-total',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

export interface ReceiptRowProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children'
> {
  /** Complete text or content describing the value. */
  label: ReactNode;
  /** App-formatted value; Receipt performs no calculation or parsing. */
  value: ReactNode;
}

/** A single label and already formatted value. */
export function ReceiptRow({
  label,
  value,
  className,
  ...props
}: ReceiptRowProps) {
  return (
    <div
      {...props}
      className={['signature-data-row', className].filter(Boolean).join(' ')}
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
