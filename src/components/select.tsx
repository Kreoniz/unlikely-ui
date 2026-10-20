'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentPropsWithRef } from 'react';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';
import type { TextControlSize } from '../lib/text-control.js';

export interface SelectTriggerProps extends ComponentPropsWithRef<
  typeof BaseSelect.Trigger
> {
  /** Visual size of the trigger. */
  size?: TextControlSize;
}
export interface SelectContentProps extends ComponentPropsWithRef<
  typeof BaseSelect.Popup
> {
  /** Props for the Base UI portal. */
  portalProps?: ComponentPropsWithRef<typeof BaseSelect.Portal>;
  /** Positioning overrides; item alignment is disabled by default to avoid page scrolling. */
  positionerProps?: ComponentPropsWithRef<typeof BaseSelect.Positioner>;
}
export type SelectItemProps = ComponentPropsWithRef<typeof BaseSelect.Item>;

function SelectTrigger({
  className,
  size = 'md',
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      {...props}
      data-size={size}
      className={stateClass(
        'u-select-trigger ui:bg-u-surface ui:text-u-ink ui:border ui:border-solid ui:border-u-line ui:rounded-u-control ui:font-u-sans',
        className,
      )}
    >
      {children}
      <BaseSelect.Icon className="u-select-icon">
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}
function SelectContent({
  className,
  children,
  portalProps,
  positionerProps,
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal {...portalProps}>
      <Theme className="u-select-theme">
        <BaseSelect.Positioner
          positionMethod="fixed"
          alignItemWithTrigger={false}
          sideOffset={6}
          collisionPadding={16}
          {...positionerProps}
        >
          <BaseSelect.Popup
            {...props}
            className={stateClass(
              'u-select-popup ui:bg-u-raised ui:text-u-ink ui:border ui:border-solid ui:border-u-line',
              className,
            )}
          >
            <BaseSelect.List className="u-select-list">
              {children}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </Theme>
    </BaseSelect.Portal>
  );
}
function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item
      {...props}
      className={stateClass('u-select-item', className)}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="u-select-indicator">
        <svg
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
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export const Select = {
  Root: BaseSelect.Root,
  Trigger: SelectTrigger,
  Value: BaseSelect.Value,
  Content: SelectContent,
  Item: SelectItem,
  Group: BaseSelect.Group,
  GroupLabel: BaseSelect.GroupLabel,
};
