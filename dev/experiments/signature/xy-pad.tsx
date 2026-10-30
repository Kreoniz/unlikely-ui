'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import { ExactValue } from './exact-value.js';
import './xy.css';

export interface XYAxis {
  /** Complete visible axis name. */
  label: string;
  /** Safe integer lower bound. */
  min: number;
  /** Safe integer upper bound, strictly greater than min; the range must also be safe. */
  max: number;
}
export interface XYValue {
  x: number;
  y: number;
}
export interface XYPadProps {
  /** Safe integer bounds, with min strictly less than max and a safe integer range. */
  xAxis: XYAxis;
  /** Safe integer bounds and range for the vertical axis. */
  yAxis: XYAxis;
  /** Safe integer coordinates within their axes. */
  value: XYValue;
  /** Receives native input changes or a completed pointer gesture. Cancelled gestures emit nothing. */
  onChange: (value: XYValue) => void;
  /** Disable all inputs and discard the current gesture. */
  disabled?: boolean;
  /** Retain readable values and discard the current gesture; ranges cannot be edited. */
  readOnly?: boolean;
  /** App-owned visual preview of the current draft. Render only; committed effects belong in onChange. */
  children?: (preview: XYValue) => ReactNode;
}

export const formatXYCoordinate = (value: number) =>
  value > 0 ? `+${value}` : String(value);

const position = (value: number, axis: XYAxis) =>
  ((value - axis.min) / (axis.max - axis.min)) * 100;

