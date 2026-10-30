'use client';

import { useId } from 'react';
import { Slider } from '@base-ui/react/slider';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { ExactValue } from './exact-value.js';
import './allocation.css';

export interface AllocationPart {
  /** Visible name. Parts retain their supplied physical left-to-right order. */
  label: string;
  /** Non-negative safe integer, within min/max. */
  value: number;
  /** Non-negative safe integer lower bound. */
  min: number;
  /** Safe integer upper bound, at least min. */
  max: number;
  /** Keep this amount fixed. Its position can move when other parts exchange units. */
  locked?: boolean;
}
export interface AllocationBarProps {
  /** At least two stable ordered parts. Values, bounds and their total must be safe integers. */
  parts: readonly AllocationPart[];
  /** A new distribution with the same total and unchanged locked amounts. */
  onChange: (parts: AllocationPart[]) => void;
  /** Optional app-owned lock controls, including for zero-valued parts. */
  onLockChange?: (index: number, locked: boolean) => void;
  /** Disable editing and lock controls. */
  disabled?: boolean;
  /** Visible unit suffix, such as '%' or 'h'. No space is added before '%'. */
  unit: string;
}
function LockMark({ locked }: { locked: boolean }) {
  return (
    <svg viewBox="0 0 16 18" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="12" height="9" rx="2" />
      <path d={locked ? 'M4 8V5a4 4 0 0 1 8 0v3' : 'M4 8V5a4 4 0 0 1 7.5-2'} />
      <path d="M8 11v3" />
    </svg>
  );
}
/** Moving a divider transfers units between the nearest editable part on either side. */
export function AllocationBar({
  parts,
  onChange,
  onLockChange,
  disabled,
  unit,
}: AllocationBarProps) {
  const id = useId();
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  const amount = (value: number) => `${value}${unit === '%' ? '' : ' '}${unit}`;
  function editableFrom(index: number, step: 1 | -1) {
    for (let i = index; i >= 0 && i < parts.length; i += step) {
      if (!parts[i]!.locked && parts[i]!.min < parts[i]!.max) return i;
    }
    return -1;
  }
  function deltaBounds(from: number, to: number) {
    if (from < 0 || to < 0) return { min: 0, max: 0 };
    const a = parts[from]!,
      b = parts[to]!;
    return {
      min: Math.max(a.min - a.value, b.value - b.max),
      max: Math.min(a.max - a.value, b.value - b.min),
    };
  }
  function transfer(from: number, to: number, change: number) {
    if (disabled || from < 0 || to < 0 || !Number.isFinite(change)) return;
    const { min, max } = deltaBounds(from, to);
    const delta = Math.max(min, Math.min(max, Math.round(change)));
    if (!delta) return;
    onChange(
      parts.map((part, i) =>
        i === from
          ? { ...part, value: part.value + delta }
          : i === to
            ? { ...part, value: part.value - delta }
            : part,
      ),
    );
  }
  let prefix = 0;
  const boundaries = parts.slice(0, -1).map((part, i) => {
    prefix += part.value;
    const from = editableFrom(i, -1),
      to = editableFrom(i + 1, 1);
    const bounds = deltaBounds(from, to);
    return {
      from,
      to,
      position: prefix,
      min: prefix + bounds.min,
      max: prefix + bounds.max,
    };
  });
  return (
    <div className="allocation">
      <div className="allocation-overview">
        <div className="allocation-track">
          <div className="allocation-bar" aria-hidden="true" dir="ltr">
            {parts.map((part, i) => (
              <div
                key={i}
                className={`allocation-segment allocation-paint-${i % 3}`}
                style={{ flexGrow: part.value, flexBasis: 0 }}
                data-empty={part.value === 0 || undefined}
              >
                <div className="allocation-segment-content">
                  <span className="allocation-segment-name">{part.label}</span>
                  <strong className="allocation-segment-value">
                    {part.value}
                    <small>{unit}</small>
                  </strong>
                  {part.locked && (
                    <span className="allocation-segment-lock">
                      <LockMark locked />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <DirectionProvider direction="ltr">
            {boundaries.map(({ from, to, position, min, max }, i) =>
              min === max ? (
                <span
                  key={i}
                  aria-hidden="true"
                  className="allocation-fixed-divider"
                  style={{
                    left: `calc(5px + (100% - 10px) * ${total ? position / total : 0})`,
                  }}
                />
              ) : (
                <Slider.Root
                  key={i}
                  className="allocation-slider"
                  min={min}
                  max={max}
                  step={1}
                  value={position}
                  disabled={disabled}
                  onValueChange={(next) => transfer(from, to, next - position)}
                  style={{
                    left: `calc(5px + (100% - 10px) * ${min / total})`,
                    width: `calc((100% - 10px) * ${(max - min) / total})`,
                  }}
                >
                  <Slider.Control className="allocation-slider-control">
                    <Slider.Thumb
                      className="allocation-grip"
                      aria-label={`${parts[i]!.label} / ${parts[i + 1]!.label} divider`}
                      aria-valuetext={`${amount(position)}; ${parts[from]!.label} ${amount(parts[from]!.value)}, ${parts[to]!.label} ${amount(parts[to]!.value)}`}
                    >
                      <span className="allocation-grip-face" aria-hidden="true">
                        <span />
                      </span>
                    </Slider.Thumb>
                  </Slider.Control>
                </Slider.Root>
              ),
            )}
          </DirectionProvider>
        </div>
        <div
          className="allocation-total"
          role="group"
          aria-label="Allocation total"
        >
          Total{' '}
          <strong>
            <bdi>{amount(total)}</bdi>
          </strong>
        </div>
      </div>
      <div className="allocation-values">
        {parts.map((part, i) => {
          const forward = editableFrom(i + 1, 1);
          const partner = forward < 0 ? editableFrom(i - 1, -1) : forward;
          const bounds = part.locked
            ? { min: 0, max: 0 }
            : deltaBounds(i, partner);
          const min = part.value + bounds.min,
            max = part.value + bounds.max;
          return (
            <div
              className={`allocation-value allocation-paint-${i % 3}`}
              key={i}
            >
              <div className="allocation-value-heading">
                <label htmlFor={`${id}-${i}`}>
                  <i aria-hidden="true" />
                  {part.label}
                </label>
                {onLockChange && (
                  <button
                    type="button"
                    className="allocation-lock"
                    disabled={disabled}
                    aria-label={`Lock ${part.label}`}
                    aria-pressed={Boolean(part.locked)}
                    onClick={() => onLockChange(i, !part.locked)}
                  >
                    <LockMark locked={Boolean(part.locked)} />
                    <span>Lock</span>
                  </button>
                )}
              </div>
              <div className="allocation-entry">
                <ExactValue
                  id={`${id}-${i}`}
                  descriptionId={`${id}-${i}-help`}
                  min={min}
                  max={max}
                  value={part.value}
                  disabled={disabled}
                  readOnly={min === max}
                  onValueCommit={(next) =>
                    transfer(i, partner, next - part.value)
                  }
                />
                <span aria-hidden="true">{unit}</span>
              </div>
              <p
                id={`${id}-${i}-help`}
                className="allocation-value-help"
                dir="auto"
              >
                {part.locked
                  ? 'Amount locked'
                  : min === max
                    ? 'No units available to transfer'
                    : `${amount(min)}–${amount(max)} · balances with ${parts[partner]!.label}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
