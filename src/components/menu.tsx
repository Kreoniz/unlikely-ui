'use client';

// Adapted from shadcn/ui (MIT); see THIRD_PARTY_NOTICES.md.

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentPropsWithRef } from 'react';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';

export interface MenuContentProps
  extends
    ComponentPropsWithRef<typeof BaseMenu.Popup>,
    Pick<
      BaseMenu.Positioner.Props,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    > {
  /** Props for the Base UI portal; the opener's theme and direction are restored inside. */
  portalProps?: ComponentPropsWithRef<typeof BaseMenu.Portal>;
  /** Positioning overrides. Defaults to fixed positioning, start alignment, and a 4px gap. */
  positionerProps?: ComponentPropsWithRef<typeof BaseMenu.Positioner>;
}
export interface MenuItemProps extends ComponentPropsWithRef<
  typeof BaseMenu.Item
> {
  /** Use danger for a destructive action; labels must also identify the action. */
  tone?: 'default' | 'danger';
  /** Standard action or destructive action; tone remains a compatibility alias. */
  variant?: 'default' | 'destructive';
  /** Align text with items containing a leading indicator. */
  inset?: boolean;
}
export type MenuGroupLabelProps = ComponentPropsWithRef<
  typeof BaseMenu.GroupLabel
>;
export type MenuSeparatorProps = ComponentPropsWithRef<
  typeof BaseMenu.Separator
>;

export function DropdownMenuContent({
  portalProps,
  positionerProps,
  className,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  ...props
}: MenuContentProps) {
  return (
    <BaseMenu.Portal {...portalProps}>
      <Theme className="u-menu-theme">
        <BaseMenu.Positioner
          positionMethod="fixed"
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          collisionPadding={16}
          {...positionerProps}
        >
          <BaseMenu.Popup
            data-slot="dropdown-menu-content"
            {...props}
            className={stateClass('u-menu', className)}
          />
        </BaseMenu.Positioner>
      </Theme>
    </BaseMenu.Portal>
  );
}
export function DropdownMenuItem({
  tone = 'default',
  variant = 'default',
  inset,
  className,
  ...props
}: MenuItemProps) {
  return (
    <BaseMenu.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      {...props}
      data-tone={variant === 'destructive' ? 'danger' : tone}
      className={stateClass('u-menu-item', className)}
    />
  );
}
export function DropdownMenuLabel({
  className,
  ...props
}: MenuGroupLabelProps) {
  return (
    <BaseMenu.GroupLabel
      {...props}
      className={stateClass('u-menu-label', className)}
    />
  );
}
export function DropdownMenuSeparator({
  className,
  ...props
}: MenuSeparatorProps) {
  return (
    <BaseMenu.Separator
      {...props}
      className={stateClass('u-menu-separator', className)}
    />
  );
}

export function DropdownMenu<Payload>(props: BaseMenu.Root.Props<Payload>) {
  return <BaseMenu.Root {...props} />;
}
export const DropdownMenuTrigger = BaseMenu.Trigger;
export const DropdownMenuGroup = BaseMenu.Group;
export function DropdownMenuPortal({
  children,
  ...props
}: BaseMenu.Portal.Props) {
  return (
    <BaseMenu.Portal {...props}>
      <Theme className="u-menu-theme">{children}</Theme>
    </BaseMenu.Portal>
  );
}
export const Menu = Object.assign(DropdownMenu, {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: BaseMenu.Group,
  GroupLabel: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
});
