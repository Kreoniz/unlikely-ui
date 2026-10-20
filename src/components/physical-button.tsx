'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import type { CSSProperties } from 'react';
import { stateClass } from '../lib/state-class.js';

export interface PhysicalButtonColors {
  /** Fill of the domed cap. */
  cap?: string;
  /** Text and icon color on the cap. */
  capText?: string;
  /** Color of the outer housing. */
  casing?: string;
  /** Color of the inset plate beneath the cap. */
  plate?: string;
  /** Stripe color when the hazard pattern is enabled. */
  stripe?: string;
  /** Color of the front lamp when lit. */
  indicator?: string;
}
export interface PhysicalButtonProps extends BaseButton.Props {
  /** Nominal width: sm 144px, md 192px, lg 240px. */
  size?: 'sm' | 'md' | 'lg';
  /** Shape of the entire housing, plate, bezel, and cap. */
  shape?: 'round' | 'square';
  /** Decorative pattern on the plate. */
  pattern?: 'hazard' | 'plain';
  /** Cap travel while pressed; does not change base thickness. */
  depth?: 'low' | 'medium' | 'high';
  /** Front light follows aria-pressed, or lights while a momentary button is held. */
  indicator?: boolean;
  /** Local material color overrides. Values can include CSS variables. */
  colors?: PhysicalButtonColors;
}

export function PhysicalButton({
  size = 'md',
  shape = 'round',
  pattern = 'hazard',
  depth = 'medium',
  indicator = false,
  colors,
  className,
  style,
  children,
  ...props
}: PhysicalButtonProps) {
  const colorStyles = {
    '--u-physical-cap': colors?.cap,
    '--u-physical-ink': colors?.capText,
    '--u-physical-casing': colors?.casing,
    '--u-physical-plate': colors?.plate,
    '--u-physical-stripe': colors?.stripe,
    '--u-physical-indicator': colors?.indicator,
  } as CSSProperties;
  return (
    <BaseButton
      {...props}
      data-size={size}
      data-shape={shape}
      data-pattern={pattern}
      data-depth={depth}
      className={stateClass('u-physical-button', className)}
      style={(state) => ({
        ...colorStyles,
        ...(typeof style === 'function' ? style(state) : style),
      })}
    >
      <span className="u-physical-housing">
        <span className="u-physical-plate" aria-hidden="true" />
        <span className="u-physical-bezel" aria-hidden="true" />
        <span className="u-physical-cap">
          <span className="u-physical-label">{children}</span>
        </span>
        {indicator && (
          <span className="u-physical-indicator" aria-hidden="true" />
        )}
      </span>
    </BaseButton>
  );
}
