'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentPropsWithRef } from 'react';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';
import { textControlClass } from '../lib/text-control.js';
import type { TextControlSize } from '../lib/text-control.js';

export interface ComboboxInputProps extends Omit<
  ComponentPropsWithRef<typeof BaseCombobox.Input>,
  'size'
> {
  /** Visual size of the search input. */
  size?: TextControlSize;
}
export interface ComboboxContentProps extends ComponentPropsWithRef<
  typeof BaseCombobox.Popup
> {
  /** Props for the Base UI portal. */
  portalProps?: ComponentPropsWithRef<typeof BaseCombobox.Portal>;
  /** Positioning overrides; defaults to fixed positioning with collision padding. */
  positionerProps?: ComponentPropsWithRef<typeof BaseCombobox.Positioner>;
}
export type ComboboxItemProps = ComponentPropsWithRef<typeof BaseCombobox.Item>;
export type ComboboxListProps = ComponentPropsWithRef<typeof BaseCombobox.List>;
export type ComboboxStatusProps = ComponentPropsWithRef<
  typeof BaseCombobox.Status
>;
export type ComboboxEmptyProps = ComponentPropsWithRef<
  typeof BaseCombobox.Empty
>;

function ComboboxInput({
  className,
  size = 'md',
  ...props
}: ComboboxInputProps) {
  return (
    <BaseCombobox.Input
      {...props}
      data-size={size}
      className={stateClass(textControlClass, className)}
    />
  );
}
function ComboboxContent({
  className,
  portalProps,
  positionerProps,
  ...props
}: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal {...portalProps}>
      <Theme className="u-combobox-theme">
        <BaseCombobox.Positioner
          positionMethod="fixed"
          sideOffset={6}
          collisionPadding={16}
          {...positionerProps}
        >
          <BaseCombobox.Popup
            {...props}
            className={stateClass(
              'u-combobox-popup ui:bg-u-raised ui:text-u-ink ui:border ui:border-solid ui:border-u-line',
              className,
            )}
          />
        </BaseCombobox.Positioner>
      </Theme>
    </BaseCombobox.Portal>
  );
}
function ComboboxList({ className, ...props }: ComboboxListProps) {
  return (
    <BaseCombobox.List
      {...props}
      className={stateClass('u-combobox-list', className)}
    />
  );
}
function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  return (
    <BaseCombobox.Item
      {...props}
      className={stateClass('u-combobox-item', className)}
    >
      <span>{children}</span>
      <BaseCombobox.ItemIndicator className="u-select-indicator">
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
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}
function ComboboxStatus({ className, ...props }: ComboboxStatusProps) {
  return (
    <BaseCombobox.Status
      {...props}
      className={stateClass('u-combobox-status', className)}
    />
  );
}
function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <BaseCombobox.Empty
      {...props}
      className={stateClass('u-combobox-empty', className)}
    />
  );
}
export const Combobox = {
  Root: BaseCombobox.Root,
  Input: ComboboxInput,
  Content: ComboboxContent,
  List: ComboboxList,
  Item: ComboboxItem,
  Status: ComboboxStatus,
  Empty: ComboboxEmpty,
  InputGroup: BaseCombobox.InputGroup,
  Trigger: BaseCombobox.Trigger,
  Clear: BaseCombobox.Clear,
  Group: BaseCombobox.Group,
  GroupLabel: BaseCombobox.GroupLabel,
  useFilter: BaseCombobox.useFilter,
};
