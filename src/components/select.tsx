'use client';

// Adapted from shadcn/ui (MIT); see THIRD_PARTY_NOTICES.md.

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
export interface SelectContentProps
  extends
    ComponentPropsWithRef<typeof BaseSelect.Popup>,
    Pick<
      BaseSelect.Positioner.Props,
      'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
    > {
  /** Props for the Base UI portal. */
  portalProps?: ComponentPropsWithRef<typeof BaseSelect.Portal>;
  /** Positioning overrides; item alignment is disabled by default to avoid page scrolling. */
  positionerProps?: ComponentPropsWithRef<typeof BaseSelect.Positioner>;
}
export type SelectItemProps = ComponentPropsWithRef<typeof BaseSelect.Item>;

export function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
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
export function SelectContent({
  className,
  children,
  portalProps,
  positionerProps,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal {...portalProps}>
      <Theme className="u-select-theme">
        <BaseSelect.Positioner
          side={side}
          align={align}
          alignOffset={alignOffset}
          positionMethod="fixed"
          alignItemWithTrigger={alignItemWithTrigger}
          sideOffset={sideOffset}
          collisionPadding={16}
          {...positionerProps}
        >
          <BaseSelect.Popup
            data-slot="select-content"
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
export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
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

function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: BaseSelect.Root.Props<Value, Multiple>,
) {
  return <BaseSelect.Root {...props} />;
}
export const SelectValue = BaseSelect.Value;
export const SelectGroup = BaseSelect.Group;
export function SelectLabel({
  className,
  ...props
}: BaseSelect.GroupLabel.Props) {
  return (
    <BaseSelect.GroupLabel
      {...props}
      data-slot="select-label"
      className={stateClass('u-menu-label', className)}
    />
  );
}
export function SelectSeparator({
  className,
  ...props
}: BaseSelect.Separator.Props) {
  return (
    <BaseSelect.Separator
      {...props}
      data-slot="select-separator"
      className={stateClass('u-menu-separator', className)}
    />
  );
}
export function SelectScrollUpButton({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseSelect.ScrollUpArrow>) {
  return (
    <BaseSelect.ScrollUpArrow
      {...props}
      data-slot="select-scroll-up-button"
      className={stateClass('u-select-scroll-arrow', className)}
    >
      {children ?? '⌃'}
    </BaseSelect.ScrollUpArrow>
  );
}
export function SelectScrollDownButton({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseSelect.ScrollDownArrow>) {
  return (
    <BaseSelect.ScrollDownArrow
      {...props}
      data-slot="select-scroll-down-button"
      className={stateClass('u-select-scroll-arrow', className)}
    >
      {children ?? '⌄'}
    </BaseSelect.ScrollDownArrow>
  );
}
export const Select = Object.assign(SelectRoot, {
  Root: BaseSelect.Root,
  Trigger: SelectTrigger,
  Value: BaseSelect.Value,
  Content: SelectContent,
  Item: SelectItem,
  Group: BaseSelect.Group,
  GroupLabel: BaseSelect.GroupLabel,
});