/** Physical CSS coordinates: X increases rightward and Y downward, including in RTL. */
export function XYPad({
  xAxis,
  yAxis,
  value,
  onChange,
  disabled,
  readOnly,
  children,
}: XYPadProps) {
  const id = useId();
  const [draft, setDraft] = useState<XYValue | null>(null);
  const active = useRef<{
    pointerId: number;
    element: HTMLDivElement;
    source: string;
  } | null>(null);
  const source = [
    value.x,
    value.y,
    xAxis.min,
    xAxis.max,
    yAxis.min,
    yAxis.max,
    Boolean(disabled),
    Boolean(readOnly),
  ].join(':');
  useEffect(() => {
    // External coordinates, bounds or interaction state supersede a gesture.
    const gesture = active.current;
    active.current = null;
    setDraft(null);
    if (gesture?.element.hasPointerCapture(gesture.pointerId))
      gesture.element.releasePointerCapture(gesture.pointerId);
  }, [source]);
  useEffect(
    () => () => {
      const gesture = active.current;
      active.current = null;
      if (gesture?.element.hasPointerCapture(gesture.pointerId))
        gesture.element.releasePointerCapture(gesture.pointerId);
    },
    [],
  );
  // A superseding render restores the controlled preview before the effect runs.
  const previewing = draft !== null && active.current?.source === source;
  const current = previewing ? draft : value;
  const clamp = (n: number, axis: XYAxis) =>
    Math.max(axis.min, Math.min(axis.max, Math.round(n)));
  const point = (event: PointerEvent<HTMLDivElement>): XYValue => {
    const plane = event.currentTarget;
    const rect = plane.getBoundingClientRect();
    return {
      x: clamp(
        xAxis.min +
          ((event.clientX - rect.left - plane.clientLeft) / plane.clientWidth) *
            (xAxis.max - xAxis.min),
        xAxis,
      ),
      y: clamp(
        yAxis.min +
          ((event.clientY - rect.top - plane.clientTop) / plane.clientHeight) *
            (yAxis.max - yAxis.min),
        yAxis,
      ),
    };
  };
  const ownsGesture = (event: PointerEvent<HTMLDivElement>) =>
    !disabled &&
    !readOnly &&
    active.current?.pointerId === event.pointerId &&
    active.current.source === source;
  const cancel = (event: PointerEvent<HTMLDivElement>) => {
    if (active.current?.pointerId !== event.pointerId) return;
    active.current = null;
    setDraft(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const originX = position(Math.max(xAxis.min, Math.min(xAxis.max, 0)), xAxis);
  const originY = position(Math.max(yAxis.min, Math.min(yAxis.max, 0)), yAxis);
  const x = position(current.x, xAxis);
  const y = position(current.y, yAxis);
  const axisControl = (axis: XYAxis, key: 'x' | 'y') => (
    <div className="signature-xy-axis" key={key}>
      <label htmlFor={`${id}-${key}`}>{axis.label}</label>
      <input
        id={`${id}-${key}`}
        aria-describedby={`${id}-orientation`}
        type="range"
        dir="ltr"
        min={axis.min}
        max={axis.max}
        step={1}
        value={current[key]}
        disabled={disabled || readOnly}
        onChange={(event) => {
          if (!disabled && !readOnly)
            onChange({ ...value, [key]: event.currentTarget.valueAsNumber });
        }}
      />
      <ExactValue
        label={`${axis.label} exact value`}
        descriptionId={`${id}-orientation`}
        min={axis.min}
        max={axis.max}
        value={current[key]}
        disabled={disabled}
        readOnly={readOnly}
        onValueCommit={(next) => {
          if (!disabled && !readOnly) onChange({ ...value, [key]: next });
        }}
      />
    </div>
  );
  return (
    <div className="signature-xy-pad" data-previewing={previewing || undefined}>
      <div className="signature-xy-map" dir="ltr" aria-hidden="true">
        <div
          className="signature-xy-plane"
          data-testid="xy-plane"
          data-inactive={disabled || readOnly || undefined}
          style={
            {
              '--xy-origin-x': `${originX}%`,
              '--xy-origin-y': `${originY}%`,
            } as CSSProperties
          }
          onPointerDown={(event) => {
            if (
              disabled ||
              readOnly ||
              !event.isPrimary ||
              event.button !== 0 ||
              active.current !== null
            )
              return;
            active.current = {
              pointerId: event.pointerId,
              element: event.currentTarget,
              source,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
            setDraft(point(event));
          }}
          onPointerMove={(event) => {
            if (ownsGesture(event)) setDraft(point(event));
          }}
          onPointerUp={(event) => {
            if (!ownsGesture(event)) return;
            active.current = null;
            setDraft(null);
            onChange(point(event));
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={cancel}
          onLostPointerCapture={cancel}
        >
          <span className="signature-xy-zero signature-xy-zero-x" />
          <span className="signature-xy-zero signature-xy-zero-y" />
          <span
            className="signature-xy-guide signature-xy-guide-x"
            style={{ top: `${y}%`, left: 0, width: `${x}%` }}
          />
          <span
            className="signature-xy-guide signature-xy-guide-y"
            style={{ top: `${y}%`, left: `${x}%`, height: `${100 - y}%` }}
          />
          <span
            className="signature-xy-puck"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
          <span className="signature-xy-axis-letter signature-xy-letter-y">
            Y
          </span>
          <span className="signature-xy-axis-letter signature-xy-letter-x">
            X
          </span>
        </div>
        <div className="signature-xy-ticks signature-xy-ticks-x">
          <span>{xAxis.min}</span>
          {xAxis.min < 0 && xAxis.max > 0 && (
            <span style={{ left: `${originX}%` }}>0</span>
          )}
          <span>{xAxis.max}</span>
        </div>
        <div className="signature-xy-ticks signature-xy-ticks-y">
          <span>{yAxis.min}</span>
          {yAxis.min < 0 && yAxis.max > 0 && (
            <span style={{ top: `${originY}%` }}>0</span>
          )}
          <span>{yAxis.max}</span>
        </div>
      </div>
      <div className="signature-xy-sidebar">
        <div className="signature-xy-readouts" dir="ltr">
          {(['x', 'y'] as const).map((key) => (
            <div className="signature-xy-readout" key={key}>
              <span>{key.toUpperCase()}</span>
              <output
                aria-label={`${key === 'x' ? xAxis.label : yAxis.label} preview`}
              >
                <bdi dir="ltr">{formatXYCoordinate(current[key])}</bdi>
              </output>
            </div>
          ))}
        </div>
        {children?.(current)}
      </div>
      <p className="signature-xy-orientation" id={`${id}-orientation`}>
        X increases right · Y increases down
      </p>
      <div className="signature-xy-axes">
        {axisControl(xAxis, 'x')}
        {axisControl(yAxis, 'y')}
      </div>
    </div>
  );
}
