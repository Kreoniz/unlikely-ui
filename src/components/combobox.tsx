'use client';

// Adapted from shadcn/ui (MIT); see THIRD_PARTY_NOTICES.md.

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { useRef, type ComponentPropsWithRef } from 'react';
import { Button } from './button.js';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';
import { textControlClass } from '../lib/text-control.js';
import type { TextControlSize } from '../lib/text-control.js';

/** Props for the explicit bare Combobox.Input compatibility surface. */
export interface ComboboxBareInputProps extends Omit<
  ComponentPropsWithRef<typeof BaseCombobox.Input>,
  'size'
> {
  /** Visual size of the search input. */
  size?: TextControlSize;
}
export interface ComboboxContentProps
  extends
    ComponentPropsWithRef<typeof BaseCombobox.Popup>,
    Pick<
      BaseCombobox.Positioner.Props,
      'align' | 'alignOffset' | 'side' | 'sideOffset' | 'anchor'
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

function ComboboxBareInput({
  className,
  size = 'default',
  ...props
}: ComboboxBareInputProps) {
  return (
    <BaseCombobox.Input
      data-slot="combobox-input"
      {...props}
      data-size={size}
      className={stateClass(textControlClass, className)}
    />
  );
}
export function ComboboxContent({
  className,
  portalProps,
  positionerProps,
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal {...portalProps}>
      <Theme className="u-combobox-theme">
        <BaseCombobox.Positioner
          side={side}
          align={align}
          alignOffset={alignOffset}
          anchor={anchor}
          positionMethod="fixed"
          sideOffset={sideOffset}
          collisionPadding={16}
          {...positionerProps}
        >
          <BaseCombobox.Popup
            data-slot="combobox-content"
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
export function ComboboxList({ className, ...props }: ComboboxListProps) {
  return (
    <BaseCombobox.List
      data-slot="combobox-list"
      {...props}
      className={stateClass('u-combobox-list', className)}
    />
  );
}
export function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxItemProps) {
  return (
    <BaseCombobox.Item
      data-slot="combobox-item"
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
export function ComboboxStatus({ className, ...props }: ComboboxStatusProps) {
  return (
    <BaseCombobox.Status
      {...props}
      className={stateClass('u-combobox-status', className)}
    />
  );
}
export function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <BaseCombobox.Empty
      data-slot="combobox-empty"
      {...props}
      className={stateClass('u-combobox-empty', className)}
    />
  );
}
/** Props for the named, composed ComboboxInput control. */
export interface ComboboxInputProps extends ComboboxBareInputProps {
  /** Include a button that opens the options. */
  showTrigger?: boolean;
  /** Include a button that clears the current selection. */
  showClear?: boolean;
  /** Accessible name for the options button. */
  triggerLabel?: string;
  /** Accessible name for the clear button. */
  clearLabel?: string;
}
/** @deprecated Use ComboboxInputProps for the named component. */
export type ComboboxComposedInputProps = ComboboxInputProps;
export function ComboboxInput({
  showTrigger = true,
  showClear = false,
  triggerLabel = 'Show options',
  clearLabel = 'Clear selection',
  children,
  disabled,
  ...props
}: ComboboxInputProps) {
  return (
    <BaseCombobox.InputGroup className="u-combobox-input-group">
      <ComboboxBareInput {...props} disabled={disabled} />
      <span className="u-combobox-input-actions">
        {showTrigger && (
          <ComboboxTrigger
            disabled={disabled}
            aria-label={triggerLabel}
            // The Field names the input; this adjacent button names its action.
            aria-labelledby={undefined}
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={triggerLabel}
              />
            }
          />
        )}
        {showClear && (
          <ComboboxClear
            disabled={disabled}
            render={
              <Button variant="ghost" size="icon-sm" aria-label={clearLabel} />
            }
          />
        )}
      </span>
      {children}
    </BaseCombobox.InputGroup>
  );
}
export function ComboboxTrigger({
  children,
  ...props
}: BaseCombobox.Trigger.Props) {
  return (
    <BaseCombobox.Trigger {...props} data-slot="combobox-trigger">
      {children ?? <span aria-hidden="true">⌄</span>}
    </BaseCombobox.Trigger>
  );
}
export function ComboboxClear({
  children,
  ...props
}: BaseCombobox.Clear.Props) {
  return (
    <BaseCombobox.Clear {...props} data-slot="combobox-clear">
      {children ?? <span aria-hidden="true">×</span>}
    </BaseCombobox.Clear>
  );
}
export const ComboboxValue = BaseCombobox.Value;
export const ComboboxGroup = BaseCombobox.Group;
export const ComboboxCollection = BaseCombobox.Collection;
export function ComboboxLabel({
  className,
  ...props
}: BaseCombobox.GroupLabel.Props) {
  return (
    <BaseCombobox.GroupLabel
      {...props}
      data-slot="combobox-label"
      className={stateClass('u-menu-label', className)}
    />
  );
}
export function ComboboxSeparator({
  className,
  ...props
}: BaseCombobox.Separator.Props) {
  return (
    <BaseCombobox.Separator
      {...props}
      data-slot="combobox-separator"
      className={stateClass('u-menu-separator', className)}
    />
  );
}
export function ComboboxChips({
  className,
  ...props
}: ComponentPropsWithRef<typeof BaseCombobox.Chips>) {
  return (
    <BaseCombobox.Chips
      {...props}
      data-slot="combobox-chips"
      className={stateClass('u-combobox-chips', className)}
    />
  );
}
export type ComboboxChipProps = BaseCombobox.Chip.Props &
  (
    | {
        /** Include a button to remove this selected value. @default true */
        showRemove?: true;
        /** Value-specific, localized accessible name, for example Remove Design. */
        removeLabel: string;
      }
    | {
        /** Omit the remove button for a non-removable chip. */
        showRemove: false;
        /** Unused when no remove button is rendered. */
        removeLabel?: string;
      }
  );
export function ComboboxChip(props: ComboboxChipProps) {
  const { className, children, showRemove, removeLabel, ...chipProps } = props;
  return (
    <BaseCombobox.Chip
      {...chipProps}
      data-slot="combobox-chip"
      className={stateClass('u-combobox-chip', className)}
    >
      {children}
      {props.showRemove !== false && (
        <BaseCombobox.ChipRemove
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={props.removeLabel}
            />
          }
        >
          <span aria-hidden="true">×</span>
        </BaseCombobox.ChipRemove>
      )}
    </BaseCombobox.Chip>
  );
}
export function ComboboxChipsInput({
  className,
  ...props
}: BaseCombobox.Input.Props) {
  return (
    <BaseCombobox.Input
      {...props}
      data-slot="combobox-chip-input"
      className={stateClass('u-combobox-chips-input', className)}
    />
  );
}
export function useComboboxAnchor() {
  return useRef<HTMLDivElement | null>(null);
}
function ComboboxRoot<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
>(props: BaseCombobox.Root.Props<Value, Multiple, Item>) {
  return <BaseCombobox.Root {...props} />;
}
export const Combobox = Object.assign(ComboboxRoot, {
  Root: BaseCombobox.Root,
  Input: ComboboxBareInput,
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
});
