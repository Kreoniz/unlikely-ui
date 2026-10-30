'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { Button } from '../../../src/components/button.js';
import { PhysicalButton } from '../../../src/components/physical-button.js';
import './guarded.css';

export interface GuardedActionProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'title'
> {
  /** Opening action text; the guarded action name follows in the accessible name. */
  triggerLabel: string;
  /** Visible name of the guarded consequence. */
  title: string;
  /** Explain the effect, scope and recovery before the button can be pressed. */
  description: ReactNode;
  /** Visible name of the separate physical button that invokes onConfirm. */
  confirmLabel: string;
  /** App-owned effect. Does not implicitly close the cover. */
  onConfirm: () => void;
  /** Controlled cover position. Opening the cover never invokes onConfirm. */
  open?: boolean;
  /** Initial uncontrolled cover position. @default false */
  defaultOpen?: boolean;
  /** Called when the user requests a change to the cover position. */
  onOpenChange?: (open: boolean) => void;
  /** Prevent opening or confirming; an already-open cover can still be closed. */
  disabled?: boolean;
  /** App-owned progress; blocks repeat presses while closing remains available. */
  pending?: boolean;
  /** App-owned failure, announced beside the still-available consequence. */
  error?: ReactNode;
  /** Cover travel in milliseconds; zero settles immediately. Reduced motion also removes travel. @default 500 */
  duration?: number;
  /** Closing action text; the guarded action name follows in the accessible name. @default 'Close cover' */
  closeLabel?: string;
  /** Ordinary visible dismissal. Closing does not cancel an app request. @default 'Cancel' */
  cancelLabel?: string;
}

/** Experimental inline two-step action: lift the opaque cover, then press the cap. */
export function GuardedAction({
  triggerLabel,
  title,
  description,
  confirmLabel,
  onConfirm,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  pending = false,
  error,
  duration = 500,
  closeLabel = 'Close cover',
  cancelLabel = 'Cancel',
  className,
  style,
  onKeyDown,
  ...props
}: GuardedActionProps) {
  const id = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const cover = useRef<HTMLButtonElement>(null);
  const titleElement = useRef<HTMLHeadingElement>(null);
  const action = useRef<HTMLDivElement>(null);
  const previousOpen = useRef(isOpen);
  const bindCancel = useCallback((element: HTMLButtonElement | null) => {
    if (!element) return;
    // Ref cleanup runs before removal; the focused Cancel is still identifiable.
    return () => {
      if (element === document.activeElement) {
        if (cover.current?.disabled) titleElement.current?.focus();
        else cover.current?.focus();
      }
    };
  }, []);

  function changeOpen(next: boolean) {
    if (next && disabled) return;
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function closeCover() {
    changeOpen(false);
    if (disabled) titleElement.current?.focus();
    else cover.current?.focus();
  }

  // A successful app callback can close the controlled cover while focus is on
  // its cap. Keep focus on the same control instead of hiding the active node.
  useEffect(() => {
    if (
      previousOpen.current &&
      !isOpen &&
      action.current?.contains(document.activeElement)
    ) {
      if (disabled) titleElement.current?.focus();
      else cover.current?.focus();
    }
    previousOpen.current = isOpen;
  }, [isOpen, disabled]);

  return (
    <div
      role="group"
      aria-labelledby={`${id}-title`}
      {...props}
      className={['signature-guarded', className].filter(Boolean).join(' ')}
      style={
        {
          ...style,
          '--guarded-duration': `${Number.isFinite(duration) ? Math.max(0, duration) : 500}ms`,
        } as CSSProperties
      }
      data-open={isOpen}
      data-disabled={disabled || undefined}
      data-pending={pending || undefined}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !isOpen || event.key !== 'Escape') return;
        event.preventDefault();
        closeCover();
      }}
    >
      <div className="signature-guarded-mechanism">
        <div className="signature-guarded-housing">
          <span
            className="signature-guarded-screw"
            data-corner="1"
            aria-hidden="true"
          />
          <span
            className="signature-guarded-screw"
            data-corner="2"
            aria-hidden="true"
          />
          <span
            className="signature-guarded-screw"
            data-corner="3"
            aria-hidden="true"
          />
          <span
            className="signature-guarded-screw"
            data-corner="4"
            aria-hidden="true"
          />
          <button
            ref={cover}
            type="button"
            className="signature-guarded-cover"
            aria-label={`${isOpen ? closeLabel : triggerLabel}: ${confirmLabel}`}
            aria-expanded={isOpen}
            aria-controls={`${id}-action`}
            aria-describedby={`${id}-description`}
            disabled={disabled && !isOpen}
            onClick={() => changeOpen(!isOpen)}
          >
            <span className="signature-guarded-cover-face" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <span>{confirmLabel}</span>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7 14 5-5 5 5M12 9v10" />
              </svg>
            </span>
            <span className="signature-guarded-cover-back" aria-hidden="true" />
          </button>
          <div
            id={`${id}-action`}
            ref={action}
            className="signature-guarded-action"
            aria-hidden={!isOpen}
            inert={!isOpen}
          >
            <PhysicalButton
              className="signature-guarded-cap"
              size="md"
              pattern="plain"
              depth="low"
              disabled={!isOpen || disabled || pending}
              focusableWhenDisabled={pending}
              aria-busy={pending || undefined}
              aria-describedby={`${id}-description`}
              onClick={() => {
                if (isOpen && !disabled && !pending) onConfirm();
              }}
            >
              {confirmLabel}
            </PhysicalButton>
          </div>
          <span className="signature-guarded-hinge" aria-hidden="true" />
        </div>
      </div>
      <div className="signature-guarded-consequence">
        <h3 id={`${id}-title`} ref={titleElement} tabIndex={-1}>
          {title}
        </h3>
        <div id={`${id}-description`} className="signature-guarded-description">
          {description}
        </div>
        {error && (
          <p className="signature-guarded-error" role="alert">
            {error}
          </p>
        )}
        {isOpen && (
          <Button ref={bindCancel} variant="secondary" onClick={closeCover}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
