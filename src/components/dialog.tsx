'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentPropsWithRef } from 'react';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';

export interface DialogContentProps extends ComponentPropsWithRef<
  typeof BaseDialog.Popup
> {
  /** Props for the Base UI portal; theme settings are restored inside it. */
  portalProps?: ComponentPropsWithRef<typeof BaseDialog.Portal>;
}
export type DialogTitleProps = ComponentPropsWithRef<typeof BaseDialog.Title>;
export type DialogDescriptionProps = ComponentPropsWithRef<
  typeof BaseDialog.Description
>;

function DialogContent({
  className,
  portalProps,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal {...portalProps}>
      <Theme className="u-dialog-theme">
        <BaseDialog.Backdrop className="u-dialog-backdrop" />
        <BaseDialog.Viewport className="u-dialog-viewport">
          <BaseDialog.Popup
            {...props}
            className={stateClass(
              'u-dialog ui:bg-u-raised ui:text-u-ink ui:border ui:border-solid ui:border-u-line',
              className,
            )}
          />
        </BaseDialog.Viewport>
      </Theme>
    </BaseDialog.Portal>
  );
}
function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <BaseDialog.Title
      {...props}
      className={stateClass('u-overlay-title', className)}
    />
  );
}
function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <BaseDialog.Description
      {...props}
      className={stateClass('u-overlay-description ui:text-u-muted', className)}
    />
  );
}

export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: BaseDialog.Close,
};
