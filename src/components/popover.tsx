'use client';

// Adapted from shadcn/ui (MIT); see THIRD_PARTY_NOTICES.md.

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentPropsWithRef } from 'react';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';

export interface PopoverContentProps
  extends
    ComponentPropsWithRef<typeof BasePopover.Popup>,
    Pick<
      BasePopover.Positioner.Props,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
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

export function PopoverContent({
  className,
  portalProps,
  positionerProps,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal {...portalProps}>
      <Theme className="u-popover-theme">
        <BasePopover.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          positionMethod="fixed"
          sideOffset={sideOffset}
          collisionPadding={16}
          {...positionerProps}
        >
          <BasePopover.Popup
            data-slot="popover-content"
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
export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <BasePopover.Title
      data-slot="popover-title"
      {...props}
      className={stateClass('u-overlay-title', className)}
    />
  );
}
export function PopoverDescription({
  className,
  ...props
}: PopoverDescriptionProps) {
  return (
    <BasePopover.Description
      data-slot="popover-description"
      {...props}
      className={stateClass('u-overlay-description ui:text-u-muted', className)}
    />
  );
}

function PopoverRoot<Payload>(props: BasePopover.Root.Props<Payload>) {
  return <BasePopover.Root {...props} />;
}
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;
export function PopoverHeader({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      data-slot="popover-header"
      className={['u-popover-header', className].filter(Boolean).join(' ')}
    />
  );
}
export const Popover = Object.assign(PopoverRoot, {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: BasePopover.Close,
});
