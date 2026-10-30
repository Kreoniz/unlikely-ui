'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentPropsWithRef } from 'react';
import { stateClass } from '../lib/state-class.js';

export type FieldRootProps = ComponentPropsWithRef<typeof BaseField.Root>;
export type FieldLabelProps = ComponentPropsWithRef<typeof BaseField.Label>;
export type FieldDescriptionProps = ComponentPropsWithRef<
  typeof BaseField.Description
>;
export type FieldErrorProps = ComponentPropsWithRef<typeof BaseField.Error>;

function FieldRoot({ className, ...props }: FieldRootProps) {
  return (
    <BaseField.Root
      data-slot="field"
      {...props}
      className={stateClass('u-field ui:grid ui:gap-2', className)}
    />
  );
}
export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <BaseField.Label
      data-slot="field-label"
      {...props}
      className={stateClass(
        'u-field-label ui:text-u-ink ui:font-medium',
        className,
      )}
    />
  );
}
export function FieldDescription({
  className,
  ...props
}: FieldDescriptionProps) {
  return (
    <BaseField.Description
      data-slot="field-description"
      {...props}
      className={stateClass('u-field-description ui:text-u-muted', className)}
    />
  );
}
export function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <BaseField.Error
      data-slot="field-error"
      {...props}
      className={stateClass('u-field-error ui:text-u-danger', className)}
    />
  );
}

export const FieldControl = BaseField.Control;
export const FieldItem = BaseField.Item;
export const FieldValidity = BaseField.Validity;
/** A named field retaining Base UI's association and validation behavior. */
export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Control: BaseField.Control,
  Item: BaseField.Item,
  Validity: BaseField.Validity,
});
