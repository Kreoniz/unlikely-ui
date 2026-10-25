'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentPropsWithRef } from 'react';
import { stateClass } from '../lib/state-class.js';

export type SwitchRootProps = ComponentPropsWithRef<typeof BaseSwitch.Root>;
export type SwitchThumbProps = ComponentPropsWithRef<typeof BaseSwitch.Thumb>;

function SwitchRoot({ className, ...props }: SwitchRootProps) {
  return (
    <BaseSwitch.Root {...props} className={stateClass('u-switch', className)} />
  );
}
function SwitchThumb({ className, ...props }: SwitchThumbProps) {
  return (
    <BaseSwitch.Thumb
      {...props}
      className={stateClass('u-switch-thumb', className)}
    />
  );
}

export const Switch = { Root: SwitchRoot, Thumb: SwitchThumb };
