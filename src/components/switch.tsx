'use client';

// Adapted from shadcn/ui (MIT); see THIRD_PARTY_NOTICES.md.

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentPropsWithRef } from 'react';
import { stateClass } from '../lib/state-class.js';

export type SwitchRootProps = ComponentPropsWithRef<typeof BaseSwitch.Root>;
export type SwitchThumbProps = ComponentPropsWithRef<typeof BaseSwitch.Thumb>;

function SwitchRoot({ className, ...props }: SwitchRootProps) {
  return (
    <BaseSwitch.Root
      {...props}
      data-slot="switch"
      className={stateClass('u-switch', className)}
    />
  );
}
export function SwitchThumb({ className, ...props }: SwitchThumbProps) {
  return (
    <BaseSwitch.Thumb
      data-slot="switch-thumb"
      {...props}
      className={stateClass('u-switch-thumb', className)}
    />
  );
}

export interface SwitchProps extends SwitchRootProps {
  /** Track size; the effective touch target stays at least 44px. */
  size?: 'default' | 'sm';
}
function SwitchControl({ size = 'default', children, ...props }: SwitchProps) {
  return (
    <SwitchRoot {...props} data-size={size}>
      {children ?? <SwitchThumb />}
    </SwitchRoot>
  );
}
export const Switch = Object.assign(SwitchControl, {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
});
