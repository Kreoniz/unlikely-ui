'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentPropsWithRef } from 'react';
import { stateClass } from '../lib/state-class.js';
import { textControlClass } from '../lib/text-control.js';
import type { TextControlSize } from '../lib/text-control.js';

export interface TextareaProps
  extends
    Omit<ComponentPropsWithRef<'textarea'>, 'className' | 'style'>,
    Pick<BaseField.Control.Props, 'className' | 'style' | 'onValueChange'> {
  /** Visual control size; rows controls the number of text lines. */
  size?: TextControlSize;
}

export function Textarea({
  className,
  style,
  size = 'md',
  rows = 4,
  value,
  defaultValue,
  onValueChange,
  disabled,
  id,
  name,
  ...props
}: TextareaProps) {
  return (
    <BaseField.Control
      render={<textarea {...props} rows={rows} />}
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      style={style}
      data-size={size}
      className={stateClass(`${textControlClass} u-textarea`, className)}
    />
  );
}
