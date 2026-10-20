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
      {...props}
      className={stateClass('u-field ui:grid ui:gap-2', className)}
    />
  );
}
function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <BaseField.Label
      {...props}
      className={stateClass(
        'u-field-label ui:text-u-ink ui:font-medium',
        className,
      )}
    />
  );
}
function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <BaseField.Description
      {...props}
      className={stateClass('u-field-description ui:text-u-muted', className)}
    />
  );
}
function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <BaseField.Error
      {...props}
      className={stateClass('u-field-error ui:text-u-danger', className)}
    />
  );
}

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Control: BaseField.Control,
  Item: BaseField.Item,
  Validity: BaseField.Validity,
};
