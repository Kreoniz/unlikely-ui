'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { createContext, useContext } from 'react';
import { stateClass } from '../lib/state-class.js';

export type RadioGroupProps<Value = string> = BaseRadioGroup.Props<Value> & {
  /** Ordinary radio choices or a segmented single-selection control. */
  variant?: 'default' | 'segmented';
};
export type RadioItemProps<Value = string> = BaseRadio.Root.Props<Value>;

function RadioGroupRoot<Value>({
  variant = 'default',
  className,
  ...props
}: RadioGroupProps<Value>) {
  return (
    <SegmentedContext value={variant === 'segmented'}>
      <BaseRadioGroup
        {...props}
        data-variant={variant}
        className={stateClass('u-radio-group', className)}
      />
    </SegmentedContext>
  );
}
function RadioItem<Value>({
  className,
  children,
  ...props
}: RadioItemProps<Value>) {
  const segmented = useContext(SegmentedContext);
  return (
    <BaseRadio.Root
      {...props}
      className={stateClass(
        segmented ? 'u-segmented-item' : 'u-choice u-radio',
        className,
      )}
    >
      {!segmented && (
        <span className="u-choice-box">
          <BaseRadio.Indicator className="u-radio-indicator" />
        </span>
      )}
      {children}
    </BaseRadio.Root>
  );
}

const SegmentedContext = createContext(false);

export const RadioGroup = { Root: RadioGroupRoot, Item: RadioItem };
