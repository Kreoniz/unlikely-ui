'use client';

// Adapted from shadcn/ui (MIT); see THIRD_PARTY_NOTICES.md.

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentPropsWithRef } from 'react';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';
import { Button } from './button.js';

export interface DialogContentProps extends ComponentPropsWithRef<
  typeof BaseDialog.Popup
> {
  /** Props for the Base UI portal; theme settings are restored inside it. */
  portalProps?: ComponentPropsWithRef<typeof BaseDialog.Portal>;
  /** Include an accessible dismiss button in the top corner. */
  showCloseButton?: boolean;
  /** Accessible name of the built-in dismiss button. */
  closeLabel?: string;
}
export type DialogTitleProps = ComponentPropsWithRef<typeof BaseDialog.Title>;
export type DialogDescriptionProps = ComponentPropsWithRef<
  typeof BaseDialog.Description
>;

export function DialogContent({
  className,
  portalProps,
  children,
  showCloseButton = true,
  closeLabel = 'Close',
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal {...portalProps}>
      <DialogOverlay />
      <BaseDialog.Viewport className="u-dialog-viewport">
        <BaseDialog.Popup
          data-slot="dialog-content"
          {...props}
          className={stateClass(
            'u-dialog ui:bg-u-raised ui:text-u-ink ui:border ui:border-solid ui:border-u-line',
            className,
          )}
        >
          {children}
          {showCloseButton && (
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={closeLabel}
                />
              }
              className="u-dialog-close"
            >
              ×
            </DialogClose>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </DialogPortal>
  );
}
export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <BaseDialog.Title
      data-slot="dialog-title"
      {...props}
      className={stateClass('u-overlay-title', className)}
    />
  );
}
export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <BaseDialog.Description
      data-slot="dialog-description"
      {...props}
      className={stateClass('u-overlay-description ui:text-u-muted', className)}
    />
  );
}

function DialogRoot<Payload>(props: BaseDialog.Root.Props<Payload>) {
  return <BaseDialog.Root {...props} />;
}
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;
export function DialogPortal({
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseDialog.Portal>) {
  return (
    <BaseDialog.Portal {...props}>
      <Theme className="u-dialog-theme">{children}</Theme>
    </BaseDialog.Portal>
  );
}
export function DialogOverlay({
  className,
  ...props
}: ComponentPropsWithRef<typeof BaseDialog.Backdrop>) {
  return (
    <BaseDialog.Backdrop
      {...props}
      data-slot="dialog-overlay"
      className={stateClass('u-dialog-backdrop', className)}
    />
  );
}
export function DialogHeader({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      data-slot="dialog-header"
      className={['u-dialog-header', className].filter(Boolean).join(' ')}
    />
  );
}
export interface DialogFooterProps extends ComponentPropsWithRef<'div'> {
  /** Append a standard close action. */
  showCloseButton?: boolean;
  /** Label of the appended close action. */
  closeLabel?: string;
}
export function DialogFooter({
  className,
  children,
  showCloseButton = false,
  closeLabel = 'Close',
  ...props
}: DialogFooterProps) {
  return (
    <div
      {...props}
      data-slot="dialog-footer"
      className={['u-dialog-footer', className].filter(Boolean).join(' ')}
    >
      {children}
      {showCloseButton && (
        <DialogClose render={<Button variant="outline" />}>
          {closeLabel}
        </DialogClose>
      )}
    </div>
  );
}

/** Shadcn-style root with compatibility aliases for the original compound API. */
export const Dialog = Object.assign(DialogRoot, {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: BaseDialog.Close,
});
