'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentPropsWithRef } from 'react';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';

export interface MenuContentProps extends ComponentPropsWithRef<
  typeof BaseMenu.Popup
> {
  /** Props for the Base UI portal; the opener's theme and direction are restored inside. */
  portalProps?: ComponentPropsWithRef<typeof BaseMenu.Portal>;
  /** Positioning overrides. Defaults to fixed positioning, start alignment, and an 8px gap. */
  positionerProps?: ComponentPropsWithRef<typeof BaseMenu.Positioner>;
}
export interface MenuItemProps extends ComponentPropsWithRef<
  typeof BaseMenu.Item
> {
  /** Use danger for a destructive action; labels must also identify the action. */
  tone?: 'default' | 'danger';
}
export type MenuGroupLabelProps = ComponentPropsWithRef<
  typeof BaseMenu.GroupLabel
>;
export type MenuSeparatorProps = ComponentPropsWithRef<
  typeof BaseMenu.Separator
>;

function MenuContent({
  portalProps,
  positionerProps,
  className,
  ...props
}: MenuContentProps) {
  return (
    <BaseMenu.Portal {...portalProps}>
      <Theme className="u-menu-theme">
        <BaseMenu.Positioner
          positionMethod="fixed"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          {...positionerProps}
        >
          <BaseMenu.Popup
            {...props}
            className={stateClass('u-menu', className)}
          />
        </BaseMenu.Positioner>
      </Theme>
    </BaseMenu.Portal>
  );
}
function MenuItem({ tone = 'default', className, ...props }: MenuItemProps) {
  return (
    <BaseMenu.Item
      {...props}
      data-tone={tone}
      className={stateClass('u-menu-item', className)}
    />
  );
}
function MenuGroupLabel({ className, ...props }: MenuGroupLabelProps) {
  return (
    <BaseMenu.GroupLabel
      {...props}
      className={stateClass('u-menu-label', className)}
    />
  );
}
function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return (
    <BaseMenu.Separator
      {...props}
      className={stateClass('u-menu-separator', className)}
    />
  );
}

export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Content: MenuContent,
  Item: MenuItem,
  Group: BaseMenu.Group,
  GroupLabel: MenuGroupLabel,
  Separator: MenuSeparator,
};
