'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentPropsWithRef } from 'react';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';

export interface PopoverContentProps extends ComponentPropsWithRef<
  typeof BasePopover.Popup
> {
  /** Props for the Base UI portal. */
  portalProps?: ComponentPropsWithRef<typeof BasePopover.Portal>;
  /** Positioning overrides; defaults to fixed positioning. */
  positionerProps?: ComponentPropsWithRef<typeof BasePopover.Positioner>;
}
export type PopoverTitleProps = ComponentPropsWithRef<typeof BasePopover.Title>;
export type PopoverDescriptionProps = ComponentPropsWithRef<
  typeof BasePopover.Description
>;

function PopoverContent({
  className,
  portalProps,
  positionerProps,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal {...portalProps}>
      <Theme className="u-popover-theme">
        <BasePopover.Positioner
          positionMethod="fixed"
          sideOffset={8}
          collisionPadding={16}
          {...positionerProps}
        >
          <BasePopover.Popup
            {...props}
            className={stateClass(
              'u-popover ui:bg-u-raised ui:text-u-ink ui:border ui:border-solid ui:border-u-line',
              className,
            )}
          />
        </BasePopover.Positioner>
      </Theme>
    </BasePopover.Portal>
  );
}
function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <BasePopover.Title
      {...props}
      className={stateClass('u-overlay-title', className)}
    />
  );
}
function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <BasePopover.Description
      {...props}
      className={stateClass('u-overlay-description ui:text-u-muted', className)}
    />
  );
}

export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: BasePopover.Close,
};
