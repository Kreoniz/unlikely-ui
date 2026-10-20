'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { ComponentPropsWithRef } from 'react';
import { stateClass } from '../lib/state-class.js';

export type CheckboxProps = ComponentPropsWithRef<typeof BaseCheckbox.Root>;

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      {...props}
      className={stateClass('u-choice u-checkbox', className)}
    >
      <span className="u-choice-box">
        <BaseCheckbox.Indicator className="u-checkbox-indicator">
          <svg
            className="u-checkbox-check"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m3 8 3 3 7-7" />
          </svg>
          <svg
            className="u-checkbox-mixed"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 8h10" />
          </svg>
        </BaseCheckbox.Indicator>
      </span>
      {children}
    </BaseCheckbox.Root>
  );
}
