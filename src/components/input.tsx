'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentPropsWithRef } from 'react';
import { stateClass } from '../lib/state-class.js';
import { textControlClass } from '../lib/text-control.js';
import type { TextControlSize } from '../lib/text-control.js';

export type { TextControlSize } from '../lib/text-control.js';
export interface InputProps extends Omit<
  ComponentPropsWithRef<typeof BaseInput>,
  'size'
> {
  /** Visual control size, independent of native input length. */
  size?: TextControlSize;
}

export function Input({ className, size = 'md', ...props }: InputProps) {
  return (
    <BaseInput
      {...props}
      data-size={size}
      className={stateClass(textControlClass, className)}
    />
  );
}
