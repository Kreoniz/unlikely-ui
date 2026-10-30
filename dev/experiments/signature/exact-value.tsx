'use client';

import { useEffect, useState } from 'react';

interface ExactValueProps {
  id?: string;
  label?: string;
  descriptionId?: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  readOnly?: boolean;
  onValueCommit: (value: number) => void;
}

/** Local numeric editor: native keyboard behavior, whole-unit commit on blur. */
export function ExactValue({
  id,
  label,
  descriptionId,
  value,
  min,
  max,
  disabled,
  readOnly,
  onValueCommit,
}: ExactValueProps) {
  const [draft, setDraft] = useState<string | null>(null);
  useEffect(() => setDraft(null), [value, min, max, disabled, readOnly]);
  return (
    <input
      id={id}
      className="signature-spatial-number"
      type="number"
      dir="ltr"
      aria-label={label}
      aria-describedby={descriptionId}
      min={min}
      max={max}
      step={1}
      value={disabled || readOnly ? value : (draft ?? value)}
      disabled={disabled}
      readOnly={readOnly}
      onFocus={() => setDraft(String(value))}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={(event) => {
        const next = event.currentTarget.valueAsNumber;
        setDraft(null);
        if (!disabled && !readOnly && Number.isFinite(next)) {
          const normalized = Math.max(min, Math.min(max, Math.round(next)));
          if (normalized !== value) onValueCommit(normalized);
        }
      }}
    />
  );
}
